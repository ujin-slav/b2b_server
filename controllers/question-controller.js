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

    async getQuestUser(req, res, next) {
        try {
            const result = await questService.getQuestUser(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    
    async delQuest(req, res, next) {
        try {
            const result = await questService.delQuest(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async delAnswer(req, res, next) {
        try {
            const result = await questService.delAnswer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getUnreadQuest(req, res, next) {
        try {
            const result = await questService.getUnreadQuest(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new QuestionController();