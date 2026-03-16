const express = require("express")
const cors = require("cors")
const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
}
global.__basedir = __dirname;

app.use(cors(corsOptions));
const db = require("./model");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Canno connect to the database!", err);
    process.exit();
  });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require("./routes/file.routes.js")(app)
require("./routes/product.routes.js")(app)
require("./routes/admin.routes.js")(app)
require("./routes/contact.routes.js")(app)
require("./routes/order.routes.js")(app)
require("./routes/blog.routes.js")(app)
require("./routes/slider.routes.js")(app)

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ${PORT}`)
})