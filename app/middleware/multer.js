const multer = require('multer')

//multer configuration

const upload = multer({
    // dest:'images', //we remove this option so that we access the file data in the req.file
    limits : {
        fileSize:15000000 // 15 MB 
    },
    fileFilter(res,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
           return cb(new Error("please choose a image file"))
        }

        return cb(undefined,true)

    }
}

)


module.exports = upload