const OfferModel = require("../models/offer-model")
const AskModel = require("../models/Ask-model")
const UserModel = require('../models/user-model')
const fs = require("fs");
const console = require("console");

class OfferService {
    async addOffer(req) {
        const {
            UserId,
            Price,
            Text,
            Ask,
            AuthorAsk
        } = req.body
        const findOffer = await OfferModel.findOne({Author:UserId,Ask})
        
        if(!findOffer){
            const offer = await OfferModel.create({
                Author:UserId, 
                AuthorAsk,
                Price,
                Text,
                Ask,
                Files:req.files,
                Date: new Date()
            })
            return {offer}
        } else {
            findOffer.Files?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                    }
            })}})
            const updateOffer = await OfferModel.updateOne({Author:UserId,Ask},{$set:{
                Author:UserId, 
                Price,
                Text,
                Ask,
                Files:req.files,
                Date: new Date()
            }})
            return {updateOffer}  
        }        
             
    }

    async getOffers(req) {
        const {id} = req.body
        const offer = await OfferModel.find({Ask:id}).sort({"_id":-1})
        const result = await Promise.all(offer.map(async (item)=>{   
            const user = await UserModel.findOne({ _id: item.Author });
            const newitem = {
                Text:item?.Text,
                AuthorID: user?._id,
                AuthorName: user?.name,
                AuthorInn: user?.inn,
                AuthorOrg: user?.nameOrg,
                Price: item?.Price,
                Files: item?.Files,
                Date: item?.Date
            }
            return newitem;
        }));
        return result
    }

    async getUserOffers(req) {
        const {
            limit,
            page,
            authorId,
            search,
            searchInn,
            startDate,
            endDate
        } = req.body
        const regex = search.replace(/\s{20000,}/g, '*.*') 
        const regexInn = searchInn.replace(/\s{20000,}/g, '*.*') 
        const options = {
            page,
            limit,
        }  
        const aggregate = OfferModel.aggregate([
            { $lookup:
                {
                   from: "users",
                   localField: "AuthorAsk",
                   foreignField: "_id",
                   as: "out"
                }
            },
            {$unwind:'$out'},
            {$project:
                {
                 nameOrg:'$out.nameOrg',
                 inn: '$out.inn',
                 id: {$toString: "$out._id"},
                 Text: '$Text',
                 Price:'$Price',
                 Ask:'$Ask',
                 Date: '$Date',
                 Files:'$Files',
                 Author: {$toString: "$Author"} 
                }
            },
            {$match:{
                $and:[
                    {$or: [
                        {nameOrg: {
                        $regex: regexInn,
                        $options: 'i'
                    }}, {inn: {
                        $regex: regexInn,
                        $options: 'i'
                    }}
                    ]},
                    {Text: {
                        $regex: regex,
                        $options: 'i'
                    }},
                    {Author:authorId},
                ],
                Date: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate)
                }
            }},
            { $sort : { _id : -1 } }
        ])
        const offers = await OfferModel.aggregatePaginate(aggregate, options)
        return offers
    }
    async deleteOffer(req) {
        const {id} = req.body        
        const offer = await OfferModel.findOne({_id:id});      
        if(offer){
            offer.Files.map((item)=>{
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
                });
            })
        }
        await OfferModel.deleteOne({_id:id}); 
        return offer
    }

}

module.exports = new OfferService()