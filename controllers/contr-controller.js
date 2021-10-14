const ApiError = require('../exceptions/api-error');
const contrService = require('../service/contr-service');

class ContrController {

    async addContr(req, res, next) {
        try {
            const result = await contrService.addContr(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getContr(req, res, next) {
        try {
            const result = await contrService.getContr(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async delContr(req, res, next) {
        try {
            const result = await contrService.delContr(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

   

}

module.exports = new ContrController();