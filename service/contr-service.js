const ContrModel = require('../models/contr-model')
const UserModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error');

class ContrService {

    async addContr(req) {
        const {
            userid,
            contragent
        } = req.body
        console.log(contragent)
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
        const regex = search.replace(/\s{20000,}/g, '*.*')
        var abc = ({ path: 'Contragent', select: 'id name nameOrg email',
        match:{
            $or: [
                {nameOrg: {
                $regex: regex,
                $options: 'i'
            }}, {name: {
                $regex: regex,
                $options: 'i'
            }}] 
        }});
        const option = {
            sort:{"_id":-1},
            populate: abc,
            limit,
            page}
        const contr = await ContrModel.paginate(
            {User:user,Contragent:{$ne:null}},
            option);
        return contr
        // const {page,limit,search,user} = req.body

        // var options = {
        //     sort:{"_id":-1},
        //     populate: abc,
        //     limit,
        //     page};
        // console.log(search)    
        // const contr = await ContrModel.paginate({User:user}, options)

        // return contr
    }

    async delContr(req) {
        const {
            userid,
            email
        } = req.body
        const user = await UserModel.findOne({ _id: userid });

        const contr = await ContrModel.deleteOne({User:user, Email:email})
        return contr
    }

}

module.exports = new ContrService()