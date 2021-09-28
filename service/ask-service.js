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
    async getAsk(req) {
        const {
            limit,
            page
        } = req.body.formData
        const result = await AskModel.paginate({}, {page,limit});
        //const ask = await AskModel.find();
        return result;
    }

    async getOneAsk(id) {
        const ask = await AskModel.findOne({_id:id});
        return ask;
    }

    async fillAsk() {
        for (let i = 0; i < 50; i++) {
                await AskModel.create({
                    Client:"Client",
                    Name:"111",
                    Status:"Status" + i,
                    Price:"12121",
                    FIO:"FIO",
                    Telefon:"Telefon",
                    DeliveryAddress:"DeliveryAddress",
                    TermsPayments:"TermsPayments",
                    Comment:"Comment",
                    TextAsk:"Text",
                })
        }
        return {message:"hi"};
    }
}

module.exports = new AskService()