const db = require('../models')
const Order = db.Order


const realtime = async (req, res, next) => {
  try {
    let socket = req.app.get('socket')
    // console.log('you do emmit socket!!!')
    // console.log('fuck a user is connected', socket.id)
    socket.emit('status', 'global')
    pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
    unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
    socket.emit('realtime', { pending: pending, unpaid: unpaid })
    // socket.disconnect()
    return next()
  } catch (error) {
    console.log('error', error)
    return next()
  }
}

// const validate = (req, res, next) => {

//   const errors = validationResult(req)
//   if (errors.isEmpty()) return next()

//   const extractedErrors = []
//   errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

//   return res.status(422).json({ errors: extractedErrors })
// }

module.exports = {
  realtime
}