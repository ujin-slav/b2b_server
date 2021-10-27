const events = require('events')
const emitter = new events.EventEmitter();

class MessageService {
   
    async addMessage(req) {
        const message = req.body;
        emitter.emit('newMessage', message)
    }
    async getMessage(req) {
        const message = req.body;
        emitter.emit('newMessage', message)
        res.status(200)        
    }

}

module.exports = new MessageService()