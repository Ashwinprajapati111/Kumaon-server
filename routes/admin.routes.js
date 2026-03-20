module.exports = (app) => {

  const admin = require("../controller/admin.controller.js");
  const router = require("express").Router();

  // CREATE
  router.post("/post", admin.create);

  // GET ALL
  router.get("/getall", admin.findAll);

  // GET ONE
  router.get("/getone/:id", admin.findOne);

  // UPDATE
  router.put("/update/:id", admin.update);

  // DELETE
  router.delete("/delete/:id", admin.delete);

  // LOGIN ✅ (FIXED)
  router.post("/login", admin.loginAdmin);

  app.use("/admin_api", router);
};