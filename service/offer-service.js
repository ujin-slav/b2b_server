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
        const ask = await AskModel.findOne({ _id: Ask });
        const user = await UserModel.findOne({ _id: UserId });

        const offer = await OfferModel.create({
            Author:user, 
            Price,
            Text,
            Ask,
            Files:req.files
        })
        
        return {offer}
    }

    async getOffers(req) {
        const {id} = req.body
        const offer = await OfferModel.find({Ask:id})
        const result = await Promise.all(offer.map(async (item)=>{   
            const user = await UserModel.findOne({ _id: item.Author });
            const newitem = {
                Text:item?.Text,
                Author: user?.email,
                Price: item?.Price
            }
            return newitem;
        }));
        return result
    }

    async getUserOffers(req) {
        const {id} = req.body
        const offer = await OfferModel.find({Author:id});
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