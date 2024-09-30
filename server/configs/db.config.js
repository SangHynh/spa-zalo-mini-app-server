const mongoose = require("mongoose");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const generateRandomPhoneNumber = require("../utils/genData.util");
const createTestData = require("../utils/generateTestData");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
    });
    console.log("Connected to MongoDB successfully");
    //await testAdd();

    // GENERATE TEST DATA
    // createTestData()
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// // TEST ADD DATA
// async function testAdd() {
//   try {
//     const productNames = ["Product A", "Product B", "Product C", "Product D", "Product E", "Product F"];
//     const productIds = ["12345", "67890", "54321", "11223", "33445", "55667"];
    
//     for (let i = 1; i <= 6; i++) { // Tạo 6 người dùng
//       const user = new User({
//         name: `John Doe ${i}`, // Tên thay đổi theo từng người dùng
//         phone: generateRandomPhoneNumber(),
//         role: "User",
//         membershipTier: i % 2 === 0 ? "Gold" : "Silver", // Thay đổi theo từng người
//         points: 100 + i * 10, // Tăng dần số điểm theo người dùng
//         referralCode: `ABC123${i}`, // Mã giới thiệu thay đổi theo người dùng
//         productSuggestions: [
//           {
//             productId: productIds[0],  // Sản phẩm giống nhau
//             productName: productNames[0],  // Tên sản phẩm giống nhau
//             suggestedScore: 8.5 + i * 0.1,  // Điểm gợi ý thay đổi nhẹ
//           },
//           {
//             productId: productIds[i % productIds.length], // Thay đổi sản phẩm cho mỗi người
//             productName: productNames[i % productNames.length], // Tên sản phẩm thay đổi
//             suggestedScore: 9.0 + i * 0.2, // Điểm gợi ý thay đổi
//           }
//         ]
//       });

//       const userResult = await user.save();
//       console.log(`User ${i} created successfully:`, userResult);
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//   }
// }

// // Gọi hàm để test
// testAdd();


// // Call the testAdd function to test it
// // TEST ADD PRODUCT với dữ liệu đa dạng hơn
// async function testAddProducts() {
//   try {
//     const productNames = ["Kem dưỡng da", "Sữa rửa mặt", "Mặt nạ ngủ", "Tinh chất dưỡng", "Toner", "Kem chống nắng"];
//     const descriptions = [
//       "Kem dưỡng da cấp ẩm sâu cho da khô",
//       "Sữa rửa mặt kiểm soát dầu cho da nhờn",
//       "Mặt nạ ngủ phục hồi da ban đêm",
//       "Tinh chất dưỡng da sáng mịn",
//       "Toner làm sạch và cân bằng da",
//       "Kem chống nắng bảo vệ da khỏi UV"
//     ];
//     const prices = [200000, 150000, 250000, 300000, 120000, 180000];
//     const categories = ["Skincare", "Skincare", "Skincare", "Skincare", "Skincare", "Suncare"];
//     const stocks = [100, 80, 50, 60, 90, 120];

//     const variantsArray = [
//       [{ volume: "100ml", price: 150000, stock: 50 }, { volume: "200ml", price: 200000, stock: 30 }],
//       [{ volume: "150ml", price: 120000, stock: 60 }, { volume: "300ml", price: 200000, stock: 20 }],
//       [{ volume: "50ml", price: 200000, stock: 25 }, { volume: "100ml", price: 300000, stock: 15 }],
//       [{ volume: "30ml", price: 300000, stock: 20 }, { volume: "50ml", price: 450000, stock: 10 }],
//       [{ volume: "200ml", price: 120000, stock: 70 }, { volume: "500ml", price: 250000, stock: 40 }],
//       [{ volume: "50ml", price: 180000, stock: 60 }, { volume: "100ml", price: 300000, stock: 30 }]
//     ];

