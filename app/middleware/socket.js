// const { Socket } = require('socket.io');
const {User} = require('../models/user')
const jwt = require('jsonwebtoken')
const socketAuth = async (socket, next) => {

  try {
    const socketToken = socket.handshake.headers.authorization.replace('Bearer', '')
    // console.log(socketToken)
    if (!socketToken) {
      return next(new Error("socket token Invalid"))
    }
    const decode = await jwt.verify(socketToken, "mynameismanishkumar");

    // console.log(decode)
    const user = await User.findOne({ _id: decode._id, 'tokens.token': socketToken }).lean()

    if (user) {

      socket.id = user._id
      return next()
    }
  

  } catch (error) {

    return next(new Error("socket token Invalid"))
  }
}

module.exports = socketAuth
