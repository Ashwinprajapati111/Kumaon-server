module.exports = (app) => {
  const admins = require("../controller/admin.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authJwt.js")

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post",admins.create);
  router.get("/getall", admins.findAll);  
  router.delete("/delete/:id", admins.delete);  
  app.use("/admin_api", router);
};
