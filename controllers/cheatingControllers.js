const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const Cheating = require("../models/cheatingModel");

exports.detectCheating = async (req, res) => {
  const imageFiles = req.files.map((file) => file.path);

  // Convert each image to FormData
  const formDataArray = imageFiles.map((filePath) => {
    const formData = new FormData();
    formData.append("imagefiles", fs.createReadStream(filePath));
    return formData;
  });

  // Array to store promises for each image upload to Flask
  const uploadPromises = formDataArray.map((formData) => {
    return axios.post(
      "https://online-proctoring-5a4cd4cf6ecf.herokuapp.com/detect",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  });

  try {
    // Wait for all requests to complete
    const responses = await Promise.all(uploadPromises);

    // Check if any data was returned from the endpoint
    const cheatingDetected = responses.some(
      (response) => response.data.length > 0
    );

    if (cheatingDetected) {
      // Save response data for each image in Cheating model
      const savedData = [];
      responses.forEach((response) => {
        response.data.forEach(async (imageData) => {
          const cheatingData = {
            student: req.user.id, // User ID
            cheatingDetalis: imageData.Direction,
            image: imageData.URL,
          };

          // Save cheating data to database
          const savedCheating = await Cheating.create(cheatingData);
          savedData.push(savedCheating);
        });
      });
      // Send response indicating cheating detected
      res.status(200).json({ message: "Cheating detected" });
    } else {
      // Send response indicating no cheating detected
      res.status(200).json({ message: "No cheating detected" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Delete uploaded image files
    imageFiles.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:");
        }
      });
    });
  }
};
