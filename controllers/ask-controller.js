const ApiError = require('../exceptions/api-error');
const askService = require('../service/ask-service');

class AskController {
    async addAsk(req, res, next) {
        try {
            const result = await askService.addAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getAsk(req, res, next) {
        try {
            const result = await askService.getAsk();
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getOneAsk(req, res, next) {
        try {
            const id = req.body.id
            console.log(req.body)
            const result = await askService.getOneAsk(id);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new AskController();