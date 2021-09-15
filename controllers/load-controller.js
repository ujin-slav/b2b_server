class UploadController {
    async download(req, res, next) {
        try {
            let file = __dirname + '/../uploads/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new UploadController();