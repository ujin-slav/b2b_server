const fs = require("fs");

class LoadService {

    async deleteFile(req) {
        const{path} = req.body
        if(fs.existsSync(__dirname+'\\..\\' + path)){
            fs.unlink(__dirname+'\\..\\' + path, function(err){
                if (err) {
                    throw ApiError.BadRequest('Файл не найден')
                } else {
                    return true
                }
        })};
    }

    async upLoadChatFile(req) {
        return req.file
    }
    
}

module.exports = new LoadService();