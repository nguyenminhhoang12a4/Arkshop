// supabase/functions/card-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.110.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Lấy biến môi trường (Cấu hình trên Dashboard Supabase)
    const PARTNER_ID = Deno.env.get('DOITHE_PARTNER_ID')!
    const PARTNER_KEY = Deno.env.get('DOITHE_PARTNER_KEY')!
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Client Admin để cập nhật DB (bypass RLS)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const url = new URL(req.url)
    
    // =========================================================
    // TRƯỜNG HỢP 1: CALLBACK TỪ DOITHE1S.VN (Họ gọi mình)
    // =========================================================
    // Doithe1s có thể gửi GET hoặc POST JSON, ta xử lý cả 2
    if (url.searchParams.get('callback_sign') || req.method === 'POST') {
        let data: any = {};
        
        // Check xem data đến từ đâu (Query params hay Body)
        // Code mẫu PHP dùng json body, ta ưu tiên check body trước
        try {
            const bodyText = await req.text();
            if(bodyText) data = JSON.parse(bodyText);
        } catch (e) {
            // Nếu không phải JSON, lấy từ query params (dự phòng)
            url.searchParams.forEach((value, key) => { data[key] = value });
        }

        // Nếu đây là request từ doithe1s (có callback_sign)
        if (data.callback_sign) {
             console.log("Nhận callback:", data);

            // Kiểm tra chữ ký bảo mật (MD5)
            // PHP: md5($partner_key . $code . $serial)
            const rawSign = PARTNER_KEY + data.code + data.serial;
            const hashBuffer = await crypto.subtle.digest("MD5", new TextEncoder().encode(rawSign));
            const validSign = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

            if (data.callback_sign !== validSign) {
                return new Response(JSON.stringify({ status: 403, message: 'Invalid Sign' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }

            // Xử lý kết quả
            // status = 1 (Thành công), 2 (Sai mệnh giá - vẫn tính tiền theo thực tế), 3 (Lỗi), 99 (Chờ)
            if (data.status == 1 || data.status == 2) {
                // Gọi hàm SQL để cộng tiền an toàn
                const { error: rpcError } = await supabaseAdmin.rpc('process_card_success', {
                    p_request_id: data.request_id,
                    p_value: data.value, // Mệnh giá thực tế nhận được
                    p_telco: data.telco,
                    p_trans_id: data.trans_id
                });
                if (rpcError) console.error("Lỗi cộng tiền:", rpcError);
            } else if (data.status == 3) {
                 // Cập nhật trạng thái thất bại
                 await supabaseAdmin.from('card_transactions')
                    .update({ status: 'failed', message: data.message })
                    .eq('request_id', data.request_id);
            }

            return new Response(JSON.stringify({ status: 200, message: 'Updated' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
    }

    // =========================================================
    // TRƯỜNG HỢP 2: CLIENT (REACT) GỬI YÊU CẦU NẠP THẺ
    // =========================================================
    const reqBody = await req.json()
    const { telco, amount, serial, code, user_id } = reqBody

    if (!telco || !amount || !serial || !code || !user_id) {
        throw new Error("Thiếu thông tin thẻ")
    }

    // Tạo Request ID ngẫu nhiên
    const request_id = Math.floor(Math.random() * 1000000000).toString();

    // 1. Lưu vào DB trạng thái Pending trước (để có bằng chứng đối soát)
    const { error: dbError } = await supabaseAdmin.from('card_transactions').insert({
        user_id: user_id,
        telco, code, serial,
        declared_amount: amount,
        received_amount: 0, // Chưa nhận đc
        request_id: request_id,
        status: 'pending'
    })

    if (dbError) throw dbError;

    // 2. Tạo chữ ký gửi đi (MD5)
    // PHP: md5($partner_key.$code.$serial)
    const signString = PARTNER_KEY + code + serial;
    const hashBuffer = await crypto.subtle.digest("MD5", new TextEncoder().encode(signString));
    const sign = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // 3. Gửi sang doithe1s.vn
    const formData = new FormData();
    formData.append('telco', telco);
    formData.append('code', code);
    formData.append('serial', serial);
    formData.append('amount', amount);
    formData.append('request_id', request_id);
    formData.append('partner_id', PARTNER_ID);
    formData.append('sign', sign);
    formData.append('command', 'charging');

    const response = await fetch('https://doithe1s.vn/chargingws/v2', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    // Cập nhật thông báo lỗi ngay nếu API trả về lỗi tức thì
    if (result.status > 3 && result.status != 99) {
         await supabaseAdmin.from('card_transactions')
            .update({ status: 'failed', message: result.message })
            .eq('request_id', request_id);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})