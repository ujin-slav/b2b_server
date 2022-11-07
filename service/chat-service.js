const ApiError = require('../exceptions/api-error');
const SocketIO =  require('../SocketIO/index');

class ChatService {

    async getStatus(req) {
        const {
            iD
        } = req.body
        return SocketIO.userSocketIdMap.has(iD)
    }

}

module.exports = new ChatService()