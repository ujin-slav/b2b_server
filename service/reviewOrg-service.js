const ReviewOrgModel = require("../models/reviewOrg-model")
const UnreadReviewOrgModel = require("../models/unreadReviewOrg-model")
const UserModel =require('../models/user-model');

class ReviewOrgService {

    async addReviewOrg(req) {
        const {Host,
        Author,
        Text,
        Org} = req.body
        console.log(req.body)
        const reviewOrg = await ReviewOrgModel.create({
            Host,
            Author,
            Text,
            Org,
            Date: new Date()
        });
        await UnreadReviewOrgModel.create({
            Message:reviewOrg._id,
            To:Org
        });        
        return reviewOrg; 
    }

    async getReviewOrg(req) {
        const {id,author,skip,limit,user} = req.body
        let query
        if(author){
            query = {Author:author,Host:null}
        }else{
            query = {Org:id,Host:null}
        }
        let reviewOrg = await ReviewOrgModel.find(query).skip(skip).limit(limit).sort({"_id":-1});
        let count = await ReviewOrgModel.find(query).countDocuments(); 
        const docs = await Promise.all(reviewOrg.map(async (item)=>{   
            const author = await UserModel.findOne({ _id: item.Author },{id:true,name:true,nameOrg:true,email:true});
            const answer =  await ReviewOrgModel.find({Host:item._id});
            const newitem ={
                ID: item._id,
                Text:item?.Text,
                Author: author,
                Answer:answer,
                Org:item?.Org,
                Date:item?.Date
            }
            return newitem;
        }));
        const result = {
            docs,
            totalPages:Math.ceil(count/limit)
        }
        console.log({user,id})
        if(user===id){
            const unread = await UnreadReviewOrgModel.deleteMany({To:id})
        }
        return result; 
    }

    async delReviewOrg(req) {
        const {id} = req.body
        const result = await ReviewOrgModel.deleteOne({_id:id});
        await UnreadReviewOrgModel.deleteOne({Message:id});
        return result;
    }

}

module.exports = new ReviewOrgService()