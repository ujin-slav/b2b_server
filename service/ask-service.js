const AskModel = require("../models/Ask-model")

class AskService {
    async addAsk(body) {
        const {
            Client,
            Name,
            Status,
            Price,
            FIO,
            Telefon,
            DeliveryTime,
            DeliveryAddress,
            TermsPayments,
            EndDateOffers,
            Comment,
            TextAsk,
        } = body
        console.log(body);
        const ask = await AskModel.create({
            Client,
            Name,
            Status,
            Price,
            FIO,
            Telefon,
            DeliveryTime,
            DeliveryAddress,
            TermsPayments,
            EndDateOffers,
            Comment,
            TextAsk,
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