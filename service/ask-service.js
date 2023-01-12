const AskModel = require("../models/Ask-model")
const UserModel =require('../models/user-model')
const LentStatusModel =require('../models/lentStatus-model')
const UnreadInvitedModel = require("../models/unreadInvited-model")
const UnreadStatusAskModel = require("../models/unreadStatusAsk-model")
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
            const userParty = await UserModel.findOne({_id:item.idContr})
            if(userParty.notiInvited){
               await UnreadInvitedModel.create({
                Ask: ask,
                To: userParty,
               })
                mailService.sendInvited(userParty.email,ask,user)           
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
            authorId,
            search,
            startDate,
            endDate
        } = req.body
        console.log(startDate)
        console.log(endDate)
        const regex = search.replace(/\s{20000,}/g, '*.*')
        const result = await AskModel.paginate(
            {
                Author:authorId,
                $and:[
                    {$or: [
                        {Name: {
                        $regex: regex,
                        $options: 'i'
                    }}, {Text: {
                        $regex: regex,
                        $options: 'i'
                    }},
                        {Comment: {
                        $regex: regex,
                        $options: 'i'
                    }}
                ]}
                ]
            }, 
            {page,limit,sort:{"_id":-1}}
        );
        return result;
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
        console.log(searchParam)
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
            Party: {$elemMatch: {idContr:userId}}
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
            Status,
            PrevStatus,
            Otherfiles,
            Author,
            AuthorAsk,
            Winner
        } = req.body
        const status = await AskModel.updateOne({_id:AskId},{
            Status:{
                CrContractfiles:this.fileNameToObject(CrContractfiles,req.files,Author),
                SiContractfiles:this.fileNameToObject(SiContractfiles,req.files,Author),
                Paidfiles:this.fileNameToObject(Paidfiles,req.files,Author),
                Otherfiles:this.fileNameToObject(Otherfiles,req.files,Author),
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
        await UnreadStatusAskModel.create({
            AskId,
            To: Author===Winner? AuthorAsk : Winner
        })
        return status
    }

    async getStatusAsk(req) {
        const {id} = req.body
        const status = await AskModel.findOne({_id:id})
        return status
    }

    async deleteStatusAskFile(req) {
        const 
            {askId,
            nameArray,
            file
            } = req.body
        const ask = await AskModel.findOne({_id:askId})
        if(fs.existsSync(__dirname+'\\..\\'+file.path)){
            fs.unlink(__dirname+'\\..\\'+file.path, function(err){
                if (err) {
                    throw ApiError.BadRequest('Файл не найден')
                }
        })};
        const status = ask.Status
        if(Array.isArray(status[nameArray])){
            let newStatus = status[nameArray].filter(item=>item.filename!==file.filename)
            status[nameArray]=newStatus
        }
        const updateStatus = await AskModel.updateOne({_id:askId},{
            Status:status
        })
        return updateStatus
    }
}

module.exports = new AskService()