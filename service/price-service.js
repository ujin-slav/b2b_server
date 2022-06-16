const xlsx = require("xlsx");
const fs = require("fs");

class PriceService {

    async addPrice(req) {
        const {userID,filename} = req.body
        const workbook = xlsx.readFile('./tempFile/' + req.filename);
        const sheetNames = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
        data.map((item)=>{item})
        fs.unlink('./tempFile/' + req.filename, (err) => {
            if (err) throw err;
            console.log('Deleted');
        });
        return {result:data}
    }


}

module.exports = new PriceService()