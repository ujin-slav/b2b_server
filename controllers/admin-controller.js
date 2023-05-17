const ApiError = require('../exceptions/api-error');
const AdminService = require('../service/admin-service');

class AdminController {
    async getUsers(req, res, next) {
        try {
            const result = await AdminService.getUsers(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getAsks(req, res, next) {
        try {
            const result = await AdminService.getAsks(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getSpecOffers(req, res, next) {
        try {
            const result = await AdminService.getSpecOffers(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getPrice(req, res, next) {
        try {
            const result = await AdminService.getPrice(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getSpamList(req, res, next) {
        try {
            const result = await AdminService.getSpamList(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async sendSpamByAsk(req, res, next) {
        try {
            const result = await AdminService.sendSpamByAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getSentSpamByAsk(req, res, next) {
        try {
            const result = await AdminService.getSentSpamByAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new AdminController();