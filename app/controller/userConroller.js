const { User } = require('../models/user')
const message  = require('../models/message')
// const auth= require('../middleware/auth')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jasmeen.33k@gmail.com',
        pass: 'Jazz1234'
    }
});
const userController = () => {

    return {
        index(req, res) {
            res.status(200).send({ "name": "manish kumar" })
        },
        async register(req, res) {
            // console.log(req.body)

            try {

                const user = new User(req.body)
                // sendEmail(req)
                await user.save()
                const token = await user.genToken();
                let mailOptions = {
                    from: 'jasmeen.33k@gmail.com',
                    to: req.body.email,
                    subject: 'welcome ' + req.body.name,
                    text: 'welcome to our chat system'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.status(200).send({ user: user.getHide() })
            } catch (error) {
                res.status(400).send({
                    "error": error.message
                })
            }


        },
        async login(req, res) {
            try {
                // console.log(req.body)
                const user = await User.findByCredentials(req.body.email, req.body.password)
                const token = await user.genToken();
                res.status(200).send({ user: user.getHide(), token })

            } catch (error) {
                res.status(400).send({
                    "error": error.message
                })
            }


        },
        profile(req, res) {
            const user = new User(req.user)
            res.send(user.getHide())
        },
        async logout(data) {
            try {
                const user = await User.updateOne({ _id: data }, {
                    $set: {
                        tokens: []
                    }
                })
                await user.save()
                return user

            } catch (error) {
                return (error.message);

            }
        },
         async allUser() {
            try {



                const Users = await User.aggregate([
                    {
                        $lookup: {

                            from: "messagemodels",
                            let: { sid: "$_id" },
                            pipeline: [
                                {  $match: {
                                        $expr: {
                                            $or: [
                                                { $eq: ["$sender", "$$sid"] }, { $eq: ["$receiver", "$$sid"] } ]
                                               }
                                   }
                                },
                                {  $sort: { date: -1 } },
                                {  $limit: 1 },
                                {  $project: { _id:0,__v:0} }
                            ],
                            as: "lastmsg"
                        }
                    },
                    {
                        $project:{ lastmsg: {$arrayElemAt:["$lastmsg",0]},name:1,profileLink:1   }
                    }
                 ]).exec()


                  return Users
                // res.status(200).send(Users)
            } 
            catch (error) {
                return error.message
                // res.status(400).send({
                //     error:error.message
                // })

            }
        },
        async uploadProfile(req, res) {
            // console.log(req.file)
            // console.log(req.user)
            req.user.avator = req.file.buffer // buffer is property of file that contains binary form of file      
            req.user.profileLink = `${req.user._id}/avator`
            await req.user.save()
            res.status(200).send()
        },
        async getProfile(req, res) {
            try {
                const user = await User.findOne({ _id: req.params.id })

                if (!user || !user.avator) {
                    throw new Error()
                }

                res.set('Content-Type', 'image/png')
                res.send(user.avator)
            } catch (e) {
                res.status(404).send()
            }
        }
    }
}



module.exports = userController