//     const ingredientsArray = [
//       [{ name: "Dầu jojoba", percentage: 10 }, { name: "Vitamin E", percentage: 5 }],
//       [{ name: "Chiết xuất trà xanh", percentage: 15 }, { name: "AHA", percentage: 3 }],
//       [{ name: "Aloe Vera", percentage: 20 }, { name: "Collagen", percentage: 10 }],
//       [{ name: "Niacinamide", percentage: 5 }, { name: "Hyaluronic Acid", percentage: 2 }],
//       [{ name: "Hoa hồng", percentage: 8 }, { name: "Vitamin B5", percentage: 4 }],
//       [{ name: "Zinc Oxide", percentage: 18 }, { name: "Titanium Dioxide", percentage: 10 }]
//     ];

//     const benefitsArray = [
//       ["Dưỡng ẩm", "Làm sáng da"],
//       ["Làm sạch sâu", "Kiểm soát dầu"],
//       ["Phục hồi da", "Cấp ẩm ban đêm"],
//       ["Dưỡng da sáng mịn", "Làm đều màu da"],
//       ["Làm sạch da", "Cân bằng độ ẩm"],
//       ["Bảo vệ da khỏi tia UV", "Chống lão hóa"]
//     ];

//     const imagesArray = [
//       ["https://i.pinimg.com/564x/33/a3/25/33a325ac992b4b20ab3c9ac57980e747.jpg", "https://i.pinimg.com/564x/72/6d/37/726d3798c48602a8cefa2ecec3ab2d04.jpg"],
//       ["https://i.pinimg.com/564x/e5/ec/61/e5ec613f9d4f736907102cb426a76222.jpg", "https://i.pinimg.com/564x/88/b0/a0/88b0a0a668ac102298563462d3da076c.jpg"],
//       ["https://i.pinimg.com/564x/21/f9/91/21f991bc270bca7402b6b2833ac65336.jpg", "https://i.pinimg.com/564x/33/a3/25/33a325ac992b4b20ab3c9ac57980e747.jpg"],
//       ["https://i.pinimg.com/564x/98/bf/43/98bf434982832b4a36d5b0b3bc37b003.jpg", "https://i.pinimg.com/564x/af/ce/38/afce3841221bc5fdb05da4955e4c7c1c.jpg"],
//       ["https://i.pinimg.com/564x/29/fb/7b/29fb7ba3ed50a7870f749e7ed2ab2f18.jpg", "https://i.pinimg.com/564x/7f/ab/8f/7fab8f8d7f5e4f64a8a3f4a8e239f3e5.jpg"],
//       ["https://i.pinimg.com/564x/34/aa/7c/34aa7c4a7b3c2bc6a2b66a57c392ce4b.jpg", "https://i.pinimg.com/564x/90/66/fd/9066fd7d263cfd2c8a52c19e52fc7a8e.jpg"]
//     ];

//     const expiryDates = [
//       new Date("2025-12-31"),
//       new Date("2026-01-15"),
//       new Date("2025-08-30"),
//       new Date("2024-07-01"),
//       new Date("2026-03-25"),
//       new Date("2025-09-10")
//     ];

//     for (let i = 0; i < productNames.length; i++) {
//       const product = new Product({
//         name: productNames[i],
//         description: descriptions[i],
//         price: prices[i],
//         category: categories[i],
//         stock: stocks[i],
//         variants: variantsArray[i],
//         ingredients: ingredientsArray[i],
//         benefits: benefitsArray[i],
//         images: imagesArray[i],
//         expiryDate: expiryDates[i]
//       });

//       const productResult = await product.save();
//       console.log(`Product ${i + 1} created successfully:`, productResult);
//     }
//   } catch (error) {
//     console.error("Error creating products:", error);
//   }
// }

// // Gọi hàm để test
// async function runTests() {
//   await connect();
//   await testAddProducts();
// }

// // Gọi hàm để test
// runTests();

module.exports = { connect };
