const UserModel =require('../models/user-model')
const ChatModel = require('../models/chat-model')
const ContactsModel =require('../models/contacts-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const mailService =require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(req) { 
        const { email, 
                password,
                name,
                nameOrg,
                INN,
                adressOrg,
                fiz,
                telefon} = req.body.data;
  
        const candidate = await UserModel.findOne({email})
        if (candidate){
            throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password,3)
        const activationLink = uuid.v4()

        const user = await UserModel.create(
            {email,password: hashPassword,
             activationLink, name, nameOrg, INN,adressOrg, fiz, telefon}) 
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
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
        const user = await UserModel.findOne({_id:id});
        const result = {
            email:user.email,
            name:user.name,
            nameOrg:user.nameOrg,
            telefon:user.telefon,
            adressOrg: user.adressOrg,
            inn: user.inn
        }
        return result;
    }

    async getUsers(req) {
        const {page,limit,user} = req.body
        var abc = ({ path: 'contact', select: 'name nameOrg email' });
        const option = {
            id:true,
            name:true,
            nameOrg:true,
            sort:{"_id":-1},
            email:true,
            populate: abc, 
            limit,
            page}
        const result = await ContactsModel.paginate(
            {owner:user},
            option);
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
            category
        } = req.body.data.data
        const user = await UserModel.updateOne({_id:id},{$set: 
                {name,
                nameOrg,
                adressOrg,
                telefon,
                inn,
                fiz,  
                region:JSON.parse(region),
                category:JSON.parse(category)
        }});
        const userDto = new UserDto(user);
        return {user: userDto}
    }

}

module.exports = new UserService()