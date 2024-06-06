import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { configDotenv } from 'dotenv';
import { SendMailDto } from './dto/sendmail.dto';
configDotenv();

@Injectable()
export class SendmailService {
  async sendmail(sendMail: SendMailDto): Promise<string> {
    const env = process.env;
    const transporter = createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: env.SMTP_USER,
      to: sendMail.sendTo,
      subject: sendMail.subject,
      html: sendMail.content,
    };

    try {
      const res = await transporter.sendMail(mailOptions);
      return res.response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
