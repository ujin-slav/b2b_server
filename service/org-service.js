const OrgModel = require('../models/Org-model')

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
}

module.exports = new OrgService()