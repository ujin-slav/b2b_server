const fs = require("fs");
const PriceModel = require('../models/price-model')
const PriceAskModel = require('../models/priceAsk-model')
const StatusPriceAskModel = require('../models/statusPriceAsk-model')
const UnreadInvitedPriceModel = require("../models/unreadInvitedPrice-model")


class PriceService {

    async addPrice(req) {
        const {userID} = req.body
        const price = JSON.parse(req.body.price)
        if(userID&&price.length>0){
            await PriceModel.deleteMany({User:userID})
        }      
        await Promise.all(price.map(async (item)=>{
            const code = item[0]
            const nameItem = item[1]
            //const priceItem = Number(item[2])
            const balance = Number(item[3])
            if(nameItem!==null&&balance!==NaN){
                await PriceModel.create({
                    Code:code,
                    Name: nameItem,
                    Price: item[2],
                    Balance: balance,
                    User:userID,
                    Date: Date.now()
                })
            }
        }))
        return {result:true}
    }

    async getPrice(req) {
        const {page,limit,search,org} = req.body
        const regex = search.replace(/ /g, '*.*')
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
    async getPriceUnit(req) {
        const {id} = req.body
        const result = PriceModel.findOne({_id:id})
        return result
    }

    async clearPrice(req) {
       const result = await PriceModel.deleteMany({User:req.user.id})
       console.log(req.user.id)
       return result
    }

    async saveAsk(req) {
        const {Author,
            To,
            Table,
            Comment,
            Sum,
            FIZ,
            NameFiz,
            EmailFiz,
            TelefonFiz} = req.body
        if(!FIZ){
            const result = await PriceAskModel.create({
                Author,
                To,
                Table,
                Comment,
                Sum,
                Date: new Date()
            })
            return result
        }else{
            const result = await PriceAskModel.create({
                To,
                Table,
                Comment,
                Sum,
                FIZ:true,
                NameFiz,
                EmailFiz,
                TelefonFiz,
                Date: new Date()
        })
        UnreadInvitedPriceModel.create({
            PriceAsk:result,
            To
        })
            return result
        }
     }

     async getAskPrice(req) {
        let result
        const {
            limit,
            page,
            to,
            authorId
        } = req.body
        var abc = ([{ path: 'To', select: 'name nameOrg inn' },
        {path: 'Author', select: 'name nameOrg inn'}]);
        var options = {
            sort:{"_id":-1},
            populate: abc, 
            limit,
            page};
        if(to){
            const aggregate = PriceAskModel.aggregate([
                {
                  $project: {
                    _id: {
                      $toString: "$_id"
                    },
                    "Author":true,
                    "Sum":true
                  }
                },
                {
                  $lookup: {
                    from: "statuspriceasks",
                    localField: "_id",
                    foreignField: "PriceAskId",
                    as: "status"
                  }
                }
            ])
            result = await PriceAskModel.aggregatePaginate(aggregate, options);
            await UnreadInvitedPriceModel.deleteMany({
                To: to,
            })
        }else if(authorId){
            const aggregate = PriceAskModel.aggregate([
                { $match: { Author:authorId } },
                {
                  $project: {
                    _id: {
                      $toString: "$_id"
                    }
                  }
                },
                {
                  $lookup: {
                    from: "statuspriceasks",
                    localField: "_id",
                    foreignField: "PriceAskId",
                    as: "status"
                  }
                }
            ])
            result = await PriceAskModel.aggregatePaginate(aggregate, options);
        }   
        return result; 
    }
    async getAskPriceId(req) {
        const {id} = req.body
        const result = await PriceAskModel.findOne({_id:id}).
        populate([{path: 'To', select: 'name nameOrg inn'},
                {path: 'Author', select: 'name nameOrg inn'}
        ])
        return result
    }
    async deletePriceAsk(req) {
        const {id} = req.body  
        const result = await PriceAskModel.deleteOne({_id:id}); 
        return result
    }
    async updatePriceAsk(req) {
        const {Author,
            To,
            Table,
            Comment,
            Sum,
            Sent,
            id} = req.body
        const result = await PriceAskModel.updateOne({_id:id},{$set:{
            Author,
            To,
            Table,
            Comment,
            Sum,
            Sent,
            Date: new Date()
        }})
        return result
    }
    fileNameToObject(files,reqFiles){
        let filesTemp = []  
        if(Array.isArray(files)){
            files.map((item)=>{
                const el = reqFiles.find(file => file.originalname === item)
                if(el){
                    filesTemp.push(el)
                }
            })
        }else if(files){
            filesTemp.push(reqFiles[0])
        }
        return filesTemp
    }
    async setStatusPriceAsk(req) {
        const {
            Bilsfiles,
            Paidfiles,
            Shipmentfiles,
            Receivedfiles,
            PriceAskId,
            DeletedFiles,
            Status
            } = req.body
        const exist = await StatusPriceAskModel.findOne({PriceAskId})
        if(!exist){
            const status = await StatusPriceAskModel.create({
                Bilsfiles:this.fileNameToObject(Bilsfiles,req.files),
                Paidfiles:this.fileNameToObject(Paidfiles,req.files),
                Shipmentfiles:this.fileNameToObject(Shipmentfiles,req.files),
                Receivedfiles:this.fileNameToObject(Receivedfiles,req.files),
                PriceAskId:PriceAskId,
                Status:JSON.parse(Status)
            })
            return status
        }else{
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
            const status = await StatusPriceAskModel.updateOne({PriceAskId},{
                Bilsfiles:this.fileNameToObject(Bilsfiles,req.files),
                Paidfiles:this.fileNameToObject(Paidfiles,req.files),
                Shipmentfiles:this.fileNameToObject(Shipmentfiles,req.files),
                Receivedfiles:this.fileNameToObject(Receivedfiles,req.files),
                Status:JSON.parse(Status)
            })
            return status
        }
    }
    async getStatusPriceAsk(req) {
        const {id} = req.body
        const status = await StatusPriceAskModel.findOne({PriceAskId:id})
        return status
    }
}
module.exports = new PriceService()

// {
//     $project: {
//       _id: {
//         $toString: "$_id"
//       }
//     }
//   },
//   {
//     $lookup: {
//       from: "statuspriceasks",
//       localField: "_id",
//       foreignField: "PriceAskId",
//       as: "status"
//     }
//   },
//   {
//     $facet: {
//         paginatedResults: [{ $skip: page }, { $limit: limit }],
//         totalCount:[{$count: 'count'}]
//     } 
//   }
// ])