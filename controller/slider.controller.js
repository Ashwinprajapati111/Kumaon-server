const db = require("../model");
const Slider = db.slider;

exports.create = async (req, res) => {
  try {

    // Check uploaded file
    if (!req.files || !req.files["sliderimage"]) {
      return res.status(400).json({
        message: "Slider image is required!"
      });
    }

    const sliderimage = req.files["sliderimage"][0].filename;

    const slider = new Slider({
      sliderimage: sliderimage
    });

    const savedSlider = await slider.save();

    res.status(200).json(savedSlider);

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message || "Some error occurred while uploading slider."
    });

  }
};
exports.delete = (req, res) => {
  const id = req.params.id;

  Slider.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot delete Slider with id=${id}. Slider not found!`
        });
      }

      res.send({
        message: "Slider deleted successfully!"
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Slider with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  Slider.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving product",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Slider.findById(id)
    .then((data) => {

      if (!data) {
        return res.status(404).send({
          message: `Slider not found with id=${id}`
        });
      }

      res.send(data);

    })
    .catch((err) => {

      res.status(500).send({
        message: "Error retrieving Slider with id=" + id
      });

    });
};