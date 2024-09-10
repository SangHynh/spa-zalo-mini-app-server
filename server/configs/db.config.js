const mongoose = require("mongoose");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const generateRandomPhoneNumber = require("../utils/genData.util");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
    });
    console.log("Connected to MongoDB successfully");
    await testAdd();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// TEST ADD DATA
async function testAdd() {
  try {
    // TEST ADD USER
    const user = new User({
      name: "John Doe",
      phone: generateRandomPhoneNumber(),
      role: "User",
      membershipTier: "Gold",
      points: 100,
      referralCode: "ABC123",
    });
    const userResult = await user.save();
    console.log("User created successfully:", userResult);

    // TEST ADD PRODUCT
    const product = new Product({
      name: "Kem dưỡng da",
      description: "Kem dưỡng da dành cho da khô",
      price: 200000,
      category: "Skincare",
      stock: 100,
      variants: [
        {
          volume: "100ml",
          price: 150000,
          stock: 50
        },
        {
          volume: "200ml",
          price: 200000,
          stock: 30
        }
      ],
      ingredients: [
        {
          name: "Dầu jojoba",
          percentage: 10,
          usageInstructions: "Sử dụng hàng ngày"
        },
        {
          name: "Vitamin E",
          percentage: 5
        }
      ],
      benefits: [
        "Dưỡng ẩm",
        "Làm sáng da"
      ],
      expiryDate: new Date("2025-12-31")
    });

    const productResult = await product.save();
    console.log("Product created successfully:", productResult);

    /* // TEST ADD STUDENT
    const student = new Student({
      name: "Mnh Phng",
      age: 20,
    });
    const studentResult = await student.save();
    console.log("Student created successfully:", studentResult); */
  } catch (err) {
    console.error("Error creating data:", err);
  }
}

module.exports = { connect };
