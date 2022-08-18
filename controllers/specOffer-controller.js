const ApiError = require('../exceptions/api-error');
const specOfferService = require('../service/specOffer-service');

class SpecOfferController {

    async addSpecOffer(req, res, next) {
        try {
            const result = await specOfferService.addSpecOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async modifySpecOffer(req, res, next) {
        try {
            const result = await specOfferService.modifySpecOffer(req);
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
    async getSpecOfferUser(req, res, next) {
        try {
            const result = await specOfferService.getSpecOfferUser(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getSpecOfferId(req, res, next) {
        try {
            const result = await specOfferService.getSpecOfferId(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async deleteSpecOffer(req, res, next) {
        try {
            const result = await specOfferService.deleteSpecOffer(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async specAskFiz(req, res, next) {
        try {
            const result = await specOfferService.specAskFiz(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async specAskOrg(req, res, next) {
        try {
            const result = await specOfferService.specAskOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getSpecAskUser(req, res, next) {
        try {
            const result = await specOfferService.getSpecAskUser(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new SpecOfferController();