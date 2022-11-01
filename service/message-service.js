const events = require('events')
const emitter = new events.EventEmitter();
const ChatModel = require('../models/chat-model')
const UnreadModel = require('../models/unread-model')
const UserModel =require('../models/user-model')

class MessageService {
   
    async getMessage(req) {
        const {
            UserId,
            RecevierId,
            SearchText,
            limit,
            page
        } = req.body
        console.log({limit,page})
        const searchText = SearchText || ""
        const regex = searchText.replace(/\s{20000,}/g, '*.*')
        const messages = await ChatModel.paginate({
        "$or": [{
            To: await UserModel.findOne({_id:UserId}),
            Author: await UserModel.findOne({_id:RecevierId}),
            Text: {$regex: regex,$options: 'i'}
        }, {
            To: await UserModel.findOne({_id:RecevierId}),
            Author: await UserModel.findOne({_id:UserId}),
            Text: {$regex: regex,$options: 'i'}
        }]
        },{page,limit,sort:{Date:-1}});
        await UnreadModel.deleteMany({
            To: await UserModel.findOne({_id:UserId}),
            From: await UserModel.findOne({_id:RecevierId})
        }) 
        return messages
    }

}

module.exports = new MessageService()