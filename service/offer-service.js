const OfferModel = require("../models/offer-model")
const AskModel = require("../models/Ask-model")
const UserModel = require('../models/user-model')
const fs = require("fs");

class OfferService {
    async addOffer(req) {
        const {
            UserId,
            Price,
            Text,
            Ask,
        } = req.body
        const findOffer = await OfferModel.findOne({Author:UserId,Ask})
        
        if(!findOffer){
            const offer = await OfferModel.create({
                Author:UserId, 
                Price,
                Text,
                Ask,
                Files:req.files,
                Date: new Date()
            })
            return {offer}
        } else {
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
        const offer = await OfferModel.find({Ask:id})
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
        const {authorId,page,limit} = req.body;
        var abc = ({ path: 'Ask', populate:
        {path:'Author',select:"name nameOrg inn"},
        select:'Author Text'
        });
            var options = {
                sort:{"_id":-1},
                populate: abc, 
                limit,
                page};
        console.log(authorId)        
        const offer = await OfferModel.paginate({Author:authorId},options);
        return offer
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