const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const cloudinary = require("../utils/cloudinary");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }

    const publicId = model.photo.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    const doc = await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }
    console.log(model);
    if (
      req.file &&
      model.photo !=
        "https://res.cloudinary.com/hqjsjnf76/image/upload/v1710795969/q0gehpc2vmwautjvraye.png"
    ) {
      const publicId = model.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.file = req.cloudinaryResult.secure_url;

    newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);

    const doc = await query;
    // Course.findOne({ _id: req.params.id })

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET Materials on course
    let filter = {};
    if (req.params.courseId) filter = { course: req.params.courseId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const documents = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });
