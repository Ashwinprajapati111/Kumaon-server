module.exports = (app) => {
  const slider = require("../controller/slider.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authMiddleware.js")
  const multer  = require('multer')
  const upload = require("../middleware/upload");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
   router.post("/post", upload.fields([
    { name: "sliderimage", maxCount: 1 }
  ]), slider.create);
  router.get("/getall", slider.findAll);  
   router.get("/getone/:id", slider.findOne);  
  router.delete("/delete/:id", slider.delete);  
 
  app.use("/slider", router);
};