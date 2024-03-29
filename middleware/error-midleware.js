const { isErrored } = require('nodemailer/lib/xoauth2');
const ApiError = require('../exceptions/api-error');
const logger = require("../utils/Logger");

module.exports = function (err, req, res, next) {
    console.log(err)
    if(err.message !== "Пользователь не авторизован"){
        logger.info(err)
    }
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({errors:err,message: 'Непредвиденная ошибка'})

};