const ContrModel = require('../models/contr-model')
const UserModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error');

class ContrService {

    async addContr(req) {
        const {
            userid,
            contragent
        } = req.body
        const candidate = await ContrModel.findOne({
            User:userid, 
            Contragent:contragent
        })
        if (candidate){
            throw ApiError.BadRequest(`Такой email уже существует`)
        }   
        const contr = await ContrModel.create({
            User:userid, 
            Contragent:contragent
        })
        return contr
    }

    async getContr(req) {
        const {page,limit,user,search} = req.body
        console.log(req.body)
        const regex = search.replace(/\s{20000,}/g, '*.*')
        const options = {
            page,
            limit,
        }        
        const aggregate = ContrModel.aggregate([
            { $lookup:
                {
                   from: "users",
                   localField: "Contragent",
                   foreignField: "_id",
                   as: "out"
                }
            },
            {$unwind:'$out'},
            {$project:
                {
                 name:'$out.name',
                 nameOrg: '$out.nameOrg',
                 inn: '$out.inn',
                 user: {$toString: "$User"} 
                }
            },
            {$match:{
                $and:[
                    {$or: [
                        {nameOrg: {
                        $regex: regex,
                        $options: 'i'
                    }}, {name: {
                        $regex: regex,
                        $options: 'i'
                    }}]},
                    {user}
                ]
            }}
        ])
        const contr = await ContrModel.aggregatePaginate(aggregate, options)
        return contr
    }

    async delContr(req) {
        const {
            id
        } = req.body
        const contr = await ContrModel.deleteOne({_id:id})
        return contr
    }

}

module.exports = new ContrService()