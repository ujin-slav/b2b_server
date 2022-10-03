const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model')
const LentStatusModel =require('../models/lentStatus-model')
const UnreadInvitedModel = require("../models/unreadInvited-model")
const roleService = require('./role-service')
const ApiError = require('../exceptions/api-error');
const mailService =require('./mail-service')
const fs = require("fs");

class AskService {
    async addAsk(req) {
        const {
            Author,
            Name,
            MaxPrice,
            Telefon,
            MaxDate,
            EndDateOffers,
            Comment,
            Text,
            Category,
            Region,
            Date,
            Private,
            Send,
            Hiden,
        } = req.body
        const Party =  JSON.parse(req.body.Party)
        const user = await UserModel.findOne({_id:Author});
         const ask = await AskModel.create({
            Author,
            Name,
            MaxPrice:MaxPrice.toString(),
            Telefon,
            EndDateOffers,
            Comment,
            Text,
            Category:JSON.parse(Category),
            Region:JSON.parse(Region),
            Date,
            Files:req.files,
            Private,
            Send,
            Hiden,
            Party,
            NameOrg: user.nameOrg,
            Inn: user.inn
        })
        await Promise.all(Party.map(async (item)=>{
            const userParty = await UserModel.findOne({email:item.Email})
            if(userParty){
               await UnreadInvitedModel.create({
                Ask: ask,
                To: userParty,
               })
               if(userParty.notiInvited!==false){
                mailService.sendInvited(item.Email,ask,user)           
               }
            }else if(Send){
                mailService.sendInvited(item.Email,ask,user)        
            }
        }))
        return {ask} 
    }

    async setWinner(req) {
        const {
          winnerDTO,
          id
        } = req.body
        const ask =  await AskModel.updateOne({_id:id},{$set:{Winner:winnerDTO.AuthorID}})
        return ask
    }

    async getAsk(req) {
        const {
            limit,
            page,
            authorId
        } = req.body.formData
        if(authorId){
            const user = await UserModel.findOne({_id:authorId});
            const result = await AskModel.paginate({Author:user}, {page,limit,sort:{"_id":-1}});
            return result;
        } else {
            var abc = ({ path: 'Author', select: 'name nameOrg inn' });
            var options = {
                sort:{"_id":-1},
                populate: abc, 
                limit,
                page};
            const result = await AskModel.paginate({}, options);
            return result;
        }    
    }

    async getFilterAsk(req) {
        let searchParam = {}
        const {
            limit,
            page,
            region,
            category,
            inn,
            nameAsk,
            filterCat,
            filterRegion,
            searchText,
            searchInn,
        } = req.body.formData
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
        const result = await AskModel.paginate(
            searchParam, 
            options);
        return result;  
    }

    async getInvitedAsk(req) {
        const {
            limit,
            page,
            email,
            userId
        } = req.body.formData
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
            limit,
            page};
        var searchParam = {
            Party: {$elemMatch: {Email:email}}
        }    
        await UnreadInvitedModel.deleteMany({
            To: userId,
        })
        const result = await AskModel.paginate(
            searchParam, 
            options);    
        return result;  
    }


    async getOneAsk(id) {
        const ask = await AskModel.findOne({_id:id}).populate({path:'Author', select:'name nameOrg inn telefon'});
        return ask;
    }

    async fillAsk() {
        for (let i = 0; i < 50; i++) {
                await AskModel.create({
                    Client:"Client",
                    Name:"111",
                    Status:"Status" + i,
                    Price:"12121",
                    FIO:"FIO",
                    Telefon:"Telefon",
                    DeliveryAddress:"DeliveryAddress",
                    TermsPayments:"TermsPayments",
                    Comment:"Comment",
                    TextAsk:"Text",
                })
        }
        return {message:"hi"};
    }

    async deleteAsk(req) {
        const {id} = req.body        
        const ask = await AskModel.findOne({_id:id});      
        if(ask){
            ask.Files.map((item)=>{
                fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Файл удалён");
                    }
                });
            })
        }
        await AskModel.deleteOne({_id:id}); 
        return ask
    }
    async getUserAsks(req) {
        const {
            id,
            limit,
            page,
        } = req.body.formData
        var options = {
            sort:{"_id":-1}, 
            limit,
            page};
        const result = await AskModel.paginate({Author:id},options);
        return result;   
    }

    async modifyAsk(req) {
        const {
            Id,
            Author,
            Name,
            Telefon,
            EndDateOffers,
            Text,
            Category,
            Region,
            Date,
            DeletedFiles,
            Private,
            Hiden,
            Comment,
            Party,
        } = req.body
        JSON.parse(DeletedFiles).map((item)=>{
            if(fs.existsSync(__dirname+'\\..\\'+item.path)){
            fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл удалён");
                }
            })};
        })
        const user = await UserModel.findOne({_id:Author})
        const authorAsk =  await AskModel.findOne({_id:Id}).populate({path:'Author', select:'id'})
        if(req.user.id===authorAsk.Author.id){
            const ask = await AskModel.updateOne({_id:Id},{$set:{
                Author,
                Name,
                Telefon,
                EndDateOffers,
                Text,
                Category:JSON.parse(Category),
                Region:JSON.parse(Region),
                Date,
                Files:req.files,
                Private,
                Hiden,
                Party:JSON.parse(Party),
                Comment,
                NameOrg: user.nameOrg,
                Inn: user.inn
            }})
            return ask
        }else{
            throw ApiError.BadRequest('Нет прав на изменение') 
        }
    }
    fileNameToObject(files,reqFiles,author){
        let filesTemp = []  
        if(Array.isArray(files)){
            files.map((item)=>{
                const el = reqFiles.find(file => file.originalname === item)
                if(el){
                    filesTemp.push({...el,author})
                }
            })
        }else if(files){
            filesTemp.push({...reqFiles[0],author})
        }
        return filesTemp
    }

    async setStatusAsk(req) {
        const {
            CrContractfiles,
            SiContractfiles,
            Paidfiles,
            Shipmentfiles,
            Receivedfiles,
            AskId,
            DeletedFiles,
            Status,
            PrevStatus,
            Author,
            Winner
        } = req.body
        JSON.parse(DeletedFiles).map((item)=>{
            if(fs.existsSync(__dirname+'\\..\\'+item.path)){
            fs.unlink(__dirname+'\\..\\'+item.path, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл удалён");
                }
            })};
        })
        const status = await AskModel.updateOne({_id:AskId},{
            Status:{
                CrContractfiles:this.fileNameToObject(CrContractfiles,req.files,Author),
                SiContractfiles:this.fileNameToObject(SiContractfiles,req.files,Author),
                Paidfiles:this.fileNameToObject(Paidfiles,req.files,Author),
                Shipmentfiles:this.fileNameToObject(Shipmentfiles,req.files,Author),
                Receivedfiles:this.fileNameToObject(Receivedfiles,req.files,Author),
                Status:JSON.parse(Status)
            }
        })
        await LentStatusModel.create({
            Ask:AskId,
            PrevStatus:JSON.parse(PrevStatus),
            Author,
            Winner,
            Date:Date.now()
        })
        return status
    }
    async getStatusAsk(req) {
        const {id} = req.body
        const status = await AskModel.findOne({_id:id})
        return status
    }
}

module.exports = new AskService()