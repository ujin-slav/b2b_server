class UploadController {
    async download(req, res, next) {
        try {
            let file = __dirname + '/uploads/1631108761786--Chrysanthemum.jpg';
            res.download(file);
            console.log(req.body);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new UploadController();