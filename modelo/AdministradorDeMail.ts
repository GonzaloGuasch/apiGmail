import {getGmailClient} from "../gmail-tools/send-mail-example/gmailClient";

export class AdministradorDeMail{

    private gmailClient: any;

    constructor() {
        this.gmailClient = getGmailClient();
    }

    crearMailCon(subject: string, email: string, message: string, from: string){

        const mailParts = [
            `From: ${from}`,
            `To: ${email}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            `${message}`,
        ];

        const mail = mailParts.join('\n');
        const encodedMessage = Buffer.from(mail)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return encodedMessage;
     }
    mandarMail(email: string, subject: string, message: string, from: string) {
        this.gmailClient.users.messages.send(
            {
                userId: 'gmailClient',
                requestBody: {
                    raw: this.crearMailCon(subject, email, message, from),
                },
            }
        );
    }
}
