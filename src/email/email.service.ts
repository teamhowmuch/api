import { Injectable, Logger } from '@nestjs/common'
import { Client } from '@sendgrid/client'
import sg from '@sendgrid/mail'
import { AnyObject } from 'src/entities/User'
import { EmailTemplate, EMAIL_TEMPLATES } from './templates'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)

  constructor() {
    sg.setClient(new Client())
    sg.setApiKey(process.env.SENDGRID_API_KEY)
  }

  async sendOtp(email: string, otp: string) {
    const mail: sg.MailDataRequired = {
      from: 'hello@grobot.nl',
      to: email,
      templateId: EMAIL_TEMPLATES.otp,
      dynamicTemplateData: { otp },
    }
    try {
      await sg.send(mail)
    } catch (error) {
      this.logger.error('Error sending Sendgrid email')
      this.logger.error(error.response?.body)
      throw error
    }
    return
  }

  async sendChangeEmailOtp(email: string, otp: string) {
    const mail: sg.MailDataRequired = {
      from: 'hello@grobot.nl',
      to: email,
      templateId: EMAIL_TEMPLATES.changeEmail,
      dynamicTemplateData: { otp },
    }
    try {
      await sg.send(mail)
    } catch (error) {
      this.logger.log('Error sending Sendgrid email')
      this.logger.error(error.response?.body)
      throw error
    }
    return
  }

  async sendEmail(to: string, template: EmailTemplate, data: AnyObject) {
    const mail: sg.MailDataRequired = {
      from: 'hello@howmuch.how',
      to,
      templateId: EMAIL_TEMPLATES[template],
      dynamicTemplateData: data,
    }
    try {
      await sg.send(mail)
    } catch (error) {
      this.logger.error('Error sending Sendgrid email')
      this.logger.error(error.response?.body)
      throw error
    }
  }
}
