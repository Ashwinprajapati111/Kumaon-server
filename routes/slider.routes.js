module.exports = (app) => {
  const slider = require("../controller/slider.controller.js");
  const router = require("express").Router();
  const upload = require("../middleware/upload");

  console.log("✅ Slider routes loaded");

  router.post("/post", upload.fields([{ name: "sliderimage", maxCount: 1 }]), slider.create);

  router.get("/getall", slider.findAll);

  router.get("/getone/:id", slider.findOne);

  router.delete("/delete/:id", slider.delete);

  router.put("/update/:id",
    upload.fields([{ name: "sliderimage", maxCount: 1 }]),
    slider.update
  );

  app.use("/slider", router);
};