const ContrModel = require('../models/contr-model')
const UserModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error');

class ContrService {

    async addContr(req) {
        const {
            userid,
            email,
            name,
        } = req.body
        const user = await UserModel.findOne({ _id: userid });
        const candidate = await ContrModel.findOne({
            User:user, 
            Email:email
        })
        if (candidate){
            throw ApiError.BadRequest(`Такой email уже существует`)
        }   
        console.log(name)
        const contr = await ContrModel.create({
            User:user, 
            Email:email,
            Name:name
        })
        return contr
    }

    async getContr(req) {
        const {
        userid
        } = req.body    
        const user = await UserModel.findOne({ _id: userid });
        const contr = await ContrModel.find({User:user})
        return contr
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