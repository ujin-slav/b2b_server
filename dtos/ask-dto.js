module.exports = class AskDto {
    Client;
    Name;
    Status;
    Price;
    FIO;
    Telefon;
    DeliveryTime;
    DeliveryAddress;
    TermsPayments;
    EndDateOffers;
    Comment;
    TextAsk;

    constructor(model){
        this.id = model._id;
        this.Client = model.Client,
        this.Name = model.Name,
        this.Status = model.Status,
        this.Price = model.Price,
        this.FIO = model.FIO,
        this.Telefon = model.Telefon,
        this.DeliveryTime = model.DeliveryTime,
        this.DeliveryAddress = model.DeliveryAddress,
        this.TermsPayments = model.TermsPayments,
        this.EndDateOffers = model.EndDateOffers,
        this.Comment = model.Comment,
        this.TextAsk = model.TextAsk
    }
}