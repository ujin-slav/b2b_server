const SpecOfferModel = require("../models/specOffer-model")
const SpecAskModel = require("../models/specAsk-model")
const PriceModel = require('../models/price-model')
const tokenModel = require('../models/token-model')
const UnreadSpecAskModel = require("../models/unreadSpecAsk-model")
const UserModel =require('../models/user-model')
const ApiError = require('../exceptions/api-error');
const builder = require('xmlbuilder')
const fs = require("fs");
const { ifError } = require("assert");

class specOfferService {

    async createSpecOfferXML(userID) {
        const specOffer = await SpecOfferModel.find({Author:userID})
        var xml = builder.create('urlset')
        xml.att('xmlns',"http://www.sitemaps.org/schemas/sitemap/0.9")
        await Promise.all(specOffer.map(async (item)=>{
            xml.ele("url",).ele("loc", `${process.env.CLIENT_URL}/cardspecoffer/${String(item._id)}`);
        }))
        const result = xml.end({ pretty: true});
        if(fs.existsSync(__dirname+'//../sitemapSpecOffer/' + userID + 'SpecOffer.xml')){
            fs.unlink(__dirname+'//../sitemapSpecOffer/' + userID + 'SpecOffer.xml', function(err){
                if (err) {
                    throw ApiError.BadRequest('Файл не найден')
                }else{
                    console.log("файл удален")
                }
        })};
        fs.writeFileSync(__dirname + '//../sitemapSpecOffer/' + userID + 'SpecOffer.xml', result, function (err) {
            if (err) throw ApiError.BadRequest('Файл не записан');
        });
    }

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
            FilesMini,
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
            FilesMini:req.filesmini,
            FilesPreview:req.filespreview,
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
        this.createSpecOfferXML(Author)
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
        {   
            ///
            const authorSpeccOffer =  await SpecOfferModel.findOne({_id:ID},{Author:1})
            const {refreshToken} = req.cookies
            const user = await tokenModel.findOne({user:authorSpeccOffer.Author})
            if(user?.refreshToken!==refreshToken){
                throw ApiError.BadRequest('Токены не совпадают');
            }
            ///
        }
        const user = await UserModel.findOne({_id:Author});
        const existOffer = await SpecOfferModel.findOne({_id:ID})
        existOffer.Files?.map((item)=>{
            if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
            })};
        existOffer.FilesMini?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                        }
                })};
            })
        existOffer.FilesPreview?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                        }
                })};
            })
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
            FilesMini:req.filesmini,
            FilesReview:req.filesreview,
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
            startDate,
            endDate
        } = req.body
        console.log(req.body)
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        var textInnParam = {
            Date: { $gte: sd, $lt: ed },
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
            search="",
            page,
            startDate,
            endDate
        } = req.body
        console.log(req.body)
        const regex = search.replace(/\s{20000,}/g, '*.*')
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
        var options = {
            sort:{"_id":-1}, 
            limit,
            page};
        const result = await SpecOfferModel.paginate(
            {
                Author:id,
                Date: { $gte: sd, $lt: ed }, 
                $or: [
                {Text: {
                $regex: regex,
                $options: 'i'
            }}, {Name: {
                $regex: regex,
                $options: 'i'
            }}
            ]},
            options);
        return result;   
    }

    async deleteSpecOffer(req) {
        const {id} = req.body        
        const specOffer = await SpecOfferModel.findOne({_id:id});      
        if(specOffer){
            specOffer.Files?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                        }
                })};
            })
            specOffer.FilesMini?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                        }
                })};
            })
            specOffer.FilesPreview?.map((item)=>{
                if(fs.existsSync(__dirname+'\\..\\'+item.path)){
                    fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Файл удалён");
                        }
                })};
            })
        }
        const result = await SpecOfferModel.deleteOne({_id:id}); 
        await PriceModel.deleteOne({SpecOffer:id}); 
        this.createSpecOfferXML(specOffer.Author)
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