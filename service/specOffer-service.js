

class specOfferService {

    async addSpecOffer(req) {
        const {
            Author,
            Name,
            Telefon,
            MaxDate,
            EndDateOffers,
            Text,
            Category,
            Region,
        } = req.body
        console.log(req.body)
    }
}

module.exports = new specOfferService()