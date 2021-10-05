const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model')
const fs = require("fs");

class AskService {
    async addAsk(req) {
        const {
            Author,
            Name,
            MaxPrice,
            Telefon,
            MaxDate,
            EndDateOffers,
            Comment,
            Text,
            Category,
            Region,
            Date
        } = req.body
        console.log(req.body);
         const ask = await AskModel.create({
            Author,
            Name,
            MaxPrice:MaxPrice.toString(),
            Telefon,
            MaxDate:MaxDate.toString(),
            EndDateOffers,
            Comment,
            Text,
            Category,
            Region,
            Date,
            Files:req.files
        })
        return {ask} 
    }
    async getAsk(req) {
        const {
            limit,
            page,
            authorId
        } = req.body.formData
        const user = await UserModel.findOne({_id:authorId});
        const result = await AskModel.paginate({Author:user}, {page,limit});
        console.log(authorId)
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

    async deleteAsk(req) {
        const {id} = req.body        
        const ask = await AskModel.findOne({_id:id});      
        if(ask){
            ask.Files.map((item)=>{
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
                });
            })
        }
        await AskModel.deleteOne({_id:id}); 
        return ask
    }
}

module.exports = new AskService()