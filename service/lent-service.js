const LentStatusModel =require('../models/lentStatus-model')
const UnreadStatusAskModel = require("../models/unreadStatusAsk-model")
const ApiError = require('../exceptions/api-error');

class LentService {

    async getLent(req) {
        const {
            userId,
            limit,
            searchInn,
            searchStatus,
            page,
            startDate,
            endDate
        } = req.body
        const sd = new Date(startDate).setHours(0,0,0,0)
        const ed = new Date(endDate).setHours(23,59,59,999)
        const regexInn = searchInn.replace(/\s{20000,}/g, '*.*')
        const regexStatus = searchStatus.replace(/\s{20000,}/g, '*.*')
        var options = {
            sort:{"_id":-1}, 
            limit,
            page};
        const aggregate = LentStatusModel.aggregate([
            { $lookup:
                {
                   from: "users",
                   localField: "Author",
                   foreignField: "_id",
                   as: "outAuthor"
                }
            },
            { $lookup:
                {
                   from: "users",
                   localField: "Winner",
                   foreignField: "_id",
                   as: "outWinner"
                }
            },
            { $lookup:
                {
                   from: "asks",
                   localField: "Ask",
                   foreignField: "_id",
                   as: "outAsk"
                }
            },
            { $lookup:
                {
                   from: "priceasks",
                   localField: "PriceAsk",
                   foreignField: "_id",
                   as: "outPriceAsk"
                }
            },
            {$unwind:'$outAuthor'},
            {$unwind:'$outWinner'},
            {$unwind:{ path: "$outAsk",preserveNullAndEmptyArrays: true}},
            {$unwind:{ path: "$outPriceAsk",preserveNullAndEmptyArrays: true}},
            {$unwind:'$PrevStatus'},
            {$project:
                {
                 PrevStatus:'$PrevStatus',
                 Ask: '$outAsk',
                 PriceAsk: '$outPriceAsk',
                 Date: '$Date',
                 AuthorId: {$toString: "$Author"},
                 Author: '$outAuthor',
                 Winner: {$toString: "$Winner"},
                 nameOrg:'$outAuthor.nameOrg',
                 inn:'$outAuthor.inn',
                 statusPriceAsk:'$outPriceAsk.Status.Status.labelRu',
                 statusAsk:'$outAsk.Status.Status.labelRu'
                }
            },
            {$match:{
                $or: [{AuthorId:userId},{Winner:userId}],
                $or: [
                    {nameOrg: {
                    $regex: regexInn,
                    $options: 'i'
                }}, {inn: {
                    $regex: regexInn,
                    $options: 'i'
                }}],
                $or: [
                    {statusAsk: {
                    $regex: regexStatus,
                    $options: 'i'
                }}, {statusPriceAsk: {
                    $regex: regexStatus,
                    $options: 'i'
                }}],
                Date: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate)
                }
            }}
        ])
        const result = await LentStatusModel.aggregatePaginate(aggregate, options);
        await UnreadStatusAskModel.deleteMany({
            To: userId,
        })
        return result
    }
}

module.exports = new LentService()