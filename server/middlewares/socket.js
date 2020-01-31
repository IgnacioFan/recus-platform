const db = require('../models')
const Order = db.Order

module.exports = (socket) => {
  try {

    socket.emit('status', 'global')
    socket.on('addPending', async () => {
      pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
      unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
      socket.broadcast.emit('realtime', { pending: pending, unpaid: unpaid })
    })
    socket.on('switchState', async () => {
      pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
      unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
      socket.broadcast.emit('realtime', { pending: pending, unpaid: unpaid })
    })
    socket.on('deleteOrder', async () => {
      pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
      unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
      socket.broadcast.emit('realtime', { pending: pending, unpaid: unpaid })
    })
    socket.on('init', async () => {
      pending = await Order.scope('todayOrder').count({ where: { state: 'pending' } })
      unpaid = await Order.scope('todayOrder').count({ where: { state: 'unpaid' } })
      socket.broadcast.emit('realtime', { pending: pending, unpaid: unpaid })
      // socket.disconnect()
    })
    // socket.disconnect()
  } catch (error) {
    console.log('error', error)
  }
}
