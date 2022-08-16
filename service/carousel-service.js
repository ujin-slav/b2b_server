const UserModel =require('../models/user-model')

class CarouselService {

    async getCarousel(req) {
        const {page,limit,search} = req.body
        const regex = search.replace(/ /g, '*.*')
        let searchParam = 
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
        const result = await UserModel.paginate(searchParam,option)
        return result
    }
}

module.exports = new CarouselService()