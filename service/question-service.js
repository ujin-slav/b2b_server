const QuestModel = require("../models/question-model")
const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model')

class QuestService {

    async addQuest(req) {
        const {Host,
        Destination,
        Author,
        Text,
        Ask} = req.body
        
        const ask = await AskModel.findOne({_id:Ask});
        const author = await UserModel.findOne({_id:Author});
        const destination = await UserModel.findOne({_id:Destination});

        const question = QuestModel.create
                ({Host,
                Destination:destination,
                Author:author,
                Text,
                Ask:ask});
        return question; 
    }

    async getQuest(req) {
        const {id} = req.body
        
        const questions = await QuestModel.find({Ask:id});
        const result = await Promise.all(questions.map(async (item)=>{   
            const author = await UserModel.findOne({ _id: item.Author });
            const destination = await UserModel.findOne({ _id: item.Destination });
            
            const newitem = {
                Text:item?.Text,
                Author: author?.email,
                Destination: destination?.email
            }
            return newitem;
        }));

        return result; 
    }

    

}

module.exports = new QuestService()