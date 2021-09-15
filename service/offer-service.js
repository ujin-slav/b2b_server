const OfferModel = require("../models/offer-model")
const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model')

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
        console.log(offer)
        return {offer}
    }

}

module.exports = new OfferService()