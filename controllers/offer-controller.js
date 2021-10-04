const ApiError = require('../exceptions/api-error');
const offerService = require('../service/offer-service');

class OfferController {
    async addOffer(req, res, next) {
        try {
            const result = await offerService.addOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getOffers(req, res, next) {
        try {
            const result = await offerService.getOffers(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getUserOffers(req, res, next) {
        try {
            const result = await offerService.getUserOffers(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async deleteOffer(req, res, next) {
        try {
            const result = await offerService.deleteOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }


}


module.exports = new OfferController();