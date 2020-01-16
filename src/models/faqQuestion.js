const mongoose = require('mongoose');

const faqQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

const FaqQuestion = mongoose.model('FaqQuestion', faqQuestionSchema);

module.exports = FaqQuestion;