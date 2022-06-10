const nodemailer = require('nodemailer')
const logo = require('../utils/LogoCode')

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
        console.log("Отправлен mail")
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: 'Здравствуйте',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
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
                    <div>
                        <h1>Для установки нового пароля перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async sendInvited(to) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Приглашение на участие в закупке',
            html:
                `
                <div style="display: flex;">
                <div>
                ${logo.logo}
                </div>

                <div style="width:100%;">
                <h3>
                Приглашение на участие в закупке
                </h3>
                <hr style=" border: none; background-color: #a2ebfd; height: 10px">
                </div>
                </div>
                
                `
        })
    }
}

module.exports = new MailService()