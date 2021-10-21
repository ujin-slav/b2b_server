const ApiError = require('../exceptions/api-error');
const questService = require('../service/question-service');

class QuestionController {

    async addQuest(req, res, next) {
        try {
            const result = await questService.addQuest(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getQuest(req, res, next) {
        try {
            const result = await questService.getQuest(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new QuestionController();