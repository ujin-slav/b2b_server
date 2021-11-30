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
                Ask:ask});
        
        const unread = await UnreadQuestModel.create
        ({
        Message:question,
        To:destination,
        From:author});
                
        return question; 
    }

    async getQuest(req) {
        const {id,userId} = req.body
        
        const questions = await QuestModel.find({Ask:id,Host:null});
        const result = await Promise.all(questions.map(async (item)=>{   
            const author = await UserModel.findOne({ _id: item.Author },{id:true,name:true,nameOrg:true,email:true});
            const destination = await UserModel.findOne({ _id: item.Destination },{id:true,name:true,nameOrg:true,email:true});
            const answer =  await QuestModel.find({Host:item._id});
            const answerText = answer.map((item)=>item.Text)
            const newitem = {
                ID: item._id,
                Text:item?.Text,
                Author: author,
                Destination: destination,
                Answer:answerText
            }
            return newitem;
        }));

        const unread = await UnreadQuestModel.deleteMany({Message:questions,To:userId})

        return result; 
    }

    async getQuestUser(req) {
        const {userId,page,limit} = req.body
        var abc = (
            {path:'Author',select:"name nameOrg inn"}
        );
        var options = {
            populate: abc,
            limit,
            page};
        console.log(userId)    
        const quest = await QuestModel.paginate({Destination:userId,Host:null},options);
        const questResult = await Promise.all(quest.docs.map(async (item)=>{
            const Status = await QuestModel.findOne({Host:item._id})
            const newItem = {
                Author:item.Author,
                Text:item.Text,
                Status
            }
            return newItem
        }))
        const result = {docs:questResult,totalPages:quest.total};
        return result
    }

    async delQuest(req) {
        const {id} = req.body
        const result = QuestModel.deleteOne({_id:id});
        const unread = UnreadQuestModel.deleteOne({Message:id});
        return result;
    }

    async getUnreadQuest(req) {
        const {id} = req.body
        const count = await UnreadQuestModel.find({To:id}).countDocuments();
        return count
    }
}

module.exports = new QuestService()