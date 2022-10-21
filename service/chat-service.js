const ApiError = require('../exceptions/api-error');
const SocketIO =  require('../SocketIO/index');

class ChatService {

    async getStatus(req) {
        const {
            iD
        } = req.body
        return SocketIO.userSocketIdMap.has(iD)
    }

    
    async checkConnect(req) {
        console.log("check")
    }

}

module.exports = new ChatService()