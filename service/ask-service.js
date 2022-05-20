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
            Date,
            Private,
            Send,
            Party,
        } = req.body
         const ask = await AskModel.create({
            Author,
            Name,
            MaxPrice:MaxPrice.toString(),
            Telefon,
            EndDateOffers,
            Comment,
            Text,
            Category:JSON.parse(Category),
            Region:JSON.parse(Region),
            Date,
            Files:req.files,
            Private,
            Send,
            Party:JSON.parse(Party)
        })
        return {ask} 
    }
    async getAsk(req) {
        const {
            limit,
            page,
            authorId
        } = req.body.formData
        if(authorId){
            const user = await UserModel.findOne({_id:authorId});
            const result = await AskModel.paginate({Author:user}, {page,limit,sort:{"_id":-1}});
            return result;
        } else {
            var abc = ({ path: 'Author', select: 'name nameOrg inn' });
            var options = {
                sort:{"_id":-1},
                populate: abc, 
                limit,
                page};
            const result = await AskModel.paginate({}, options);
            return result;
        }    
    }

    async getFilterAsk(req) {
        let searchParam = {}
        const {
            limit,
            page,
            region,
            category,
            inn,
            nameAsk,
            filterCat,
            filterRegion,
            searchText,
            searchInn,
        } = req.body.formData 
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        if(filterCat.length==0 && filterRegion.length==0){
            searchParam = {
                $or: [
                    {Name: {
                    $regex: searchText,
                    $options: 'i'
                }}, {Text: {
                    $regex: searchText,
                    $options: 'i'
                }}],
                $or: [
                    {NameOrg: {
                    $regex: searchInn,
                    $options: 'i'
                }}, {Inn: {
                    $regex: searchInn,
                    $options: 'i'
                }}]
            }
        }
        if(filterCat.length>0 && filterRegion.length==0){
            searchParam = {
                Category: {$in : filterCat}
            }
        }
        if(filterCat.length==0 && filterRegion.length>0){
            searchParam = {
                Region: {$in : filterRegion}
            }
        }
        if(filterCat.length>0 && filterRegion.length>0){
            searchParam = {
                Category: {$in : filterCat},
                Region: {$in : filterRegion}
            }
        }
        const result = await AskModel.paginate(
            searchParam, 
            options);
        return result;  
    }

    async getOneAsk(id) {
        const ask = await AskModel.findOne({_id:id}).populate({path:'Author', select:'name nameOrg inn telefon'});
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

    async modifyAsk(req) {
        const {
            Id,
            Author,
            Name,
            Telefon,
            EndDateOffers,
            Text,
            Category,
            Region,
            Date,
            DeletedFiles,
            Private,
            Send,
            Comment,
            Party,
        } = req.body
        JSON.parse(DeletedFiles).map((item)=>{
            if(fs.existsSync(__dirname+'\\..\\'+item.path)){
            fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл удалён");
                }
            })};
        })
        const user = await UserModel.findOne({_id:Author});
        const ask = await AskModel.updateOne({_id:Id},{$set:{
            Author,
            Name,
            Telefon,
            EndDateOffers,
            Text,
            Category:JSON.parse(Category),
            Region:JSON.parse(Region),
            Date,
            Files:req.files,
            Private,
            Send,
            Party:JSON.parse(Party),
            Comment,
            NameOrg: user.nameOrg,
            Inn: user.inn
        }});
        return ask
    }
}

module.exports = new AskService()