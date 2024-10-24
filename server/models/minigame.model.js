const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minigameSchema = new Schema({ 
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    playCount: {
        type: Number,
        default: 10,  
        required: true
    },
    lastPlayed: {
        type: Date, 
        default: Date.now 
    }
});

const Minigame = mongoose.model('Minigame', minigameSchema);

module.exports = Minigame;