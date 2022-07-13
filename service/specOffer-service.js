const SpecOfferModel = require("../models/specOffer-model")
const UserModel =require('../models/user-model')

class specOfferService {

    async addSpecOffer(req) {
        const {
            Author,
            Name,
            Telefon,
            EndDateOffers,
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
}


module.exports = new specOfferService()