// function ensureAuthenticated(req) {
//   return req.isAuthenticated();
// }
function ensureAuthenticated() {
  return false;
}

function getUser(req) {
  return req.user;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};