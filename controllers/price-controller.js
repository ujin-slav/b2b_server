const ApiError = require('../exceptions/api-error');
const priceService = require('../service/price-service');

class PriceController {

    async addPrice(req, res, next) {
        try {
            const result = await priceService.addPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new PriceController();