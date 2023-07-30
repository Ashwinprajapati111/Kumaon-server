module.exports = (app) => {
  const user = require("../controller/user.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authJwt.js")

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/signup", user.validate('signup'),user.signup);
  router.post("/signin", user.signin);
  router.get("/getall", [authJwt.verifyToken],user.findAll);
  router.delete("/signup/:id", user.delete);
  //  router.post("/",food.create);

  //  router.put("/:id",user.update);
  app.use("/api", router);
};
