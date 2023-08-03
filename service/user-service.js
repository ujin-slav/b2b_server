const UserModel =require('../models/user-model')
const tokenModel = require('../models/token-model')
const ChatModel = require('../models/chat-model')
const ContactsModel = require('../models/contacts-model')
const LastVisitModel = require('../models/lastVisit-model') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const mailService =require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error');
const SocketIO =  require('../SocketIO/index');
const fs = require("fs");

class UserService {
    async registration(req) { 
        const { email, 
                password,
                name,
                nameOrg,
                inn,
                adressOrg,
                fiz,
                telefon,
                site,
                description,
                region,
                category} = req.body.data;
  
        const candidate = await UserModel.findOne({email})
        if (candidate){
            throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password,3)
        const activationLink = uuid.v4()

        const user = await UserModel.create(
                {email,
                password: hashPassword,
                activationLink,
                name, 
                nameOrg, 
                inn,
                adressOrg, 
                fiz, 
                site,
                description,
                telefon,
                region:JSON.parse(region),
                category:JSON.parse(category),
                notiInvited:true,
                notiMessage:true,
                notiQuest:true,
                getAskFromFiz:true,
                notiAsk:true,
                banned:false,
                registrationDate:new Date()}) 
        await mailService.sendActivationMail(email, `${process.env.CLIENT_URL}/activate/${activationLink}`);
        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.Id, tokens.refreshToken);


        return {...tokens, user: userDto} 
    }
    
    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user) {
            throw new ApiError.BadRequest("Неккоректная ссылка активации")
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        //console.log(user);
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        if (!user.isActivated) {
            throw ApiError.BadRequest('Акккаунт не активирован');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
    
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        if(user.banned){
            const nowDate = new Date()
            if(nowDate>user.bannedTo){
                await UserModel.updateOne({_id:user._id},{$set:{banned:false}})
                userDto.banned = false
            }
        }

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async forgot(email) {
        try {
        const user = await UserModel.findOne({email})
        //console.log(user);
        if (!user) {
            return {emailIncorrect:true}
            //throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_SECRET, {
            expiresIn: "20m",
          });
        await mailService.sendRecoveryMail(email, `${process.env.CLIENT_URL}/reset/${token}`); 
        user.resetLink = token;
        await user.save();
        return {result:true}
        } catch(error) {
            console.log(error)
        }
    }

    async reset(token, password){
        try {
            
            jwt.verify(token, process.env.JWT_RESET_SECRET,   (err, decodedData) => {
                if (err) {
                return {tokenIncorrect:true};
            }});
            if (token==="") {
                return {tokenIncorrect:true}
            }
            const user = await UserModel.findOne({resetLink: token})
            if (!user) {
                return {tokenIncorrect:true}
            } 
            const hashPassword = await bcrypt.hash(password,3)
            user.password = hashPassword;
            user.resetLink = "";
            user.save();
            return {result: true}
        } catch (error) {
            console.log(error)
        }
    }

    async getUser(req) {
        const {id} = req.body
        console.log(req.body)
        const user = await UserModel.findOne({_id:id});
        const result = {
            _id:user._id,
            email:user.email,
            name:user.name,
            nameOrg:user.nameOrg,
            telefon:user.telefon,
            adressOrg: user.adressOrg,
            description: user.description,
            inn: user.inn,
            logo:user?.logo
        }
        return result;
    }

    async getUsers(req) {
        const {page,limit,user,search,idorg} = req.body
        const regex = search.replace(/\s{20000,}/g, '*.*')
        const options = {
            page,
            limit,
        }   
        if(idorg){
            let contactRecevier = await ContactsModel.findOne({owner:user,contact:idorg})
            if(contactRecevier===null){
              await ContactsModel.create({owner:user,contact:idorg})
            }else{
              await ContactsModel.deleteOne({owner:user,contact:idorg})
              await ContactsModel.create({owner:user,contact:idorg})
            }
        }    
        const aggregate = ContactsModel.aggregate([
            { $lookup:
                {
                   from: "users",
                   localField: "contact",
                   foreignField: "_id",
                   as: "out"
                }
            },
            {$unwind:'$out'},
            {$project:
                {
                 name:'$out.name',
                 nameOrg: '$out.nameOrg',
                 email: '$out.email',
                 logo: '$out.logo',
                 id: {$toString: "$out._id"},
                 owner: {$toString: "$owner"} 
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
                    }},
                ]},
                    {owner:user}
                ]
            }},
            { $sort : { _id : -1 } }
        ])
        const aggregateContacts = await ContactsModel.aggregatePaginate(aggregate, options)
        const contacts = aggregateContacts.docs
        let result = []
        await Promise.all(contacts.map(async (item)=>{
            const contact = item
            const status = {statusLine:SocketIO.userSocketIdMap.has(item?.id)}
            const lastVisit = await LastVisitModel.findOne({User:item?.id})
            result.push({...status,lastVisit,contact})
        })) 
        aggregateContacts.docs = result
        return aggregateContacts
    }

    async getUserList(req) {
        const {page,limit,search} = req.body
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
            select:'name nameOrg email logo',
            limit,
            page}
        const result = await UserModel.paginate(searchParam,option)
        return result;
    }

    async changeuser(req) {
        const {
            id,
            name,
            nameOrg,
            adressOrg,
            telefon,
            inn,
            fiz,
            region,
            site,
            description,
            category,
            notiInvited,
            notiMessage,
            notiAsk,
            getAskFromFiz,
        } = req.body
        let logo
        ///
        const {refreshToken} = req.cookies
        const userToken = await tokenModel.findOne({user:id})
        if(userToken?.refreshToken!==refreshToken){
            throw ApiError.BadRequest('Токены не совпадают');
        }
        ///
        const existProfile = await UserModel.findOne({_id:id})
        if(fs.existsSync(__dirname+'\\..\\'+ existProfile.logo?.path)){
            fs.unlink(__dirname+'\\..\\'+ existProfile.logo?.path, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл удалён");
                }
        })};
        await UserModel.updateOne({_id:id},{$set: 
                {name,
                nameOrg,
                adressOrg,
                telefon,
                inn,
                fiz,  
                site,
                description,
                logo:req.file,
                region:JSON.parse(region),
                category:JSON.parse(category),
                notiInvited,
                notiMessage,
                notiAsk,
                getAskFromFiz
        }});
        const user = await UserModel.findOne({_id:id})
        const userDto = new UserDto(user);
        return {user: userDto}
    }

    async refreshUser(req){
        const {id} = req.body
        const {refreshToken} = req.cookies
        const user = await tokenModel.findOne({user:id})
        if(user.refreshToken===refreshToken){
            return true
        }else{
            throw ApiError.BadRequest('Токены не совпадают');
        }
    }

}

module.exports = new UserService()