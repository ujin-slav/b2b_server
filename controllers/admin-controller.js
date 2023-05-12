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
}


module.exports = new AdminController();