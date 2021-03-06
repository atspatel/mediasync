const UserRoutes = require('./userRoutes')
const AuthRoutes = require('./authRoutes')
const RoomRoutes = require('./roomRoutes')

module.exports = function (db) {
  var ret = [
    {
      method: 'GET',
      path: '/api/{path*}',
      handler: function (request, reply) {
        reply('resource doesn\'t exist').code(404)
      }
    }
  ]
  return UserRoutes(db).concat(AuthRoutes(db), RoomRoutes(db), ret)
}
