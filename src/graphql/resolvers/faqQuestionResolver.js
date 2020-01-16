const FaqQuestion = require('../../models/faqQuestion');

const resolver = {
    Query: {
        async faqQuestions() {
            const faqQuestions = await FaqQuestion.find({});
            return faqQuestions;
        }
    }
}

module.exports = resolver;