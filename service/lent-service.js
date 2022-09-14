const LentStatusModel =require('../models/lentStatus-model')
const ApiError = require('../exceptions/api-error');

class LentService {

    async getLent(req) {
        const {
            userId,
            limit,
            page
        } = req.body.formData  
        var abc = ([{ path: 'Ask', select: '_id Status Date' },
        {path: 'PriceAsk', select: '_id Status Date'},
        { path: 'Author', select: 'name nameOrg' }]);
        var options = {
            sort:{"_id":-1}, 
            populate:abc,
            limit,
            page};
        let searchParam = 
                    { $or: [
                        {Author:userId}, 
                        {Winner: userId}
                    ]}
        const result = await LentStatusModel.paginate(
            searchParam, 
            options)
        return result
    }
}

module.exports = new LentService()