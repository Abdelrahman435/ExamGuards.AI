const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    ExamType: {
      type: String,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: [true, "Exam must belong to a course"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    startedAt: {
      type: Date,
      required: true,
      trim: true,
    },
    expiredAt: {
      type: Date,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["coming-soon", "open", "ended"],
      default: "coming-soon",
    },
    title: {
      type: String,
    },
    totalpoints: {
      type: Number,
      required: true,
    },
    visiable: {
      type: Boolean,
      required: true,
    },
    Questions: [
      {
        type: Object,
        enum: [
          {
            QuestionType: "WrittenQuestion",
            QuestionTitle: {
              type: String,
              required: true,
            },
            Answer: {
              type: String,
              required: true,
            },
            Points: {
              type: Number,
              required: true,
            },
            AutoGraded: {
              type: Boolean,
              required: true,
            },
            TextMatch: {
              type: Boolean,
              required: true,
            },
            KeyWords: [
              {
                type: String,
              },
            ],
          },
          {
            QuestionType: "ChooseQuestion",
            QuestionTitle: {
              type: String,
              required: true,
            },
            Points: {
              type: Number,
              required: true,
            },
            Answers: [
              {
                body: {
                  type: String,
                  required: true,
                },
                correct: {
                  type: Boolean,
                  required: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
