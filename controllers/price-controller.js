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
    async getFilterPrice(req, res, next) {
        try {
            const result = await priceService.getFilterPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getPriceUnit(req, res, next) {
        try {
            const result = await priceService.getPriceUnit(req);
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
    async getAskPriceFiz(req, res, next) {
        try {
            const result = await priceService.getAskPriceFiz(req);
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
    async setStatusPriceAsk(req, res, next) {
        try {
            const result = await priceService.setStatusPriceAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getStatusPriceAsk(req, res, next) {
        try {
            const result = await priceService.getStatusPriceAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async deleteStatusPriceAskFile(req, res, next) {
        try {
            const result = await priceService.deleteStatusPriceAskFile(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new PriceController();