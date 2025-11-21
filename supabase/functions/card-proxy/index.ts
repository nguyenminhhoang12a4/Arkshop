import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Lấy cấu hình từ Supabase Secrets
const PARTNER_ID = Deno.env.get('DOITHE1S_PARTNER_ID')
const PARTNER_KEY = Deno.env.get('DOITHE1S_PARTNER_KEY')
const DOITHE_URL = 'https://doithe1s.vn/chargingws/v2'

// Hàm tạo chữ ký MD5 (Giống hệt logic PHP: md5(partner_key + code + serial))
async function createMD5(text: string) {
  const message = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", message);
  return new TextDecoder().decode(encode(new Uint8Array(hashBuffer)));
}

serve(async (req) => {
  // Xử lý CORS cho trình duyệt
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Kết nối Supabase với quyền Admin (Service Role) để được phép cộng tiền
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...payload } = await req.json()

    // ==================================================================
    // CASE 1: CLIENT GỬI THẺ (Từ Card.jsx -> Doithe1s)
    // ==================================================================
    if (action === 'submit_card') {
      const { telco, amount, serial, code } = payload
      
      // 1. Xác thực người dùng gửi yêu cầu
      const authHeader = req.headers.get('Authorization')!
      const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      if (authError || !user) throw new Error('Bạn cần đăng nhập để nạp thẻ')

      // 2. Tạo mã đơn hàng (Request ID) duy nhất
      const requestId = crypto.randomUUID().split('-')[0] + Date.now().toString().slice(-4);

      // 3. Tạo chữ ký gửi sang đối tác
      const sign = await createMD5(PARTNER_KEY + code + serial)

      // 4. Chuẩn bị dữ liệu gửi đi (Format x-www-form-urlencoded giống PHP)
      const params = new URLSearchParams();
      params.append('request_id', requestId);
      params.append('code', code);
      params.append('partner_id', PARTNER_ID!);
      params.append('serial', serial);
      params.append('telco', telco);
      params.append('amount', amount);
      params.append('command', 'charging');
      params.append('sign', sign);

      // 5. Gọi API doithe1s
      console.log(`Sending card: ${requestId} - ${telco} - ${amount}`);
      const response = await fetch(DOITHE_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params 
      });
      
      const result = await response.json();
      console.log('Result from partner:', result);

      // 6. Lưu vào Database (Trạng thái ban đầu là pending hoặc failed)
      const declaredAmount = parseInt(amount);
      
      // Tính tiền khách nhận (Garena 15%, Khác 20%)
      const discountRate = telco === 'GARENA' ? 0.15 : 0.20;
      const receivedAmount = declaredAmount * (1 - discountRate);

      // Status 99 là chờ xử lý, các số khác là lỗi ngay lập tức
      const initialStatus = result.status == 99 ? 'pending' : 'failed'; 

      await supabase.from('card_transactions').insert({
        user_id: user.id,
        request_id: requestId,
        trans_id: result.trans_id || 0, // Lưu trans_id của họ để đối soát
        telco, code, serial,
        declared_amount: declaredAmount,
        received_amount: receivedAmount,
        status: initialStatus,
        message: result.message || 'Đang xử lý...'
      });

      // Trả kết quả về cho Card.jsx hiển thị
      return new Response(JSON.stringify({ 
        success: result.status == 99,
        request_id: requestId,
        message: result.message 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // ==================================================================
    // CASE 2: CALLBACK TỪ DOITHE1S (Doithe1s -> Web của mình)
    // ==================================================================
    // Logic này chạy khi đối tác gọi lại URL của bạn để báo kết quả
    else if (payload.callback_sign) {
      console.log('Received Callback:', payload);

      // 1. Kiểm tra chữ ký bảo mật (Tránh giả mạo kết quả)
      // Formula PHP: md5($partner_key . $jsonBody->code . $jsonBody->serial)
      const mySign = await createMD5(PARTNER_KEY + payload.code + payload.serial);
      
      if (payload.callback_sign !== mySign) {
        console.error('Wrong signature!');
        return new Response(JSON.stringify({ status: false, message: 'Sai chữ ký' }), { status: 400 });
      }

      // 2. Tìm đơn hàng trong Database bằng request_id
      const { data: trans } = await supabase
        .from('card_transactions')
        .select('*')
        .eq('request_id', payload.request_id)
        .single();

      if (!trans) return new Response(JSON.stringify({ status: false, message: 'Không tìm thấy đơn' }));
      
      // Nếu đơn đã xử lý rồi thì bỏ qua
      if (trans.status === 'success' || trans.status === 'wrong_amount') {
        return new Response(JSON.stringify({ status: true, message: 'Đã xử lý trước đó' }));
      }

      // 3. Xử lý kết quả (Status 1: Thành công, 2: Sai mệnh giá, 3: Lỗi)
      let newStatus = 'failed';
      let finalAmount = 0;

      if (payload.status == 1) {
        // --- THẺ ĐÚNG ---
        newStatus = 'success';
        
        // Tính toán lại số tiền thực nhận dựa trên MỆNH GIÁ THỰC (payload.value)
        // Đề phòng khách chọn sai mệnh giá nhưng thẻ vẫn đúng
        const realValue = parseInt(payload.value);
        const discountRate = trans.telco === 'GARENA' ? 0.15 : 0.20;
        finalAmount = realValue * (1 - discountRate);

        // Cộng tiền cho user (Gọi hàm RPC an toàn)
        const { error: rpcError } = await supabase.rpc('increment_balance', { 
          user_id_param: trans.user_id, 
          amount_param: finalAmount 
        });
        
        if (rpcError) console.error('Lỗi cộng tiền:', rpcError);

      } else if (payload.status == 2) {
        // --- SAI MỆNH GIÁ ---
        // Logic: Thẻ đúng nhưng sai mệnh giá -> Vẫn cộng tiền nhưng phạt 50% số thực nhận?
        // Ở đây mình để tạm là 'wrong_amount' và CỘNG TIỀN THEO MỆNH GIÁ THỰC (Phạt hay không tùy bạn sửa logic)
        newStatus = 'wrong_amount';
        
        const realValue = parseInt(payload.value);
        const discountRate = trans.telco === 'GARENA' ? 0.15 : 0.20;
        // Ví dụ: Phạt thêm 50% vì sai mệnh giá
        finalAmount = (realValue * (1 - discountRate)) * 0.5; 

        await supabase.rpc('increment_balance', { 
          user_id_param: trans.user_id, 
          amount_param: finalAmount 
        });
      } 
      // Status 3, 4... là lỗi, giữ nguyên 'failed', không cộng tiền.

      // 4. Cập nhật trạng thái đơn vào Database
      await supabase.from('card_transactions')
        .update({ 
          status: newStatus, 
          message: payload.message,
          received_amount: finalAmount, // Cập nhật lại số tiền thực nhận cuối cùng
          updated_at: new Date().toISOString()
        })
        .eq('id', trans.id);

      return new Response(JSON.stringify({ status: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    throw new Error('Hành động không hợp lệ')

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})