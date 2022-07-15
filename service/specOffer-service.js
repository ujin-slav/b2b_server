const SpecOfferModel = require("../models/specOffer-model")
const UserModel =require('../models/user-model')
const fs = require("fs");

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
        const result = await SpecOfferModel.findOne({_id:id})
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
        await SpecOfferModel.deleteOne({_id:id}); 
        return specOffer
    }
}


module.exports = new specOfferService()