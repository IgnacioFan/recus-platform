const db = require('../models')
const Order = db.Order

module.exports = (io) => {
  io.on('connection', async (socket) => {
    try {
      console.log('a user is connected', socket.id)

      pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
      unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
      //console.log({ pending: pending, unpaid: unpaid })
      if (pending || unpaid) {
        socket.emit('status', 'hello socket!')
        socket.emit('order nums', { pending: pending, unpaid: unpaid })
      } else {
        socket.disconnect()
      }
      // socket.on('disconnect', () => {
      //   console.log('a user disconnected')
      // })
    } catch (err) {
      done(err, false)
    }
  })

}