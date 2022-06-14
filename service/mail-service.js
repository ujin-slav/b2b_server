const nodemailer = require('nodemailer')
const logo = require('../utils/LogoCode')
const format = require('date-format');

class MailService {
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: "ujin-slav@yandex.ru",
                pass: "24041987Ujin"
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: 'Здравствуйте',
            html:
                `
                <div style="display: flex;">
                <div>
                ${logo.logo}
                </div>

                <div style="width:100%;">
                <span style="text-align: center;">
                    <h3>Для активации аккаунта перейдите по ссылке</h3>
                </span>    
                <hr style=" border: none; background-color: #a2ebfd; height: 10px">
                        <a href="${link}">${link}</a>
                </div>
                </div>            
                `
        })
    }

    async sendRecoveryMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Восстановление пароля на ' + process.env.API_URL,
            text: 'Здравствуйте',
            html:
                `
                <div style="display: flex;">
                <div>
                ${logo.logo}
                </div>

                <div style="width:100%;">
                <span style="text-align: center;">
                    <h3>Для установки нового пароля перейдите по ссылке.</h3>
                </span>    
                <hr style=" border: none; background-color: #a2ebfd; height: 10px">
                        <a href="${link}">${link}</a>
                </div>
                </div>            
                `
        })
    }

    async sendInvited(to,ask,user) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Приглашение на участие в закупке.',
            html:
                `
                <div style="display: flex;">
                <div>
                ${logo.logo}
                </div>

                <div style="width:100%;">
                <span style="text-align: center;">
                    <h3>Приглашение на участие в закупке.</h3>
                </span>    
                <hr style=" border: none; background-color: #a2ebfd; height: 10px">
                <div style="line-height: 2;">
                    <div><span style="font-weight: bold;">Название: </span>${ask.Name}</div>
                    <div><span style="font-weight: bold;">Автор: </span>${user.name}</div>
                    <div><span style="font-weight: bold;">Организация: </span>${user.nameOrg}</div>
                    <div><span style="font-weight: bold;">Текст: </span>${ask.Text}</div>
                    <div><span style="font-weight: bold;">Дата окончания предложений: </span>${format.asString("dd/MM/yyyy hh:mm:ss",ask.EndDateOffers)}</div>
                    <div><span style="font-weight: bold;">Ссылка: </span>
                        <a href="${process.env.CLIENT_URL}/cardask/${ask.id}">${process.env.CLIENT_URL}/cardask/${ask.id}</a>
                    </div>
                </div>
                </div>
                </div>
                
                `
        })
    }
    async sendMessage(user,data) {
        const to = user.email
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Новое сообщение.',
            html:
                `
                <div style="display: flex;">
                <div>
                ${logo.logo}
                </div>

                <div style="width:100%;">
                <span style="text-align: center;">
                    <h3>Новое непрочитанное сообщение.</h3>
                </span>    
                <hr style=" border: none; background-color: #a2ebfd; height: 10px">
                <div style="line-height: 2;">
                    <div><span style="font-weight: bold;">Автор: </span>${user.name}</div>
                    <div><span style="font-weight: bold;">Текст: </span>${data.Text}</div>
                    <a href="${process.env.CLIENT_URL}/chat">${process.env.CLIENT_URL}/chat</a>
                </div>
                </div>
                </div>
                
                `
        })
    }
}

module.exports = new MailService()