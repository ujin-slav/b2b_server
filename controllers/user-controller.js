const userService = require('../service/user-service')
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const userDate = await userService.registration(req);
            res.cookie('refreshToken', userDate.refrehToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userDate)
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async forgot(req, res, next) {
        try {
            const {email} = req.body;
            const result = await userService.forgot(email);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async changeuser(req, res, next) {
        try {
            const result = await userService.changeuser(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async reset(req, res, next) {
        try {
            const {token, password} = req.body;
            const result = await userService.reset(token, password);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const users = await userService.getUser(req);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController();