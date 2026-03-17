module.exports = (app) => {
  const contact = require("../controller/contact.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authMiddleware.js")

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post",contact.create);
  router.get("/getall", contact.findAll);  
  router.delete("/delete/:id", contact.delete);  
  app.use("/contact", router);
};
