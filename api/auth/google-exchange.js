const app = require("../../backend/app")

module.exports = (req, res) => {
  req.url = "/auth/google/exchange"
  return app(req, res)
}
