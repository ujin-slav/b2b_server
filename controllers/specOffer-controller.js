const ApiError = require('../exceptions/api-error');
const specOfferService = require('../service/specOffer-service');

class PriceController {

    async addSpecOffer(req, res, next) {
        try {
            const result = await specOfferService.addSpecOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getFilterSpecOffer(req, res, next) {
        try {
            const result = await specOfferService.getFilterSpecOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new PriceController();