const QuestModel = require("../models/question-model")
const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model');
const { assertWrappingType } = require("graphql");

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
        
        const questions = await QuestModel.find({Ask:id,Host:null});
        const result = await Promise.all(questions.map(async (item)=>{   
            const author = await UserModel.findOne({ _id: item.Author });
            const destination = await UserModel.findOne({ _id: item.Destination });
            const answer =  await QuestModel.find({Host:item._id});
            const answerText = answer.map((item)=>item.Text)
            const newitem = {
                ID: item._id,
                Text:item?.Text,
                Author: author?.email,
                Destination: destination?.email,
                DestinationID: destination?._id,
                Answer:answerText
            }
            return newitem;
        }));

        return result; 
    }

    

}

module.exports = new QuestService()