
// --- Cấu hình tên Shop ---
export const shopDisplayNames = {
  A: "Shop Pass AD + Amber ",
  B: "Shop Bản vẽ",
  C: "Shop Vật Phẩm",
  D: "Shop Skin",
  E: "Shop Thú",
  F: "Shop Đảo"
};

// --- Cấu hình Kiểu dáng Ảnh ---
export const shopImageStyles = {
  A: "aspect-[228/228]",
  B: "aspect-[1792/576]",
  C: "aspect-[1792/576]",
  D: "aspect-[228/228]",
  E: "aspect-[1600/900]",//"aspect-video"
  F: "aspect-[1600/900]"

};

// --- Dữ liệu sản phẩm ---
const productMasterList = {
  A: [
    { name: "X1 Gói Normal ", price: "159.000đ / 30 ngày" },
    { name: "X1 Gói Silver", price: "199.000đ/ 30 ngày" },
    { name: "X1 Gói Gold", price: "249.000đ / 30 ngày" },
    { name: "X1 Gói Normal ", price: "1599.000đ / Vĩnh Viễn" },
    { name: "X1 Gói Silver", price: "1999.000đ / Vĩnh Viễn" },
    { name: "X1 Gói Gold", price: "2499.000đ / Vĩnh Viễn" },
    { name: "X10.000 Amber", price: "20.000đ" },
    { name: "X50.000 Amber", price: "50.000đ" },
    { name: "X100.000 Amber", price: "89.000đ" },
    // ... (thêm các sản phẩm khác của Shop A) ...
    { name: "X3.000.000 Amber", price: "99.000đ" },
    { name: "X3.000.000.000 Amber", price: "199.000đ" }

  ],
  B: [
    { name: "Bản vẽ Súng tek", price: "50.000đ" },//1
    { name: "Bản vẽ Nón Tek", price: "20.000đ" },//2
    { name: "Bản vẽ Áo Tek", price: "20.000đ" },//3
    { name: "Bản vẽ Quần Tek", price: "20.000đ" },//4
    { name: "Bản vẽ Ủng Tek", price: "20.000đ" },//5
    { name: "Bản vẽ Tay Tek", price: "20.000đ" },//6
    { name: "Bản vẽ Mặt nạ Tek", price: "20.000đ " },//7
    { name: "Bản vẽ khiên Tek", price: "20.000đ " },//8
    { name: "Bản vẽ Tek Teleporter", price: "50.000đ" },//9
    { name: "Bản vẽ Tek Kibble", price: "50.000đ " },//10
    { name: "Bản vẽ Tek Gen", price: "50.000đ" },//11
    { name: "Bản vẽ Nón Riot", price: "20.000đ" },//12
    { name: "Bản vẽ Áo Riot ", price: "20.000đ" },//13
    { name: "Bản vẽ Quần Riot ", price: "20.000đ" },//14
    { name: "Bản vẽ Ủng Riot ", price: "20.000đ" },//15
    { name: "Bản vẽ Tay Riot ", price: "20.0000đ" },//16
    { name: "Bản vẽ Khiên riot", price: "20.000đ" },//17
    { name: "Bản vẽ Nón Sắt", price: "20.000đ" },//18
    { name: "Bản vẽ Áo Sắt", price: "20.000đ" },//19
    { name: "Bản vẽ Quần Sắt", price: "20.000đ " },//20
    { name: "Bản vẽ Ủng Sắt", price: "20.000đ " },//21
    { name: "Bản vẽ Tay Sắt", price: "20.000đ" },//22
    { name: "Bản vẽ Liềm Sắt", price: "20.000đ " },//23
    { name: "Bản vẽ Cuốc Sắt", price: "20.000đ " },//24
    { name: "Bản vẽ Longneck", price: "50.000đ" },//25
    { name: "Bản vẽ Rocket", price: "50.000đ" },//26
    { name: "Bản vẽ Súng Rifle", price: "50.000đ" },//27
    { name: "Bản vẽ Cung", price: "50.000đ" },//28
    { name: "Bản vẽ Nỏ", price: "40.000đ" },//29
    { name: "Bản vẽ Shotgun", price: "40.000đ" },//30
    { name: "Bản vẽ Sniper", price: "50.000đ" },//31
    { name: "Bản vẽ Rìu", price: "20.000đ" },//32
    { name: "Bản vẽ Kiếm", price: "40.000đ" },//33
    { name: "Bản vẽ Kẹo", price: "30.000đ" },//34
    { name: "Bản vẽ yên Tusoteuthis", price: "30.000đ" },//35
    { name: "Bản vẽ yên Stego", price: "30.000đ" },//36
    { name: "Bản vẽ yên Dire Bear", price: "30.000đ" },//37
    { name: "Bản vẽ yên Arthropluera", price: "30.000đ" },//38
    { name: "Bản vẽ yên Tek Megalodon", price: "50.000đ" },//39
    { name: "Bản vẽ Yên Sabertooth", price: "30.000đ" },//40
    { name: "Bản vẽ Yên Woolly", price: "30.000đ" },//41
    { name: "Bản vẽ Yên Raptor", price: "30.000đ" },//42
    { name: "Bản vẽ Yên Giganotosaurus", price: "30.000đ" },//43
    { name: "Bản vẽ Yên Mosasaur Platform", price: "30.000đ" },//44
    { name: "Bản vẽ Yên Trike", price: "30.000đ" },//45
    { name: "Bản vẽ Yên Woolly ", price: "30.000đ" },//46
    { name: "Bản vẽ Yên Pteranodon", price: "30.000đ" },//47
    { name: "Bản vẽ Yên Báilosaurus", price: "30.000đ" },//48
    { name: "Bản vẽ Yên Allosaurus", price: "30.000đ" },//49
    { name: "Bản vẽ Yên Daeodon", price: "30.000đ" },//50
    { name: "Bản vẽ Yên Tapejara Tek", price: "40.000đ" },//51
    { name: "Bản vẽ Yên Gallomimus", price: "30.000đ" },//52
    { name: "Bản vẽ Yên Dire Bear", price: "30.000đ" },//53
    { name: "Bản vẽ Yên plesiosaur Platform", price: "30.000đ" },//54
    { name: "Bản vẽ Yên Tapejara ", price: "30.000đ" },//55
    { name: "Bản vẽ Yên Bronto Platform", price: "30.000đ" },//56
    { name: "Bản vẽ Yên Argentavis", price: "30.000đ" },//57
    { name: "Bản vẽ Yên Quetz Platform", price: "30.000đ" },//58
    { name: "Bản vẽ Yên Sabertooth ", price: "30.000đ" },//59
    { name: "Bản vẽ Yên Therizinosaurus", price: "30.000đ" },//60
    { name: "Bản vẽ Yên Sabertooth ", price: "30.000đ" },//61
    { name: "Bản vẽ yên Bronto", price: "30.000đ" },//62
    { name: "Bản vẽ Yên Ankylo", price: "30.000đ" },//63
    { name: "Bản vẽ Yên Mammoth", price: "30.000đ" }//64
    // ... (thêm các sản phẩm khác của Shop B) ...

  ],
  C: [
     { name: "Súng tek", price: "10.000đ" },//1
    { name: "Nón Tek", price: "10.000đ " },//2
    { name: "Áo Tek", price: "10.000đ " },//3
    { name: "Quần Tek", price: "10.000đ " },//4
    { name: "Ủng Tek", price: "10.000đ " },//5
    { name: "Tay Tek", price: "10.000đ " },//6
    { name: "Mặt nạ Tek", price: "10.000đ " },//7
    { name: "khiên Tek", price: "10.000đ " },//8
    { name: "Tek Teleporter", price: "10.000đ " },//9
    { name: "Tek Kibble", price: "10.000đ " },//10
    { name: "Tek Gen", price: "10.000đ " },//11
    { name: "Nón Riot", price: "10.000đ " },//12
    { name: "Áo Riot ", price: "10.000đ " },//13
    { name: "Quần Riot ", price: "10.000đ " },//14
    { name: "Ủng Riot ", price: "10.000đ " },//15
    { name: "Tay Riot ", price: "10.000đ " },//16
    { name: "Khiên riot", price: "10.000đ " },//17
    { name: "Nón Sắt", price: "10.000đ " },//18
    { name: "Áo Sắt", price: "10.000đ " },//19
    { name: "Quần Sắt", price: "10.000đ " },//20
    { name: "Ủng Sắt", price: "10.000đ " },//21
    { name: "Tay Sắt", price: "10.000đ "},//22
    { name: "Liềm Sắt", price: "10.000đ " },//23
    { name: "Cuốc Sắt", price: "10.000đ " },//24
    { name: "Longneck", price: "10.000đ "},//25
    { name: "Rocket", price: "10.000đ " },//26
    { name: "Súng Rifle", price: "10.000đ " },//27
    { name: "Cung", price: "10.000đ " },//28
    { name: "Nỏ", price: "10.000đ " },//29
    { name: "Shotgun", price: "10.000đ " },//30
    { name: "Sniper", price: "10.000đ " },//31
    { name: "Rìu", price: "10.000đ " },//32
    { name: "Kiếm", price: "10.000đ " },//33
    { name: "Kẹo", price: "10.000đ " },//34
    { name: "Yên Tusoteuthis", price: "10.000đ " },//35
    { name: "Yên Stego", price: "10.000đ " },//36
    { name: "Yên Dire Bear", price: "10.000đ " },//37
    { name: "Yên Arthropluera", price: "10.000đ " },//38
    { name: "Yên Tek Megalodon", price: "10.000đ " },//39
    { name: "Yên Sabertooth", price: "10.000đ " },//40
    { name: "Yên Woolly", price: "10.000đ " },//41
    { name: "Yên Raptor", price: "10.000đ " },//42
    { name: "Yên Giganotosaurus", price: "10.000đ " },//43
    { name: "Yên Mosasaur Platform", price: "10.000đ " },//44
    { name: "Yên Trike", price: "10.000đ " },//45
    { name: "Yên Woolly ", price: "10.000đ " },//46
    { name: "Yên Pteranodon", price: "10.000đ " },//47
    { name: "Yên Báilosaurus", price: "10.000đ "},//48
    { name: "Yên Allosaurus", price: "10.000đ " },//49
    { name: "Yên Daeodon", price: "10.000đ " },//50
    { name: "Yên Tapejara Tek", price: "10.000đ " },//51
    { name: "Yên Gallomimus", price: "10.000đ " },//52
    { name: "Yên Dire Bear", price: "10.000đ " },//53
    { name: "Yên plesiosaur Platform", price: "10.000đ " },//54
    { name: "Yên Tapejara ", price: "10.000đ" },//55
    { name: "Yên Bronto Platform", price: "10.000đ " },//56
    { name: "Yên Argentavis", price: "10.000đ " },//57
    { name: "Yên Quetz Platform", price: "10.000đ " },//58
    { name: "Yên Sabertooth ", price: "10.000đ " },//59
    { name: "Yên Therizinosaurus", price: "10.000đ " },//60
    { name: "Yên Sabertooth ", price: "10.000đ " },//61
    { name: "yên Bronto", price: "10.000đ " },//62
    { name: "Yên Ankylo", price: "10.000đ " },//63
    { name: "Yên Mammoth", price: "10.000đ " }//64
    // ... (thêm các sản phẩm khác của Shop B) ...
  ],
  D: [
     { name: "X1 Skin Angle Costume ", price: "20.000đ" },
     { name: "X1 Skin Beta Tester Hat", price: "20.000đ" },
     { name: "X1 Skin Captain hat", price: "20.000đ" },
     { name: "X1 Skin Cat Mask", price: "20.000đ" },
     { name: "X1 Skin Cute Dino Helmet", price: "20.000đ" },
     { name: "X1 Skin Devil Horms", price: "20.000đ" },
     { name: "X1 Skin Dodorex Mask", price: "20.000đ" },
     { name: "X1 Skin Dog Mask", price: "20.000đ" },
     { name: "X1 Skin Easter Chick", price: "20.000đ" },
     { name: "X1 Skin Gold Crown", price: "20.000đ" },
     { name: "X1 Skin Graft Camo", price: "20.000đ" },
     { name: "X1 Skin Graft Colorbomb", price: "20.000đ" },
     { name: "X1 Skin Graft Eerie", price: "25.000đ" },
     { name: "X1 Skin Graft Glacial", price: "20.000đ" },
     { name: "X1 Skin Graft Golden", price: "20.000đ" },
     { name: "X1 Skin Graft Metallurgic", price: "20.000đ" },
     { name: "X1 Skin Graft Molten", price: "25.000đ" },
     { name: "X1 Skin Graft Woodland", price: "20.000đ" },
     { name: "X1 Skin Graft Ultimacy", price: "30.000đ" },
     { name: "X1 Skin Graft War Paint", price: "20.000đ" },
     { name: "X1 Skin Graft Petrified", price: "20.000đ" },
     { name: "X1 Skin Ladybug Antennae", price: "20.000đ" },
     { name: "X1 Skin Vampire Eyes", price: "20.000đ" },
     { name: "X1 Skin Werewold Mask", price: "20.000đ" },
     { name: "X1 Skin Witch Hat", price: "20.000đ" },
     { name: "X1 Tek Gen ", price: "5.000đ" },
     { name: "X1 Tek Kibble", price: "5.000đ" },
     { name: "X1 Tek Teleport", price: "5.000đ" },
     { name: "X1 Kibble Griffin", price: "5.000đ" },
     { name: "X1  Turret 7m", price: "2.000đ" },
     { name: "X1000  Metal Ingot", price: "1.000đ" },
     { name: "X1  Plan X", price: "2.000đ" },
     { name: "X1000  Polymer", price: "1.000đ" },
     { name: "X1000  Silica Pearls", price: "1.000đ" },
     { name: "X1000  Cementing Paste", price: "1.000đ" },
     { name: "X1000  Crystak", price: "1.000đ" },
     { name: "X2000  Element", price: "5.000đ" },
     { name: "X1000  Fiber", price: "1.000đ" },
     { name: "X1000  Hide", price: "1.000đ" }
     
    // ... (thêm các sản phẩm khác của Shop D) ...
    // { name: "Mặt nạ (Scuba)", price: "80000đ" }
  ],
  E: [
    // { name: "Sản phẩm E1", price: "10000đ" },
    { name: "X1 Cặp Allosaurus", price: "50.000đ" },//1
    // ... (thêm các sản phẩm khác của Shop D) ...
    { name: "X1 Cặp Ankylo  ",price: "50.000đ" }, //2
    { name: "X1 Cặp Ankylo ", price: "50.000đ" },//3
    { name: "X1 Cặp Ankylo " ,price: "50.000đ" },//4
    { name: "X1 Cặp Archaeopteryx", price: "40.000đ" },//5
    { name: "X1 Cặp Argentavis ", price: "50.000đ" },
    { name: "X1 Cặp Argentavis ", price: "50.000đ" },
    { name: "X1 Cặp Argentavis ", price: "50.000đ" },
    { name: "X1 Cặp Baryonyx", price: "50.000đ" },
    { name: "X1 Cặp Basilosaurus", price: "50.000đ" },
    { name: "X1 Cặp Dire Bear", price: "50.000đ" },
    { name: "X1 Cặp Beelzebufo", price: "50.000đ" },
    { name: "X1 Cặp Terror Bird", price: "50.000đ" },
    { name: "X1 Bronto ", price: "45.000đ" },
    { name: "X1 Bronto ", price: "40.000đ" },
    { name: "X1 Cặp Bronto ", price: "50.000đ" },//16
    { name: "X1 Bronto", price: "60.000đ" },
    { name: "X1 Cặp Troodon", price: "40.000đ" },
    { name: "X1 Cặp Carbonemys", price: "40.000đ" },
    { name: "X1 Cặp Daeodon", price: "60.000đ" },
    { name: "X1 Cặp Daeodon", price: "40.000đ" },
    { name: "X1 Diplodocus ", price: "50.000đ" },
    { name: "X1 Cặp Diplodocus", price: "50.000đ" },
    { name: "X1 Cặp Dodo", price: "40.000đ" },
    { name: "X1 Cặp Doedicurus", price: "50.000đ" },
    { name: "X1 Cặp Equus", price: "50.000đ" },
    { name: "X1 Cặp Equus", price: "60.000đ" },
    { name: "X1 Cặp Unicons", price: "60.000đ" },
    { name: "X1 Cặp Plesiosaur", price: "50.000đ" },
    { name: "X1 Cặp Griffin", price: "60.000đ" },
    { name: "X1 Cặp Griffin", price: "70.000đ" },
    { name: "X1 Giganotosaurus ", price: "70.000đ" },
    { name: "X1 Cặp Giganotosaurus", price: "60.000đ" },
    { name: "X1 Cặp Giganotosaurus", price: "60.000đ" },
    { name: "X1 Cặp Iguanadon", price: "40.000đ" },
    { name: "X1 Cặp Megatherium", price: "60.000đ" },
    { name: "X1 Cặp Megaloceros", price: "40.000đ" },
    { name: "X1 Cặp Mosasaurus", price: "60.000đ" },
    { name: "X1 Cặp Otto", price: "40.000đ" },
    { name: "X1 Cặp Pachy", price: "40.000đ" },
    { name: "X1 Paraceratherium", price: "50.000đ" },
    { name: "X1 Cặp Paraceratherium", price: "50.000đ" },
    { name: "X1 Cặp Parasaur", price: "40.000đ" },
    { name: "X1 Cặp Procoptodon", price: "50.000đ" },
    { name: "X1 Cặp Pteranodon", price: "50.000đ" },
    { name: "X1 Cặp Purlovia", price: "50.000đ" },
    { name: "X1 Cặp Quetzal", price: "50.000đ" },
    { name: "X1 Quetzal ", price: "60.000đ" },
    { name: "X1 Cặp Quetzal", price: "60.000đ" },
    { name: "X1 Quetzal 500sp", price: "60.000đ" },
    { name: "X1 Cặp Quetzal", price: "70.000đ" },
    { name: "X1 Cặp Raptor", price: "40.000đ" },
    { name: "X1 Cặp Rex", price: "50.000đ" },
    { name: "X1 Rex ", price: "40.000đ" },
    { name: "X1 Cặp Spinosaurus", price: "55.000đ" },
    { name: "X1 Cặp Stegosaurus", price: "50.000đ" },
    { name: "X1 Cặp Tapejara", price: "50.000đ" },
    { name: "X1 Tapejara 500SP", price: "60.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "50.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "50.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "50.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "50.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "70.000đ" },
    { name: "X1 Cặp Therizinosaurus", price: "70.000đ" },
    { name: "X1 Cặp Triceratops", price: "40.000đ" },
    { name: "X1 Tusoteuthis ", price: "70.000đ" },
    { name: "X1 Cặp Tusoteuthis", price: "60.000đ" },
    { name: "X1 Tusoteuthis ", price: "70.000đ" },
    { name: "X1 Cặp Tusoteuthis", price: "50.000đ" },
    { name: "X1 Cặp Wolf", price: "40.000đ" },
    { name: "X1 Cặp Woolly Rhino", price: "50.000đ" },
    { name: "X1 Cặp Woolly Rhino", price: "60.000đ" },
    { name: "X1 Cặp Castoroides", price: "40.000đ" },
    { name: "X1 Cặp Dimetrodon", price: "40.000đ" },
    { name: "X1 Cặp Carnotaurus", price: "50.000đ" },
    { name: "X1 Cặp Dilophosaur", price: "40.000đ" },
    { name: "X1 Cặp Mammoth", price: "50.000đ" },
    { name: "X1 Cặp Megalosaurus", price: "50.000đ" },
    { name: "X1 Cặp Sabertooth", price: "50.000đ" },
    { name: "X1 Cặp Sarco", price: "50.000đ" },
    { name: "X1 Cặp Mesopothecus", price: "40.000đ" },
    { name: "X1 Cặp Moschops", price: "40.000đ" }
  ],
    F: [
    // { name: "Sản phẩm E1", price: "10000đ" },
    { name: "X1 Đảo Doedicurus", price: "100.000đ" },//1
    { name: "X1 Đảo Doedicurus",price: "100.000đ" }, //2
    { name: "X1 Đảo Noctis", price: "100.000đ" },//3
    { name: "X1 Đảo Dodobitus",price: "100.000đ" }, //2
    { name: "X1 Đảo Cnidaria", price: "100.000đ" },//3
    { name: "X1 Đảo Noctis" ,price: "100.000đ" }//4
  
  ]
};

// --- Hàm tạo dữ liệu ---
const createShopData = (shopLetter) => {
  const productList = productMasterList[shopLetter] || [];
  return productList.map((productDetails, i) => {
    const productIndex = i + 1;
    return {
      id: `${shopLetter}${productIndex}`,
      name: productDetails.name,
      price: productDetails.price,
      imageUrl: `/assets/Hinh${shopLetter}_${productIndex}.png`
    };
  });
};

// --- Dữ liệu ban đầu để export ---
export const initialProductData = {
  A: createShopData('A'),
  B: createShopData('B'),
  C: createShopData('C'),
  D: createShopData('D'),
  E: createShopData('E'),
  F: createShopData('F'),
};

