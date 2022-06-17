const fs = require("fs");
const PriceModel = require('../models/price-model')

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


}

module.exports = new PriceService()