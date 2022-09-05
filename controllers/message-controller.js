const ApiError = require('../exceptions/api-error');
const messageService = require('../service/message-service');

class MessageController {
    async getMessage(req, res, next) {
        try {
            const result = await messageService.getMessage(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }


}


module.exports = new MessageController();