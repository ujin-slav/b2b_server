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
    async getPrice(req, res, next) {
        try {
            const result = await priceService.getPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async clearPrice(req, res, next) {
        try {
            const result = await priceService.clearPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async saveAsk(req, res, next) {
        try {
            const result = await priceService.saveAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getAskPrice(req, res, next) {
        try {
            const result = await priceService.getAskPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getAskPriceId(req, res, next) {
        try {
            const result = await priceService.getAskPriceId(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async deletePriceAsk(req, res, next) {
        try {
            const result = await priceService.deletePriceAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async updatePriceAsk(req, res, next) {
        try {
            const result = await priceService.updatePriceAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new PriceController();