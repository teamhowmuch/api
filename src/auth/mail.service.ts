import { Injectable, Logger } from '@nestjs/common'
import { Client } from '@sendgrid/client'
import sg from '@sendgrid/mail'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  constructor() {
    sg.setClient(new Client())
    sg.setApiKey(process.env.SENDGRID_API_KEY)
  }

  async sendOtp(email: string, otp: string) {
    const mail: sg.MailDataRequired = {
      from: 'hello@howmuch.how',
      to: email,
      templateId: 'd-1f7ccd35b08a4ae1abf3c0e11cdd62d0',
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
}
