const AskModel = require('../models/Ask-model');
const OrgModel = require('../models/Org-model')
const GisModel = require('../models/gis-model')
const getCategoryName = require('../utils/ConvertCategory')
const getRegionCode = require('../utils/ConvertRegion')
const nodesCategory = require('../utils/Category')
const nodesRegion = require('../utils/Region')

class OrgService {

    async getOrg(req) {
        const {page,limit,search} = req.body
        let reg = "" + search + "";
        const result = await OrgModel.paginate(
            { $or: [
            {INN: {
            $regex: reg,
            $options: 'i'
        }}, {NameOrg: {
            $regex: reg,
            $options: 'i'
        }}
        ]}, 
        {page,limit});
        return result
    }

    async getOrgCat(req) {
        const {page,limit,search} = req.body
        let reg = "" + search + "";
        const ask = await AskModel.findOne({_id:"62704481571e4b171c30335a"})
        const searchCat = getCategoryName(ask.Category,nodesCategory).join().split(",")
        const searchRegion = getRegionCode(ask.Region,nodesRegion).join().split(",")
        console.log(searchCat)
        console.log(searchRegion)
        const result = await GisModel.paginate(
           {Category: {$in : searchCat},
           City: {$in : searchRegion}},
        {page:1,limit:100});
        return result
    }
}

module.exports = new OrgService()