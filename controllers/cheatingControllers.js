const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const Cheating = require("../models/cheatingModel");

exports.detectCheating = async (req, res) => {
  const imageFiles = req.files.map((file) => file.path);

  // Create a single FormData object containing all image files
  const formData = new FormData();
  imageFiles.forEach((filePath) => {
    formData.append("imagefiles", fs.createReadStream(filePath));
  });

  try {
    // Priority is given to object detection
    const objectDetectionResponse = await axios.post(
      "http://127.0.0.1:5000/detect",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Check if any data was returned from the object detection endpoint
    const objectCheatingDetected = objectDetectionResponse.data.length > 0;

    if (objectCheatingDetected) {
      // Save response data for each image in Cheating model
      const savedData = [];
      for (const imageData of objectDetectionResponse.data) {
        const cheatingData = {
          examId: req.params.examId,
          student: req.user.id, // User ID
          cheatingDetalis: imageData.objects,
          image: imageData.URL,
        };

        // Save cheating data to database
        const savedCheating = await Cheating.create(cheatingData);
        savedData.push(savedCheating);
      }
      // Send response indicating cheating detected by object detection
      return res
        .status(200)
        .json({ message: "Cheating detected by object detection" });
    }

    // If no cheating was detected by object detection, proceed to eye tracking detection
    const eyeTrackingUploadPromises = imageFiles.map((filePath) => {
      const eyeTrackingFormData = new FormData();
      eyeTrackingFormData.append("imagefiles", fs.createReadStream(filePath));

      return axios.post(
        "https://online-proctoring-5a4cd4cf6ecf.herokuapp.com/detect",
        eyeTrackingFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });

    // Wait for all eye tracking requests to complete
    const eyeTrackingResponses = await Promise.all(eyeTrackingUploadPromises);

    // Check if any data was returned from the eye tracking endpoint
    const eyeTrackingCheatingDetected = eyeTrackingResponses.some(
      (response) => response.data.length > 0
    );

    if (eyeTrackingCheatingDetected) {
      // Save response data for each image in Cheating model
      const savedData = [];
      eyeTrackingResponses.forEach((response) => {
        response.data.forEach(async (imageData) => {
          const cheatingData = {
            examId: req.params.examId,
            student: req.user.id, // User ID
            cheatingDetalis: imageData.Direction,
            image: imageData.URL,
          };

          // Save cheating data to database
          const savedCheating = await Cheating.create(cheatingData);
          savedData.push(savedCheating);
        });
      });
      // Send response indicating cheating detected by eye tracking
      res.status(200).json({ message: "Cheating detected by eye tracking" });
    } else {
      // Send response indicating no cheating detected
      res.status(200).json({ message: "No cheating detected" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Delete uploaded image files
    imageFiles.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });
  }
};

// exports.eyeTracking = async (req, res) => {
//   const imageFiles = req.files.map((file) => file.path);

//   // Convert each image to FormData
//   const formDataArray = imageFiles.map((filePath) => {
//     const formData = new FormData();
//     formData.append("imagefiles", fs.createReadStream(filePath));
//     return formData;
//   });

//   // Array to store promises for each image upload to Flask
//   const uploadPromises = formDataArray.map((formData) => {
//     return axios.post(
//       "https://online-proctoring-5a4cd4cf6ecf.herokuapp.com/detect",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//   });

//   try {
//     // Wait for all requests to complete
//     const responses = await Promise.all(uploadPromises);

//     // Check if any data was returned from the endpoint
//     const cheatingDetected = responses.some(
//       (response) => response.data.length > 0
//     );

//     if (cheatingDetected) {
//       // Save response data for each image in Cheating model
//       const savedData = [];
//       responses.forEach((response) => {
//         response.data.forEach(async (imageData) => {
//           const cheatingData = {
//             student: req.user.id, // User ID
//             cheatingDetalis: imageData.Direction,
//             image: imageData.URL,
//           };

//           // Save cheating data to database
//           const savedCheating = await Cheating.create(cheatingData);
//           savedData.push(savedCheating);
//         });
//       });
//       // Send response indicating cheating detected
//       res.status(200).json({ message: "Cheating detected" });
//     } else {
//       // Send response indicating no cheating detected
//       res.status(200).json({ message: "No cheating detected" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   } finally {
//     // Delete uploaded image files
//     imageFiles.forEach((filePath) => {
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error("Error deleting file:");
//         }
//       });
//     });
//   }
// };

// exports.objectDetection = async (req, res) => {
//   const imageFiles = req.files.map((file) => file.path);

//   // Create a single FormData object containing all image files
//   const formData = new FormData();
//   imageFiles.forEach((filePath) => {
//     formData.append("imagefiles", fs.createReadStream(filePath));
//   });

//   try {
//     // Make a single request to the Flask endpoint
//     const response = await axios.post(
//       "http://127.0.0.1:5000/detect",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//         },
//       }
//     );

//     // Check if any data was returned from the endpoint
//     const cheatingDetected = response.data.length > 0;

//     if (cheatingDetected) {
//       // Save response data for each image in Cheating model
//       const savedData = [];
//       for (const imageData of response.data) {
//         const cheatingData = {
//           student: req.user.id, // User ID
//           cheatingDetalis: imageData.objects,
//           image: imageData.URL,
//         };

//         // Save cheating data to database
//         const savedCheating = await Cheating.create(cheatingData);
//         savedData.push(savedCheating);
//       }
//       // Send response indicating cheating detected
//       res.status(200).json({ message: "Cheating detected" });
//     } else {
//       // Send response indicating no cheating detected
//       res.status(200).json({ message: "No cheating detected" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   } finally {
//     // Delete uploaded image files
//     imageFiles.forEach((filePath) => {
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error("Error deleting file:", err);
//         }
//       });
//     });
//   }
// };

exports.faceRecognition = async (req, res) => {
  const imageFiles = req.files.map((file) => file.path);
  const referenceImageUrl = req.body.reference_image_url; // Assuming reference_image_url is passed in the request body

  // Convert each image to FormData
  const formDataArray = imageFiles.map((filePath) => {
    const formData = new FormData();
    formData.append("imagefiles", fs.createReadStream(filePath));
    formData.append("reference_image_url", referenceImageUrl); // Add reference image URL to FormData
    return formData;
  });

  // Array to store promises for each image upload to Flask
  const uploadPromises = formDataArray.map((formData) => {
    return axios.post(
      "https://face--recognition-de1fbf7c4b9a.herokuapp.com/detect",
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

    // Check if any data was returned from the endpoint indicating no match
    const cheatingDetected = responses.some((response) =>
      response.data.some((item) => item.image)
    );

    if (cheatingDetected) {
      // Save response data for each image in Cheating model
      const savedData = [];
      for (const response of responses) {
        for (const imageData of response.data) {
          if (imageData.image) {
            const cheatingData = {
              examId: req.params.examId,
              student: req.user.id, // User ID
              cheatingDetalis: "This student is not the correct student",
              image: imageData.image,
            };

            // Save cheating data to database
            const savedCheating = await Cheating.create(cheatingData);
            savedData.push(savedCheating);
          }
        }
      }
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
          console.error("Error deleting file:", err);
        }
      });
    });
  }
};

exports.voiceRecognition = async (req, res) => {
  const files = req.files.map((file) => file.path);

  // Convert each voice file to FormData
  const formDataArray = files.map((filePath) => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    return formData;
  });

  // Array to store promises for each voice file upload to Flask
  const uploadPromises = formDataArray.map((formData) => {
    return axios.post("http://127.0.0.1:5000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  try {
    // Wait for all requests to complete
    const responses = await Promise.all(uploadPromises);

    // Check if any talking was detected in the response
    const talkingDetected = responses.some(
      (response) => response.data.talking_detected
    );

    if (talkingDetected) {
      // Save response data for each voice file in Cheating model
      for (const response of responses) {
        if (response.data.talking_detected) {
          const cheatingData = {
            examId: req.params.examId,
            student: req.user.id, // User ID
            cheatingDetalis: ["Talking detected"],
            image: response.data.file_url, // URL of the voice file
          };

          // Save cheating data to database
          await Cheating.create(cheatingData);
        }
      }
      // Send response indicating talking detected
      res.status(200).json({ message: "Cheating detected" });
    } else {
      // Send response indicating no talking detected
      res.status(200).json({ message: "No cheating detected" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Delete uploaded voice files
    files.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });
  }
};

exports.getCheatingsforExam = catchAsync(async (req, res, next) => {
  const fraudCases = await Cheating.find({
    examId: req.params.examId,
  }).populate("student", "firstName lastName email file"); // Assuming 'student' and 'file' are the field names referencing student and file/email respectively in your Cheating schema

  res.status(200).json({
    status: "success",
    results: fraudCases.length,
    data: {
      fraudCases: fraudCases,
    },
  });
});
