const cheerio = require('cheerio');
const fs = require('fs');
const needle = require('needle');
var results = [];

class UploadController {
    

    async download(req, res, next) {
        try {
            let file = __dirname + '/../uploads/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    async parsing(req, res, next) {
        try {
            var array = [];
            needle.get('http://127.0.0.1/region.html', function(err, res){
                var $ = cheerio.load(res.body);
                $('div').each(function(i, item){
                    var array = [];
                    
                    $(this).children("p").each((i1,item1)=>{
                        array.push({
                            value: "item" + i + "_" + i1,
                            label: item1.children[0].data
                        });
                    })

                    results.push({
                        value: "item" + i,
                        label: $(this).children("h2").text(),
                        children: array 
                });
                }); 
                
            });
            res.json(results);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new UploadController();