const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const generateReferralCode = require("../utils/genRefCode");
require("dotenv").config();

// Nhập hàm connect từ db.config.js
const { connect } = require("../configs/db.config");

// Hàm để tạo đối tượng User giả lập
const generateUser = async () => {
  return new User({
    zaloId: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    phone: faker.phone.number(),
    gender: faker.helpers.arrayElement(["male", "female"]),
    membershipTier: faker.helpers.arrayElement([
      "Member",
      "Silver",
      "Gold",
      "Diamond",
    ]),
    points: faker.number.int({ min: 0, max: 1000 }), 
    referralCode: await generateReferralCode(),
    discountsUsed: [],
    serviceHistory: [],
    productSuggestions: [],
    carts: [],
  });
};

// Hàm để tạo đối tượng Admin giả lập
const generateAdmin = async () => {
  return new Admin({
    email: faker.internet.email(),  
    password: faker.internet.password(),  
    name: faker.person.fullName(),  
    branch: faker.company.name(),  
    zaloId: faker.string.uuid(),  
    avatar: faker.image.avatar(),  
    permissions: [
      "read_products",
      "write_products",
      "delete_products",
      "read_users",
      "write_users",
      "delete_users",
      "admin",
    ],
  });
};

// Hàm để tạo và lưu User và Admin vào MongoDB
const generateData = async (numUsers = 5, numAdmins = 5) => {
  try {
    const users = [];
    const admins = [];
    for (let i = 0; i < numUsers; i++) {
      users.push(await generateUser()); 
    }
    for (let i = 0; i < numAdmins; i++) {
      admins.push(await generateAdmin()); 
    }

    await User.insertMany(users);
    await Admin.insertMany(admins);
    
    console.log(`${numUsers} users and ${numAdmins} admins created successfully!`);
  } catch (error) {
    console.error("Error creating users or admins:", error);
  }
};

// Kết nối đến MongoDB và gọi hàm tạo người dùng và admin
const start = async () => {
  try {
    await connect(); 
    await generateData();  
  } catch (error) {
    console.error("Error in start function:", error);
  } finally {
    await mongoose.disconnect();  
  }
};

start();
