const ApiError = require('../exceptions/api-error');
const messageService = require('../service/message-service');
const events = require('events')
const emitter = new events.EventEmitter();

class MessageController {

    async addMessage(req, res, next) {
        try {
            const {message} = req.body;
            emitter.emit('newMessage', message)
            res.status(200)
        } catch (e) {
            next(e);
        }
    }

    async getMessage(req, res, next) {
        try {
            res.writeHead(200, {
                'Connection': 'keep-alive',
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
            })
            emitter.on('newMessage', (message) => {
                res.write(`data: ${JSON.stringify(message)} \n\n`)
            })
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new MessageController();