const express = require("express")
const cors = require("cors")
const app = express();

var corsOptions ={
  origin: "http://localhost:3000"
}

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
  app.use(express.urlencoded({extended:true}))

require("./routes/product.routes.js")(app)
const PORT = 8080;
app.listen(PORT,()=>{
  console.log(`SERVER RUNNING ${PORT}`)
})