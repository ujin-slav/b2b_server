const UserModel = require('../models/user-model')
const ContrModel = require('../models/contr-model')

class CarouselService {

    async getCarousel(req) {
        const {
            filterCat,
            filterRegion,
            searchInn,
            page,
            limit,
            user} = req.body
        const regex = searchInn.replace(/ /g, '*.*')
        var abc = ({ path: 'Author', select: 'name nameOrg inn' });
        var options = {
            sort:{"_id":-1}, 
            populate: abc,
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
        const option = {
            select:'name nameOrg email inn logo _id',
            limit,
            page}
        if(filterCat.length==0 && filterRegion.length==0){
            searchParam = textInnParam
        }
        if(filterCat.length>0 && filterRegion.length==0){
            searchParam = Object.assign({
                Category: {$in : filterCat}
            },textInnParam)
        }
        if(filterCat.length==0 && filterRegion.length>0){
            searchParam = Object.assign({
                Region: {$in : filterRegion}
            },textInnParam)
        }
        if(filterCat.length>0 && filterRegion.length>0){
            searchParam = Object.assign({
                Category: {$in : filterCat},
                Region: {$in : filterRegion}
            },textInnParam)
        }
        const result = await UserModel.paginate(searchParam,option)
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