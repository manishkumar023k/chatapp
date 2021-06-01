const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim : true
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim:true
      },
      message: {
        type: String,
        required: true,
        trim:true
      },
      
      date: {
        type: Date,
        default: Date.now
      }
})

messageModel = mongoose.model('messageModel',messageSchema);
module.exports= messageModel;