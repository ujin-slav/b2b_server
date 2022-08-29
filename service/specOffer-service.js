const SpecOfferModel = require("../models/specOffer-model")
const SpecAskModel = require("../models/specAsk-model")
const PriceModel = require('../models/price-model')
const UnreadSpecAskModel = require("../models/unreadSpecAsk-model")
const UserModel =require('../models/user-model')
const fs = require("fs");
const { ifError } = require("assert");

class specOfferService {

    async addSpecOffer(req) {
        const {
            Author,
            Name,
            Telefon,
            EndDateOffers,
            Contact,
            Text,
            Category,
            Region,
            Price,
            Code,
            Balance,
            FileArray,
        } = req.body
        const user = await UserModel.findOne({_id:Author});
        const result = await SpecOfferModel.create({
            Author,
            Name,
            Telefon,
            Contact,
            EndDateOffers,
            Text,
            Price,
            Category:JSON.parse(Category),
            Region:JSON.parse(Region),
            Date: Date.now(),
            Files:req.files,
            NameOrg: user.nameOrg,
            Inn: user.inn
        })
        const price = await PriceModel.create({
            Code,
            Name,
            Price,
            Balance,
            User:Author,
            Date: Date.now(),
            SpecOffer:result
        })
        return result 
    }
    async modifySpecOffer(req) {
        const {
            Author,
            Name,
            Telefon,
            EndDateOffers,
            Contact,
            Text,
            Category,
            Region,
            Price,
            ID
        } = req.body
        const user = await UserModel.findOne({_id:Author});
        const existOffer = await SpecOfferModel.findOne({_id:ID})
        existOffer.Files.map((item)=>{
            if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
                })};
        })
        const result = await SpecOfferModel.updateOne({_id:ID},{$set:{
            Author,
            Name,
            Telefon,
            Contact,
            EndDateOffers,
            Text,
            Price,
            Category:JSON.parse(Category),
            Region:JSON.parse(Region),
            Date: Date.now(),
            Files:req.files,
            NameOrg: user.nameOrg,
            Inn: user.inn
        }})
        return result 
    }

    async getFilterSpecOffer(req) {
        let searchParam = {}
        const {
            limit,
            page,
            filterCat,
            filterRegion,
            searchText,
            searchInn,
        } = req.body
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        var textInnParam = {
            $and:[
                {$or: [
                    {Name: {
                    $regex: searchText,
                    $options: 'i'
                }}, {Text: {
                    $regex: searchText,
                    $options: 'i'
                }}]},
                {$or: [
                    {NameOrg: {
                    $regex: searchInn,
                    $options: 'i'
                }}, {Inn: {
                    $regex: searchInn,
                    $options: 'i'
                }}]}
            ]
        }    
        if(filterCat.length==0 && filterRegion.length==0){
            searchParam = textInnParam
        }
        if(filterCat.length>0 && filterRegion.length==0){
            searchParam = Object.assign({
                Category: {$in : filterCat}
            },textInnParam)
        }
        if(filterCat.length==0 && filterRegion.length>0){
            searchParam = Object.assign({
                Region: {$in : filterRegion}
            },textInnParam)
        }
        if(filterCat.length>0 && filterRegion.length>0){
            searchParam = Object.assign({
                Category: {$in : filterCat},
                Region: {$in : filterRegion}
            },textInnParam)
        }
        const result = await SpecOfferModel.paginate(
            searchParam, 
            options);
        return result;  
    }
    async getSpecOfferId(req) {
        const {
            id
        } = req.body
        const specoffer = await SpecOfferModel.findOne({_id:id})
        const price = await PriceModel.findOne({SpecOffer:specoffer})
        const result = {...{priceId:price?._id},specoffer}
        return result;  
    }
    async getSpecOfferUser(req) {
        const {
            id,
            limit,
            page,
        } = req.body
        var options = {
            sort:{"_id":-1}, 
            limit,
            page};
        const result = await SpecOfferModel.paginate({Author:id},options);
        return result;   
    }

    async deleteSpecOffer(req) {
        const {id} = req.body        
        const specOffer = await SpecOfferModel.findOne({_id:id});      
        if(specOffer){
            specOffer.Files.map((item)=>{
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
                });
            })
        }
        const result = await SpecOfferModel.deleteOne({_id:id}); 
        await PriceModel.deleteOne({SpecOffer:id}); 
        return result
    }
    async specAskFiz(req) {
        const {
            Name,
            Email,
            Telefon,
            City,
            Comment,
            Amount,
            Receiver,
            SpecOffer
        } = req.body
        const result = await SpecAskModel.create({
            Name,
            Email,
            Telefon,
            City,
            Comment,
            FIZ:true,
            Amount,
            Receiver,
            SpecOffer
        })
        if(result){
            await UnreadSpecAskModel.create({
                SpecOffer,
                To: Receiver,
            })
        }
        return result
    }
    async specAskOrg(req) {
        const {
            Author,
            Comment,
            Amount,
            Receiver,
            SpecOffer
        } = req.body
        const result = await SpecAskModel.create({
            Author,
            Comment,
            FIZ:false,
            Amount,
            Receiver,
            SpecOffer
        })
        if(result){
            await UnreadSpecAskModel.create({
                SpecOffer,
                To: Receiver,
            })
        }
        return result
    }
    async getSpecAskUser(req) {
        const {
            to,
            limit,
            page,
        } = req.body
        var options = {
            sort:{"_id":-1}, 
            limit,
            page};
        const result = await SpecAskModel.paginate({Receiver:to},options);
        await UnreadSpecAskModel.deleteMany({
            To: to,
        })
        return result;   
    }
}


module.exports = new specOfferService()