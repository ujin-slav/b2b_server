const ApiError = require('../exceptions/api-error');
const chatService = require('../service/chat-service');

class ChatController {

    async getStatus(req, res, next) {
        try {
            const result = await chatService.getStatus(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async checkConnect(req, res, next) {
        try {
            const result = await chatService.checkConnect(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new ChatController();