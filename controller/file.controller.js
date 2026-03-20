const uploadFile = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    let uploadedFile = req.file;

    // If using multiple files
    if (!uploadedFile && req.files && req.files.length > 0) {
      uploadedFile = req.files[0];
    }

    if (!uploadedFile) {
      return res.status(400).send({
        message: "Please upload a file!"
      });
    }

    // ✅ Generate Correct File URL
    const fileUrl = baseUrl + uploadedFile.filename;

    res.status(200).send({
      message: "Uploaded successfully: " + uploadedFile.originalname,
      fileName: uploadedFile.filename,
      fileUrl: fileUrl
    });

  } catch (err) {
    console.log(err);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        message: "File size cannot be larger than 2MB!"
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${
        req.file?.originalname || "unknown"
      }. ${err}`
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = path.join(__basedir, "uploads");

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send({
        message: "Unable to scan files!"
      });
    }

    const fileInfos = files.map((file) => ({
      name: file,
      url: baseUrl + file
    }));

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = path.join(__basedir, "uploads");

  res.download(
    path.join(directoryPath, fileName),
    fileName,
    (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err
        });
      }
    }
  );
};

module.exports = {
  upload,
  getListFiles,
  download
};