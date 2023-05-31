const ApiError = require('../exceptions/api-error');
const reviewOrgService = require('../service/reviewOrg-service');

class ReviewOrgController {

    async addQuest(req, res, next) {
        try {
            const result = await reviewOrgService.addReviewOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getQuest(req, res, next) {
        try {
            const result = await reviewOrgService.getReviewOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async delReviewOrg(req, res, next) {
        try {
            const result = await reviewOrgService.delReviewOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async delAnswerOrg(req, res, next) {
        try {
            const result = await reviewOrgService.delAnswerOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReviewOrgController();