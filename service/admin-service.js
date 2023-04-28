const ApiError = require('../exceptions/api-error');
const UserModel =require('../models/user-model')
const AskModel = require("../models/Ask-model")

class AdminService {

    async getUsers(req) {
        const {
            limit,
            search,
            page,
            startDate,
            endDate
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
        const result = await UserModel.paginate(searchParam,option)
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
        console.log(req.body)
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
        const result = await AskModel.paginate(
            searchParam, 
            options);
        return result;  
    }

    async getPrice(req) {
        const {page,limit,search='',org,spec} = req.body
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
        if(org){
            searchParam = Object.assign(searchParam,{User:org})
        }
        const result = await PriceModel.paginate(
            searchParam, 
            {page,limit,populate:abc});
        return result
    }
}

module.exports = new AdminService()