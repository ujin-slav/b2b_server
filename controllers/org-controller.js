const ApiError = require('../exceptions/api-error');
const orgService = require('../service/org-service');

class OrgController {

    async getOrg(req, res, next) {
        try {
            const result = await orgService.getOrg(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

   

}


module.exports = new OrgController();