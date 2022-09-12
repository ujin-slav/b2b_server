const ApiError = require('../exceptions/api-error');
const lentService = require('../service/lent-service');

class LentController {

    async getLent(req, res, next) {
        try {
            const result = await lentService.getLent(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new LentController();