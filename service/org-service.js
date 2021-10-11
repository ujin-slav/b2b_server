const OrgModel = require('../models/Org-model')

class OrgService {
    async getOrg(req) {
        const {page,limit} = req.body
        const result = await OrgModel.paginate({}, {page,limit});
        return result
    }

    

}

module.exports = new OrgService()