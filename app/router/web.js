const userController = require('../controller/userConroller')
const messageController = require('../controller/messageController')
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')

// const multer = require('multer')

const routerInit = (app) => {
  

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/userprofile', auth, userController().profile)
  app.get('/getusers', userController().allUser)

  
  app.get('/userlogout', auth, userController().logout)

  app.post('/register', userController().register)
  app.post('/login', userController().login)
  app.post('/msgsave', messageController.saveMessage)
  // app.get('/getHistory', messageController.getHistory)

  app.post('/profileimage', auth, upload.single('imageUpload'), userController().uploadProfile, (error, req, res, next) => {
    //providing this to handle the errors from the upload.single() middleware
    if (error) {
      res.status(400).send({
        error: error.message
      })
    }
  })

  app.post('/getHistory',auth, messageController.getHistory)

  app.get('/:id/avator', userController().getProfile)
}

module.exports = routerInit
