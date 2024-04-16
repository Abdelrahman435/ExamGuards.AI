const mongoose = require('mongoose');


const AssignmentSchema = new mongoose.Schema({
    AssignmentType: {
        type: String,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: [true, "Modules must belong to a course"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    startedAt:{
        type: Date,
        required: true,
        trim: true
    },
    expiredAt: {
        type: Date,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["coming-soon", "open", "ended"],
        default: "coming-soon"
    },
    title: {
        type: String
    },
    totalpoints: {
        type: Number,
        required: true
    },
    visiable:{
        type:Boolean , 
        required:true,
    },
    Questions: [{
        type: Object,
        enum: [
            {
                QuestionType: 'WrittenQuestion',
                QuestionTitle: {
                    type: String,
                    required: true
                },
                Answer: {
                    type: String,
                    required: true
                },
                Points: {
                    type: Number,
                    required: true
                },
                AutoGraded: {
                    type: Boolean,
                    required: true,
                },
                TextMatch: {
                    type: Boolean,
                    required: true,
                },
                KeyWords: [{
                    type: String
                }]
            }, {
                QuestionType: 'ChooseQuestion',
                QuestionTitle: {
                    type: String,
                    required: true
                },
                Points: {
                    type: Number,
                    required: true
                },
                AutoGraded: {
                    type: Boolean,
                    required: true,
                },
                Answers: [{
                    body: {
                        type: String,
                        required: true
                    },
                    correct: {
                        type: Boolean,
                        required: true
                    }
                }],
            }
        ]
    }]
}, { timestamps: true });


const Assignment = mongoose.model('Assigment', AssignmentSchema);

module.exports = Assignment;