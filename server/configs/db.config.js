const mongoose = require("mongoose");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Recommendation = require("../models/recommendation.model");
const Review = require("../models/review.model");
const generateRandomPhoneNumber = require("../utils/genData.util");
const createTestData = require("../utils/generateTestData");
const AppConfig = require("../models/appconfig.model");
const Rank = require("../models/rank.model");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
    });
    console.log("Connected to MongoDB successfully");
    // App Config
    initializeAppConfig();

    //await testAdd();

    // GENERATE TEST DATA
    // createTestData()

    // await createSampleRanks();
    // await initializeAndSaveOrderPoints();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// TEST ADD DATA
async function testAdd() {
  try {
    const productNames = [
      "Product A",
      "Product B",
      "Product C",
      "Product D",
      "Product E",
      "Product F",
    ];
    const productIds = ["12345", "67890", "54321", "11223", "33445", "55667"];

    for (let i = 1; i <= 6; i++) {
      // Tạo 6 người dùng
      const user = new User({
        name: `John Doe ${i}`, // Tên thay đổi theo từng người dùng
        phone: generateRandomPhoneNumber(),
        role: "User",
        membershipTier: i % 2 === 0 ? "Gold" : "Silver", // Thay đổi theo từng người
        points: 100 + i * 10, // Tăng dần số điểm theo người dùng
        referralCode: `ABC123${i}`, // Mã giới thiệu thay đổi theo người dùng
        productSuggestions: [
          {
            productId: productIds[0], // Sản phẩm giống nhau
            productName: productNames[0], // Tên sản phẩm giống nhau
            suggestedScore: 8.5 + i * 0.1, // Điểm gợi ý thay đổi nhẹ
          },
          {
            productId: productIds[i % productIds.length], // Thay đổi sản phẩm cho mỗi người
            productName: productNames[i % productNames.length], // Tên sản phẩm thay đổi
            suggestedScore: 9.0 + i * 0.2, // Điểm gợi ý thay đổi
          },
        ],
      });

      const userResult = await user.save();
      console.log(`User ${i} created successfully:`, userResult);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Gọi hàm để test
// testAdd();

// const newRecommendation = new Recommendation({
//   mainProductId: 'someObjectId', // Thay thế với ID thực tế
//   mainProductName: 'Tên sản phẩm chính', // Phải có giá trị không rỗng
//   products: [
//     {
//       productId: 'someProductId1', // Thay thế với ID sản phẩm thực tế
//       productName: 'Sản phẩm gợi ý 1' // Phải có giá trị không rỗng
//     },
//     {
//       productId: 'someProductId2', // Thay thế với ID sản phẩm thực tế
//       productName: 'Sản phẩm gợi ý 2' // Phải có giá trị không rỗng
//     }
//   ]
// });

// newRecommendation.save()
//   .then(result => {
//     console.log('Recommendation saved:', result);
//   })
//   .catch(err => {
//     console.error('Error processing product recommendations:', err);
//   });

async function initializeAppConfig() {
  try {
    let config = await AppConfig.findOne();
    if (!config) {
      config = await AppConfig.create({
        version: "1.0.0",
        images: [],
      });
      console.log("AppConfig initialized:", config);
    }
  } catch (error) {
    console.error("Error initializing AppConfig:", error);
  }
}

async function initializeAndSaveOrderPoints() {
  try {
    const updatedConfig = await AppConfig.findOneAndUpdate(
      {},
      {
        orderPoints: [
          { price: 50000, minPoints: 10 },
          { price: 100000, minPoints: 20 },
          { price: 500000, minPoints: 30 },
          { price: 1000000, minPoints: 50 },
        ]
      },
      { new: true, upsert: true }
    );
    console.log("Order points updated:", updatedConfig);
  } catch (error) {
    console.error("Error during initialization or saving order points:", error);
  }
}

// async function saveOrderPoints(orderPoints) {
//   try {
//     for (const point of orderPoints) {
//       const existingPoint = await OrderPoint.findOne({
//         price: point.price,
//         minPoints: point.minPoints,
//       });

//       if (!existingPoint) {
//         const newOrderPoint = new OrderPoint(point);
//         await newOrderPoint.save();
//         console.log(`Order point created:`, newOrderPoint);
//       } else {
//         console.log(
//           `Order point with price ${point.price} and minPoints ${point.minPoints} already exists.`
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error saving order points:", error);
//   }
// }

async function createSampleRanks() {
  try {
    const sampleRanks = [
      { tier: "Member", minPoints: 0, benefits: "Access to basic features" },
      {
        tier: "Silver",
        minPoints: 1000,
        benefits: "Access to premium features, Monthly report",
      },
      {
        tier: "Gold",
        minPoints: 2500,
        benefits: "All Silver benefits, Priority support",
      },
      {
        tier: "Platinum",
        minPoints: 5000,
        benefits: "All Gold benefits, Exclusive offers",
      },
    ];

    for (const rank of sampleRanks) {
      const existingRank = await Rank.findOne({ tier: rank.tier });
      if (!existingRank) {
        const rankResult = await Rank.create(rank);
        console.log(`Rank created successfully:`, rankResult);
      } else {
        console.log(`Rank ${rank.tier} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error creating sample ranks:", error);
  }
}

module.exports = { connect };
