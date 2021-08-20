class UploadController {
    async upload(req, res, next) {
        
        try {
            res.send("Single FIle upload success"); 
            console.log(req.body.id);     
        } catch (e) {
            next(e);
        }
    }

    async download(req, res, next) {
        try {
        
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new UploadController();