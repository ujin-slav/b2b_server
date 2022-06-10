module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.nameOrg = model.nameOrg;
        this.adressOrg = model.adressOrg;
        this.fiz = model.fiz;
        this.telefon = model.telefon;
        this.inn = model.inn;
        this.region = model.region;
        this.category = model.category;
        this.notiInvited = model.notiInvited;
        this.notiMessage = model.notiMessage;
        this.notiQuest = model.notiQuest;
    }
}