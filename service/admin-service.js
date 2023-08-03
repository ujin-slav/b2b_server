const ApiError = require('../exceptions/api-error');
const UserModel =require('../models/user-model')
const SpecOfferModel = require("../models/specOffer-model")
const PriceModel = require('../models/price-model')
const AskModel = require("../models/Ask-model")
const GisModel = require('../models/gis-model')
const SentMailModel = require('../models/sentMail-model')
const getCategoryName = require('../utils/ConvertCategory')
const getRegionCode = require('../utils/ConvertRegion')
const nodesCategory = require('../utils/Category')
const nodesRegion = require('../utils/Region')
const SocketIO =  require('../SocketIO/index');
const LastVisitModel = require('../models/lastVisit-model') 

class AdminService {

    async getUsers(req) {
        const {
            limit,
            search,
            page,
        } = req.body
        const regex = search.replace(/ /g, '*.*')
        let searchParam = 
        { $or: [
            {nameOrg: {
            $regex: regex,
            $options: 'i'
        }}, {inn: {
            $regex: regex,
            $options: 'i'
        }}]}
        const option = {
            limit,
            page}
        const userQuery = await UserModel.paginate(searchParam,option)
        const endResult = await Promise.all(userQuery.docs.map(async (item)=>{
            const onLine = SocketIO.userSocketIdMap.has(item?.id)
            const lv = await LastVisitModel.findOne({User:item?._id})
            const newItem = {
                _id:item._id,
                email:item.email,
                name:item.name,
                nameOrg:item.nameOrg,
                inn:item.inn,
                onLine,
                LastVisit:lv?.Date,
                banned: item.banned,
                bannedReason:item.bannedReason
            }
            return newItem
        })) 
        const result = {
            docs:endResult,
            page:userQuery.page,
            totalPages:userQuery.totalPages
        }
        return result;
    }

    async getAsks(req) {
        const {
            limit,
            page,
            searchText,
            searchInn,
            startDate,
            endDate
        } = req.body
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        var searchParam = {
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
        const query = await AskModel.paginate(
            searchParam, 
            options);
        const endResult = await Promise.all(query.docs.map(async (item)=>{
            const countSentMailPack = await SentMailModel.find({Ask:item._id}).countDocuments()
            const newItem = {
                _id:item._id,
                Category:item.Category,
                Region:item.Region,
                Name:item.Name,
                Author:item.Author,
                EndDateOffers:item.EndDateOffers,
                Text:item.Text,
                Date:item.Date,
                NameOrg:item.NameOrg,
                CountSentMailPack:countSentMailPack
            }
            return newItem
        }))
        const result = {
            docs:endResult,
            page:query.page,
            totalPages:query.totalPages
        };
        return result;  
    }
    async getSpecOffers(req) {
        const {
            limit,
            page,
            searchText,
            searchInn,
            startDate,
            endDate
        } = req.body
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        var searchParam = {
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
        const query = await SpecOfferModel.paginate(
            searchParam, 
            options);
        const endResult = await Promise.all(query.docs.map(async (item)=>{
            const countSentMailPack = await SentMailModel.find({SpecOffer:item._id}).countDocuments()
            const newItem = {
                _id:item._id,
                Category:item.Category,
                Region:item.Region,
                Name:item.Name,
                Author:item.Author,
                Files: item.Files,
                EndDateOffers:item.EndDateOffers,
                Text:item.Text,
                Date:item.Date,
                NameOrg:item.NameOrg,
                CountSentMailPack:countSentMailPack
            }
            return newItem
        }))
        const result = {docs:endResult,totalPages:query.totalPages};
        return result;   
    }

    async getPrice(req) {
        const {page,limit,search='',searchInn} = req.body
        console.log( req.body)
        const regex = search.replace(/\s{20000,}/g, '*.*')
        var abc = ({ path: 'User', select: 'nameOrg id' });
        let searchParam = 
                    { $or: [
                        {Name: {
                        $regex: regex,
                        $options: 'i'
                    }}, {Code: {
                        $regex: regex,
                        $options: 'i'
                    }}]}
        if(searchInn){
            searchParam = Object.assign(searchParam,{User:searchInn})
        }
        const result = await PriceModel.paginate(
            searchParam, 
            {page,limit,populate:abc});
        return result
    }
    async getSpamListAsk(req) {
        const {page,limit,search,searchInn,id} = req.body
        let reg = "" + search + "";
        const ask = await AskModel.findOne({_id:id})
        const searchCat = getCategoryName(ask.Category,nodesCategory).join().split(",")
        const searchRegion = getRegionCode(ask.Region,nodesRegion).join().split(",")
        // const result = await GisModel.paginate(
        //     {
        //         Category: {$in : searchCat},
        //         City: {$in : searchRegion}
        //     },
        //        {page,limit}
        // );
        // return result
        var options = {
            sort:{"_id":-1},
            limit,
            page};
        const query = GisModel.aggregate([
            {$match:{
                Category: {$in : searchCat},
                City: {$in : searchRegion}
            }},
            { $group : { _id : "$Email"}}
        ])
        const result = await GisModel.aggregatePaginate(query, options);
        return result
    }
    async getSpamListSpecOffer(req) {
        const {page,limit,search,searchInn,id} = req.body
        let reg = "" + search + "";
        const specOffer = await SpecOfferModel.findOne({_id:id})
        const searchCat = getCategoryName(specOffer.Category,nodesCategory).join().split(",")
        const searchRegion = getRegionCode(specOffer.Region,nodesRegion).join().split(",")
        // const result = await GisModel.paginate(
        //     {
        //         Category: {$in : searchCat},
        //         City: {$in : searchRegion}
        //     },
        //        {page,limit}
        // );
        // return result
        var options = {
            sort:{"_id":-1},
            limit,
            page};
        const query = GisModel.aggregate([
            {$match:{
                Category: {$in : searchCat},
                City: {$in : searchRegion}
            }},
            { $group : { _id : "$Email"}}
        ])
        const result = await GisModel.aggregatePaginate(query, options);
        return result
    }
    async sendSpamByAsk(req) {
        const {
            id,
            list,
            limit,
            currentPage
        } = req.body
        const result = await SentMailModel.create({
            To:list,
            Limit: limit,
            CurrentPage:currentPage,
            Ask:id  
        })
        return result
    }
    async sendSpamBySpecOffer(req) {
        const {
            id,
            list,
            limit,
            currentPage
        } = req.body
        const result = await SentMailModel.create({
            To:list,
            Limit: limit,
            CurrentPage:currentPage,
            SpecOffer:id  
        })
        return result
    }
    async getSentSpamByAsk(req) {
        const {
            Ask,
            page,
            limit,
        } = req.body
        var options = {
            sort:{"_id":-1},
            limit,
            page};
        const result = await SentMailModel.paginate({Ask},options)
        return result
    }
    async getSentSpamBySpecOffer(req) {
        const {
            SpecOffer,
            page,
            limit,
        } = req.body
        var options = {
            sort:{"_id":-1},
            limit,
            page};
        const result = await SentMailModel.paginate({SpecOffer},options)
        return result
    }
    async userBan(req) {
        const {
            id,
            ban,
            bannedReason,
            bannedTo
        } = req.body
        const result = await UserModel.updateOne(
            {_id:id},
            {$set:{
                banned:ban,
                bannedReason,
                bannedTo
            }})
        const onLine = SocketIO.userSocketIdMap.has(id)
        return result
    }
}

module.exports = new AdminService()