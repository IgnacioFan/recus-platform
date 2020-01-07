

const testController = {
  testRoute: (req, res) => {
    return res.json({ status: 'success', msg: '路徑測試！' })
  },

  // getCurrentUser: (req, res) => {
  //   return res.json({user: req. })
  // }
}

module.exports = testController