import nodemailer, {Transporter} from "nodemailer";



export interface MailInterface {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

export default class MailService {
    private readonly transporter: nodemailer.Transport

   constructor(){
    this.transporter
   }

   public sendMail()
}