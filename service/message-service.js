const events = require('events')
const emitter = new events.EventEmitter();

class MessageService {
   
    async addMessage(req) {
        const message = req.body;
    }
    async getMessage(req) {
        const message = req.body;
        res.status(200)        
    }

}

module.exports = new MessageService()