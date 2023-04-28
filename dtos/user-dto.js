module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isAdmin = model.isAdmin;
        this.name = model.name;
        this.nameOrg = model.nameOrg;
        this.adressOrg = model.adressOrg;
        this.fiz = model.fiz;
        this.telefon = model.telefon;
        this.site = model.site;
        this.inn = model.inn;
        this.logo = model.logo;
        this.region = model.region;
        this.category = model.category;
        this.description = model.description;
        this.notiInvited = model.notiInvited;
        this.notiMessage = model.notiMessage;
        this.notiAsk = model.notiAsk;
        this.getAskFromFiz = model.getAskFromFiz;
    }
}