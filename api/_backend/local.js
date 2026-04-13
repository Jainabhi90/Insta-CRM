const app = require("./app")
const { config } = require("./config")

app.listen(config.port, () => {
  console.log(`Insta CRM API is running on http://localhost:${config.port}`)
})
