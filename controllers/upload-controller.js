class UploadController {
    async upload(req, res, next) {
        try {
            var x = 'uploads/'+req.file.originalname;
            var temp = new picModel({
                picpath:x
            })
            temp.save((err,data)=>{
                if(err){
                    console.log(err)
                }
            })
        } catch (e) {
            next(e);
        }
    }

    async download(req, res, next) {
        try {
            picModel.find({_id:req.params.id},(err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    var x= __dirname+'/public/'+data[0].picpath;
                    res.download(x)
                }
           })
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new UploadController();