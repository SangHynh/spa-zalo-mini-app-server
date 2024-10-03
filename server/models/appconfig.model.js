const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema({
    version: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    // ...
},{
    timestamps: true
});

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

module.exports = AppConfig;
