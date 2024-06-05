const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;