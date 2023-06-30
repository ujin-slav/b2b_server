const UserModel = require('../models/user-model')
const ContrModel = require('../models/contr-model')

class CarouselService {

    async getCarousel(req) {
        let searchParam = {}
        const {
            filterCat,
            filterRegion,
            searchInn,
            page,
            limit,
            user} = req.body
        console.log(page)
        const regex = searchInn.replace(/ /g, '*.*')
        var options = {
            sort:{"_id":1}, 
            select:'name nameOrg email inn logo _id',
            limit,
            page};
        let textInnParam = 
        { $or: [
            {nameOrg: {
            $regex: regex,
            $options: 'i'
        }}, {inn: {
            $regex: regex,
            $options: 'i'
        }}]}
        if(filterCat.length==0 && filterRegion.length==0){
            searchParam = textInnParam
        }
        if(filterCat.length>0 && filterRegion.length==0){
            searchParam = Object.assign({
                category: {$in : filterCat}
            },textInnParam)
        }
        if(filterCat.length==0 && filterRegion.length>0){
            searchParam = Object.assign({
                region: {$in : filterRegion}
            },textInnParam)
        }
        if(filterCat.length>0 && filterRegion.length>0){
            searchParam = Object.assign({
                category: {$in : filterCat},
                region: {$in : filterRegion}
            },textInnParam)
        }
        const result = await UserModel.paginate(searchParam,options)
        if(user){
            const resultAuth = await Promise.all(result.docs.map(async (item)=>{
                const showPlus = await ContrModel.findOne({User:user,Contragent:item._id})
                const newItem = {
                    _id: item._id,
                    email: item.email,
                    name: item.name,
                    nameOrg: item.nameOrg,
                    inn: item.inn,
                    logo: item.logo,
                    contrIs: Boolean(showPlus)
                }
                return newItem
            }))
            return {
                docs:resultAuth,
                page: result.totalPages,
                totalDocs:result.totalDocs
            }
        }else{
            return result
        }
    }
}

module.exports = new CarouselService()