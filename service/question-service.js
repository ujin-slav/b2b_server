const QuestModel = require("../models/question-model")
const UnreadQuestModel = require("../models/unreadQuest-model")
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

        const question = await QuestModel.create
                ({Host,
                Destination:destination,
                Author:author,
                Text,
                Ask:ask,
                Date: new Date()});
        
        const unread = await UnreadQuestModel.create
        ({
        Message:question,
        To:destination,
        From:author});
                
        return question; 
    }

    async getQuest(req) {
        const {id,userId} = req.body
        
        const questions = await QuestModel.find({Ask:id,Host:null}).sort({"_id":-1});
        const result = await Promise.all(questions.map(async (item)=>{   
            const author = await UserModel.findOne({ _id: item.Author },{id:true,name:true,nameOrg:true,email:true});
            const destination = await UserModel.findOne({ _id: item.Destination },{id:true,name:true,nameOrg:true,email:true});
            const answer =  await QuestModel.find({Host:item._id});
            const newitem = {
                ID: item._id,
                Text:item?.Text,
                Author: author,
                Destination: destination,
                Answer:answer
            }
            return newitem;
        }));

        const unread = await UnreadQuestModel.deleteMany({Message:questions,To:userId})

        return result; 
    }

    async getQuestUser(req) {
        let quest
        const {userId,page,limit,dest} = req.body
        var abc = (
            {path:'Author',select:"name nameOrg inn"}
        );
        var options = {
            populate: abc,
            sort:{"_id":-1},
            limit,
            page};  
        if(dest==="1"){
            quest = await QuestModel.paginate({Destination:userId,Host:null},options);
        } else {
            quest = await QuestModel.paginate({Author:userId,Host:null},options);  
        } 
        const questResult = await Promise.all(quest.docs.map(async (item)=>{
            const Status = await QuestModel.findOne({Host:item._id})
            await UnreadQuestModel.deleteOne({Message:item.Ask}) 
            const newItem = {
                Ask:item.Ask,
                Author:item.Author,
                Text:item.Text,
                Status,
                Date:item.Date
            }
            return newItem
        }))
        const result = {docs:questResult,totalPages:quest.totalPages};
        return result
    }

    async delQuest(req) {
        const {id} = req.body
        const result = QuestModel.deleteOne({_id:id});
        const unread = UnreadQuestModel.deleteOne({Message:id});
        return result;
    }

    async delAnswer(req) {
        const {id} = req.body
        console.log(id)
        const result = QuestModel.deleteOne({_id:id});
        return result;
    }

    async getUnreadQuest(req) {
        const {id} = req.body
        const count = await UnreadQuestModel.find({To:id}).countDocuments();
        return count
    }
}

module.exports = new QuestService()