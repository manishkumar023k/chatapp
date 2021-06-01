const messages = require('../models/message');
const mongoose = require('mongoose')
const cron = require('node-cron')


cron.schedule('0 12 * * *',()=>{
    messages.remove({}).then(()=>{
        console.log("delete the messages at 12pm successfully")
    }).catch((error)=>{
        console.log(error)
    })
})
let messageController = {};

messageController.saveMessage = async (data) => {
    try {

        // const cId = data.sender + data.receiver 
        const message = new messages({
            sender: data.sender,
            receiver: data.receiver,
            conversationId:[data.sender,data.receiver].sort().join('.'),
            message: data.message
        })
        await message.save()
        return(message);
    } catch (error) {
        return({
            "error": error.message
        })
    }
}

messageController.getHistory = async (req,res) => {
    try {

        let msg = await messages.find({
            $and: [
                {
                    sender: {
                        $in: [req.body.sender, req.body.receiver]
                    },
                    receiver: {
                        $in: [req.body.sender, req.body.receiver]
                    }
                }
            ]
        }).lean();

        res.status(200).send(msg);
    }
    catch (error) {
        res.status(400).send({
            err: error.message
        })
    }
}

// messageController.lastMessages = async (id) => {
//      messages.aggregate([
//         {
//             $match: {
//                 $or:[
//                     {'sender':new mongoose.Types.ObjectId(id)},{'receiver':new mongoose.Types.ObjectId(id)}
//                 ]
//             }
//         },
//         {
//             $sort:{date:-1}
//         },
//         {
//             $group:{
//                 _id:"$conversationId",
//                 sender:{$first: "$sender"},
//                 receiver:{$first: "$receiver"},
//                 message:{$first: "$message"},
//                 date:{$first: "$date"}
//             }
//         }
//         ]
//     ).exec((err,result)=>{
//         if(err){ return({error:err.message})}
//         else{
//             return(result);
//         }
//     })
    
// }


module.exports = messageController;
