const nodemailer = require('nodemailer')

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

    async sendInvited(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Приглашение на участие в закупке',
            html:
                `
                <html>
                <head>
                </head>
                <body>
                <table style="text-align: left; width: 100%; height: 333px;"
                cellspacing="0">
                <tbody>
                <tr>
                <td
                style="vertical-align: top; background-color: black; text-align: center;"
                width="20%">
                <div style="text-align: left;"> </div>
                <div style="color: white; font-family: American Retro;">
                <div style="text-align: center;"><img
                style="width: 178px; height: 183px;" alt=""
                src="file:///C:/Users/John/Desktop/b2blogo.png"><br>
                </div>
                Менеджер
                заявок, подробнее узать о
                сервисе вы можете перейдя по ссылке: </div>
                </td>
                <td style="vertical-align: top;"><br>
                </td>
                </tr>
                </tbody>
                </table>
                <br>
                <br>
                </body>
                </html>
                
                `
        })
    }
}

module.exports = new MailService()