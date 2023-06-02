const fs = require("fs");
const PriceModel = require('../models/price-model')
const PriceAskModel = require('../models/priceAsk-model')
const LentStatusModel =require('../models/lentStatus-model')
const UnreadInvitedPriceModel = require("../models/unreadInvitedPrice-model")
const UnreadInvitedPriceFizModel = require("../models/unreadInvitedPriceFiz-model")
const UnreadStatusAskModel = require("../models/unreadStatusAsk-model")
const builder = require('xmlbuilder')
const ApiError = require('../exceptions/api-error');

String.prototype.replaceAll = function(search, replace){
    return this.split(search).join(replace);
}

class PriceService {

    async createPriceXML(userID) {
        const price = await PriceModel.find({User:userID})
        var xml = builder.create('urlset')
        xml.att('xmlns',"http://www.sitemaps.org/schemas/sitemap/0.9")
        await Promise.all(price.map(async (item)=>{
            xml.ele("url",).ele("loc", `${process.env.CLIENT_URL}/orginfo/${userID}/${String(item._id)}`);
        }))
        const result = xml.end({ pretty: true});
        if(fs.existsSync(__dirname+'//../sitemapPrice/' + userID + 'Price.xml')){
            fs.unlink(__dirname+'//../sitemapPrice/' + userID + 'Price.xml', function(err){
                if (err) {
                    throw ApiError.BadRequest('Файл не найден')
                }else{
                    console.log("файл удален")
                }
        })};
        fs.writeFileSync(__dirname + '//../sitemapPrice/' + userID + 'Price.xml', result, function (err) {
            if (err) throw ApiError.BadRequest('Файл не записан');
        });
    }

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
                    Code:code || "",
                    Name: nameItem,
                    Price: item[2],
                    Balance: balance || 0,
                    User:userID,
                    Date: Date.now()
                })
            }
        }))
        this.createPriceXML(userID)
        return {result:true}
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
        if(spec && org){
            searchParam = Object.assign(searchParam,{User:org,SpecOffer : {$ne : null}})
        }
        const result = await PriceModel.paginate(
            searchParam, 
            {page,limit,populate:abc});
        return result
    }

    getFilterObj(filterCat,filterRegion,match){
        if(filterCat.length==0 && filterRegion.length==0){
            return match
        }
        if(filterCat.length>0 && filterRegion.length==0){
            return Object.assign({
                category: {$in : [filterCat]}
            },match)
        }
        if(filterCat.length==0 && filterRegion.length>0){
            return Object.assign({
                region: {$in : [filterRegion]}
            },match)
        }
        if(filterCat.length>0 && filterRegion.length>0){
            return Object.assign({
                category: {$in : [filterCat]},
                region: {$in : [filterRegion]}
            },match)
        }
    }

    async getFilterPrice(req) {
        const {
            limit,
            page,
            searchInn,
            searchText,
            startDate,
            filterCat,
            filterRegion,
            endDate
        } = req.body
        const regex = searchText.replace(/\s{20000,}/g, '*.*')
        const regexInn = searchInn.replace(/\s{20000,}/g, '*.*')
        const match = {
            $and:[
                {$or: [
                    {nameOrg: {
                    $regex: regexInn,
                    $options: 'i'
                }}, {inn: {
                    $regex: regexInn,
                    $options: 'i'
                }}
                ]},
                    {Name: {
                    $regex: regex,
                    $options: 'i'
                }},
            ],
            Date: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            }
        }
        const newMatch = this.getFilterObj(filterCat,filterRegion,match)
        var options = {
            sort:{"_id":-1},
            limit,
            page};
        const search = PriceModel.aggregate([
            { $lookup:
                {
                   from: "users",
                   localField: "User",
                   foreignField: "_id",
                   as: "out"
                }
            },
            {$unwind:'$out'},
            {$project:
                {
                 nameOrg:'$out.nameOrg',
                 inn: '$out.inn',
                 category:"$out.category",
                 region: "$out.region",
                 Code:'$Code',
                 User:'$out',
                 Name:'$Name',
                 Price:'$Price',
                 Balance:'$Balance',
                 Date:'$Date',
                }
            },
            {$match:newMatch}
        ])
        const result = await PriceModel.aggregatePaginate(search, options);
        console.log(result)
        return result
    }
    async getPriceUnit(req) {
        const {id} = req.body
        try {
            const result = PriceModel.findOne({_id:id})
            return result
        } catch (error) {
            return {docs:[]}
        }
    }

    async clearPrice(req) {
       const result = await PriceModel.deleteMany({User:req.user.id})
       return result
    }

    async saveAsk(req) {
        let result
        const {Author,
            To,
            Table,
            Comment,
            Sum,
            Sent,
            FIZ,
            NameFiz,
            EmailFiz,
            TelefonFiz} = req.body
        if(!FIZ){
            await UnreadInvitedPriceModel.create({
                PriceAsk:result,
                To
            })
            return result = await PriceAskModel.create({
                Author,
                To,
                Table,
                Sent,
                Comment,
                Sum,
                Date: new Date()
            })
        }else{
            await UnreadInvitedPriceFizModel.create({
                PriceAsk:result,
                To
            })
            return result = await PriceAskModel.create({
                To,
                Table,
                Comment,
                Sum,
                FIZ:true,
                NameFiz,
                EmailFiz,
                TelefonFiz,
                Date: new Date()
        })}
     }

     async getAskPrice(req) {
        let result
        const {
            limit,
            page,
            searchInn="",
            searchComment="",
            to,
            authorId,
            startDate,
            endDate
        } = req.body
        const regexInn = searchInn.replace(/\s{20000,}/g, '*.*')
        const regexComment = searchComment.replace(/\s{20000,}/g, '*.*')
        var abc = ([{ path: 'To', select: 'name nameOrg inn' },
        {path: 'Author', select: 'name nameOrg inn'}]);
        var options = {
            sort:{"_id":-1},
            populate: abc, 
            limit,
            page};
        if(to){
            const aggregate = PriceAskModel.aggregate([
                { $lookup:
                    {
                       from: "users",
                       localField: "Author",
                       foreignField: "_id",
                       as: "out"
                    }
                },
                {$unwind:'$out'},
                {$project:
                    {
                     nameOrg:'$out.nameOrg',
                     inn: '$out.inn',
                     Text: '$Text',
                     Author:'$out',
                     Comment:'$Comment',
                     Sum:'$Sum',
                     Date: '$Date',
                     Sent: '$Sent',
                     Status: '$Status',
                     Fiz: '$Fiz',
                     To: {$toString: "$To"} 
                    }
                },
                {$match:{
                    $and:[
                        {$or: [
                            {nameOrg: {
                            $regex: regexInn,
                            $options: 'i'
                        }}, {inn: {
                            $regex: regexInn,
                            $options: 'i'
                        }}
                        ]},
                        {To:to},
                    ],
                    Date: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                }}
            ])
            result = await PriceAskModel.aggregatePaginate(aggregate, options);
            await UnreadInvitedPriceModel.deleteMany({
                To: to,
            })
        }else if(authorId){
            const aggregate = PriceAskModel.aggregate([
                { $lookup:
                    {
                       from: "users",
                       localField: "Author",
                       foreignField: "_id",
                       as: "out"
                    }
                },
                { $lookup:
                    {
                       from: "users",
                       localField: "To",
                       foreignField: "_id",
                       as: "outTo"
                    }
                },
                {$unwind:'$out'},
                {$unwind:'$outTo'},
                {$project:
                    {
                     nameOrg:'$out.nameOrg',
                     inn: '$out.inn',
                     Text: '$Text',
                     To: '$outTo',
                     Comment:'$Comment',
                     Sum:'$Sum',
                     Date: '$Date',
                     Sent: '$Sent',
                     Status: '$Status',
                     Author: {$toString: "$Author"} 
                    }
                },
                {$match:{
                    $and:[
                        {$or: [
                            {nameOrg: {
                            $regex: regexInn,
                            $options: 'i'
                        }}, {inn: {
                            $regex: regexInn,
                            $options: 'i'
                        }}
                        ]},
                        {Comment: {
                            $regex: regexComment,
                            $options: 'i'
                        }},
                        {Author:authorId},
                    ],
                    Date: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                }}
            ])
            result = await PriceAskModel.aggregatePaginate(aggregate, options);
        }      
         return result; 
    }
    async getAskPriceFiz(req) {
        const {
            limit,
            page,
            search='',
            to,
            startDate,
            endDate
        } = req.body
        const regex = search.replace(/\s{20000,}/g, '*.*')
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
		const result = PriceAskModel.paginate(
            {
                To:to,
                Date: { $gte: sd, $lt: ed },
                $and:[
                    {$or: [
                        {NameFiz: {
                        $regex: regex,
                        $options: 'i'
                    }}, {EmailFiz: {
                        $regex: regex,
                        $options: 'i'
                    }},
                        {TelefonFiz: {
                        $regex: regex,
                        $options: 'i'
                    }}
                ]}
                ]
            }, 
            {page,limit,sort:{"_id":-1}}
        );
        await UnreadInvitedPriceFizModel.deleteMany({
            To: to,
        })
        return result;
    }
    async getAskPriceId(req) {
        const {id} = req.body
        const result = await PriceAskModel.findOne({_id:id}).
        populate([{path: 'To', select: 'name nameOrg inn'},
                {path: 'Author', select: 'name nameOrg inn _id'}
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
    async setStatusPriceAsk(req) {
        const {
            CrContractfiles,
            SiContractfiles,
            Bilsfiles,
            Paidfiles,
            Shipmentfiles,
            Receivedfiles,
            PriceAskId,
            Otherfiles,
            PrevStatus,
            AuthorAsk,
            AskTo,
            Author,
            Status
        } = req.body
        const status = await PriceAskModel.updateOne({_id:PriceAskId},{
            Status:{
                CrContractfiles:this.fileNameToObject(CrContractfiles,req.files,Author),
                SiContractfiles:this.fileNameToObject(SiContractfiles,req.files,Author),
                Bilsfiles:this.fileNameToObject(Bilsfiles,req.files,Author),
                Paidfiles:this.fileNameToObject(Paidfiles,req.files,Author),
                Otherfiles:this.fileNameToObject(Otherfiles,req.files,Author),
                Shipmentfiles:this.fileNameToObject(Shipmentfiles,req.files,Author),
                Receivedfiles:this.fileNameToObject(Receivedfiles,req.files,Author),
                Status:JSON.parse(Status)
            }
        })
        const priceAsk = await PriceAskModel.findOne({_id:PriceAskId})
        await LentStatusModel.create({
            PriceAsk:PriceAskId,
            PrevStatus:JSON.parse(PrevStatus),
            Date:Date.now(),
            Author,
            Winner:priceAsk.To
        })
        await UnreadStatusAskModel.create({
            PriceAskId,
            To: Author===AuthorAsk? AskTo : AuthorAsk
        })
        return status
    }
    async getStatusPriceAsk(req) {
        const {id} = req.body
        const status = await PriceAskModel.findOne({_id:id})
        return status
    }
    async deleteStatusPriceAskFile(req) {
        const 
            {priceAskId,
            nameArray,
            file
            } = req.body
        const priceAsk = await PriceAskModel.findOne({_id:priceAskId})
        if(fs.existsSync(__dirname+'\\..\\'+file.path)){
            fs.unlink(__dirname+'\\..\\'+file.path, function(err){
                if (err) {
                    throw ApiError.BadRequest('Файл не найден')
                }
        })};
        const status = priceAsk.Status
        if(Array.isArray(status[nameArray])){
            let newStatus = status[nameArray].filter(item=>item.filename!==file.filename)
            status[nameArray]=newStatus
        }
        const updateStatus = await PriceAskModel.updateOne({_id:priceAskId},{
            Status:status
        })
        return updateStatus
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