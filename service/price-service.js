const fs = require("fs");
const PriceModel = require('../models/price-model')


class PriceService {
    escapeRegex(text){
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    async addPrice(req) {
        const {userID} = req.body
        const price = JSON.parse(req.body.price)
        if(userID&&price.length>0){
            await PriceModel.deleteMany({User:userID})
        }      
        await Promise.all(price.map(async (item)=>{
            const code = item[0]
            const nameItem = item[1]
            const priceItem = Number(item[2])
            if(nameItem!==null&&priceItem!==NaN){
                await PriceModel.create({
                    Code:code,
                    Name: nameItem,
                    Price: priceItem,
                    Balance: item[3],
                    User:userID,
                    Date: Date.now()
                })
            }
        }))
        return {result:true}
    }

    async getPrice(req) {
        const {page,limit,search,org} = req.body
        let reg = "" + search + "";
        const regex = new RegExp(this.escapeRegex(search), 'gi');
        var abc = ({ path: 'User', select: 'nameOrg id' });
        let searchParam = 
                    { $or: [
                        {Name: {
                        $regex: reg,
                        $options: 'i'
                    }}, {Code: {
                        $regex: reg,
                        $options: 'i'
                    }}]}
                    console.log(org)
        if(org){
            searchParam = Object.assign(searchParam,{$and:{User:org}})
        }
        const result = await PriceModel.paginate(
            searchParam, 
            {page,limit,populate:abc});
        return result
    }


}

module.exports = new PriceService()