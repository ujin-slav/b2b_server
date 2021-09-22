const AskModel = require("../models/Ask-model")

class AskService {
    async addAsk(req) {
        const {
            Name,
            maxPrice,
            maxDate,
            DateExp,
            Text,
        } = req.body
        const ask = await AskModel.create({
            Client:"Client",
            Name,
            Status:"Status",
            Price:maxPrice.toString(),
            FIO:"FIO",
            Telefon:"Telefon",
            DeliveryTime:maxDate,
            DeliveryAddress:"DeliveryAddress",
            TermsPayments:"TermsPayments",
            EndDateOffers:DateExp,
            Comment:"Comment",
            TextAsk:Text,
            Files:req.files
        })
        return {ask}
    }
    async getAsk() {
        const ask = await AskModel.find();
        return ask;
    }

    async getOneAsk(id) {
        const ask = await AskModel.findOne({_id:id});
        return ask;
    }
}

module.exports = new AskService()