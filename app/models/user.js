const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter the correct email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('password should be contains 6 or more characters');
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot be a password');
            }
        }

    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 10 ) {
                throw new Error("Number Cannot less than or greater than 10")
            }
        }
    },
    address: {
        type: String,
        trim: true,
        default: ""
    },
     avator: {
        type: Buffer,
        trim:true
    },
    profileLink:{
        type : String,
        trim : true
    },
    tokens: [
        {
            token: {
                type: String,
                default: " "
            }
        }
    ]
}, {
    timestamps: true
})


// to hide the password and the tokens
userSchema.methods.getHide =function()
{
    const user = this;
    if(user.avator)
    {
        user.profileLink=`${user._id}/avator`
    }
    user.save().then().catch((error)=>{
        throw new Error("profile does not saved in the database")
    })
    const userCopy = user.toObject()

    delete userCopy.password
    delete userCopy.tokens
    delete userCopy.avator
    delete userCopy.__v
    return userCopy
}

//to genrate the token 
userSchema.methods.genToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() },"mynameismanishkumar");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}



//comparing the email and password when login
userSchema.statics.findByCredentials = async (email, password) => {

    const user=await User.findOne({email});
    if(!user)
    {
        throw new Error("Unable to LogIn");
    }
    const isEmail=await bcrypt.compare(password,user.password);
    if(!isEmail)
    {
        throw new Error("Unable to LogIn");
    }

    return user;
}

//convet the password into the hashpassword before save the document
userSchema.pre('save', async function (next) {
    // console.log('userschema code runinig');
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


const User = mongoose.model('User', userSchema)









//send the email
const sendEmail = (req)=>{
    
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jasmeen.33k@gmail.com',
    pass: 'Jazz1234'
  }
});


let mailOptions={
    from:'jasmeen.33k@gmail.com',
    to: req.body.email,
    subject: 'welcome '+req.body.name,
    text: 'welcome to our chat system'
};



transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
});
}


module.exports = {
    User
    // sendEmail
}
