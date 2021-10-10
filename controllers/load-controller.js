const cheerio = require('cheerio');
const fs = require('fs');
const needle = require('needle');
var results = [];
const XLSX = require('xlsx')

class UploadController {
    

    async download(req, res, next) {
        try {
            let file = __dirname + '/../uploads/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    // async parsing(req, res, next) {
    //     try {
    //         var array = [];
    //         needle.get('http://127.0.0.1/parsing.html', function(err, res){
    //             var $ = cheerio.load(res.body);
    //             $('div').each(function(i, item){
    //                 var array = [];
                    
    //                 $(this).children("p").each((i1,item1)=>{
    //                     array.push({
    //                         label: "item" + i + "_" + i1,
    //                         value: item1.children[0].data
    //                     });
    //                 })

    //                 results.push({
    //                     label: "item" + i,
    //                     value: $(this).children("h2").text(),
    //                     children: array 
    //             });
    //             }); 
                
    //         });
    //         res.json(results);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

     async parsing(req, res, next) {
        try {
            var workbook = XLSX.readFile('C:/New.xlsx');
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            var headers = {};
            var data = [];
            for (var z in worksheet) {
                if (z[0] === '!') continue;
                //parse out the column, row, and value
                var tt = 0;
                for (var i = 0; i < z.length; i++) {
                    if (!isNaN(z[i])) {
                        tt = i;
                        break;
                    }
                };
                var col = z.substring(0, tt);
                var row = parseInt(z.substring(tt));
                var value = worksheet[z].v;

                //store header names
                if (row == 1 && value) {
                    headers[col] = value;
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
            console.log(data);
            });          
        } catch (e) {
            next(e);
        }
    }


}


module.exports = new UploadController();