const cheerio = require('cheerio');
const loadService = require('../service/load-service');
const fs = require('fs');
const needle = require('needle');
var results = [];
const XLSX = require('xlsx')
const OrgModel =require('../models/Org-model')
const csvjson = require('csvjson');
const readFile = require('fs').readFile;
const Excel = require('exceljs');
var parse = require('csv-parse')

class UploadController {
    
    async getPic(req, res, next) {
        try {
            let file = __dirname + '/../uploadsPic/' + req.params.file;
            if(fs.existsSync(file)){
                res.download(file)
            }else{
                res.download(__dirname + '/../serviceImage/noImage.png')
            }
        } catch (e) {
            next(e);
        }
    }
    async getLogo(req, res, next) {
        try {
            let file = __dirname + '/../uploadsLogo/' + req.params.file;
            if(fs.existsSync(file)){
                res.download(file)
            }else{
                res.download(__dirname + '/../serviceImage/noImage.png')
            }
        } catch (e) {
            next(e);
        }
    }

    async download(req, res, next) {
        try {
            let file = __dirname + '/../uploads/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    async getStatic(req, res, next) {
        try {
            let file = __dirname + '/../static/' + req.params.path + "/" + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    async getStatusFile(req, res, next) {
        try {
            let file = __dirname + '/../uploadsStatus/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    async getStatusAskFile(req, res, next) {
        try {
            let file = __dirname + '/../uploadsStatusAsk/' + req.params.file;
            res.download(file);
        } catch (e) {
            next(e);
        }
    }

    async deleteFile(req, res, next) {
        try {
            const result = await loadService.deleteFile(req);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    
    async upLoadChatFile(req, res, next) {
        try {
            const result = await loadService.upLoadChatFile(req);
            return res.json(result)
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
                await fs.createReadStream('C:/Users/John/Documents/Base1.csv')
                    .pipe(parse({delimiter: ';',headers : true}))
                    .on('data', await async function(csvrow) {
                         let item = {
                                NameOrg: csvrow[0],
                                INN: csvrow[1],
                                KPP: csvrow[2],
                                Address: csvrow[3],
                                Surname: csvrow[4],
                                Name: csvrow[5],
                                Patron: csvrow[6],
                                Category:csvrow[7],
                                Telefon: csvrow[8],
                                email:csvrow[9],
                                Debt: csvrow[10],
                                Price: csvrow[11],
                                OKPO: csvrow[12],
                                Site: csvrow[13] 
                        }    
                        console.log(item);
                        var result = await OrgModel.create(item)
                    })
                    .on('end',function() {
                    //do something with csvData
                    console.log("end");
                    });
        } catch (e) {
            next(e);
        }
    }


}


module.exports = new UploadController();