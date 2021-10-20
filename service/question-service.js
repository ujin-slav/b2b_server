const QuestModel = require("../models/question-model")

class QuestService {

    async addQuest(req) {
        const {Host,
        Destination,
        Author,
        Text,
        Ask} = req.body

        console.log(req.body);
        // const question = QuestModel.create
        //      ({Host,
        //     Destination,
        //     Author,
        //     Text,
        //     Ask});
        //return question;
    }

    

}

module.exports = new QuestService()