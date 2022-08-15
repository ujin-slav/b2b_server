const ApiError = require('../exceptions/api-error');
const carouselService = require('../service/carousel-service');

class CarouselController {

    async getCarousel(req, res, next) {
        try {
            const result = await carouselService.getCarousel(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }


}


module.exports = new CarouselController();