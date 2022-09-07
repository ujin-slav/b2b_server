const ApiError = require('../exceptions/api-error');
const askService = require('../service/ask-service');

class AskController {
    async addAsk(req, res, next) {
        try {
            const result = await askService.addAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async setWinner(req, res, next) {
        try {
            const result = await askService.setWinner(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getAsk(req, res, next) {
        try {
            const result = await askService.getAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    
    async getFilterAsk(req, res, next) {
        try {
            const result = await askService.getFilterAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

        
    async getInvitedAsk(req, res, next) {
        try {
            const result = await askService.getInvitedAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async getOneAsk(req, res, next) {
        try {
            const id = req.body.id
            //console.log(req.body)
            const result = await askService.getOneAsk(id);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }

    async fillAsk(req, res, next) {
        try {
            const result = await askService.fillAsk();
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }    

    async deleteAsk(req, res, next) {
        try {
            const result = await askService.deleteAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }    

    async modifyAsk(req, res, next) {
        try {
            const result = await askService.modifyAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }   
    async getUserAsks(req, res, next) {
        try {
            const result = await askService.getUserAsks(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }  
    async setStatusAsk(req, res, next) {
        try {
            const result = await askService.setStatusAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async getStatusAsk(req, res, next) {
        try {
            const result = await askService.getStatusAsk(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new AskController();