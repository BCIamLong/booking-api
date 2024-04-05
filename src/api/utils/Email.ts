import { TransportOptions, createTransport } from 'nodemailer'
import { convert } from 'html-to-text'
import { emailConfig } from '~/config'
import { IGuest, IUser } from '../interfaces'

const {
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  welcomeEmailTemplate,
  resetPasswordEmailTemplate
} = emailConfig

export default class Email {
  public firstName: string

  constructor(
    public user: IGuest & IUser,
    public url: string
  ) {
    this.firstName = this.user?.fullName?.split(' ')[0] || this.user?.name?.split(' ')[0]
  }

  sendResetPwdMail() {
    const subject = `Reset Your Password - Booking App (valid in 3 minutes)`
    const html = this.getTemplate(resetPasswordEmailTemplate)

    this.sendEmail(html, subject)
  }

  sendWelcomeMail() {
    const subject = 'Welcome to booking app'
    const html = this.getTemplate(welcomeEmailTemplate)

    this.sendEmail(html, subject)
  }

  getTemplate(template: string) {
    let html = template
    html = html.replace('%FIRST_NAME%', this.firstName)
    html = html.replace('%URL_REDIRECT%', this.url)

    return html
  }

  // getTemplate({ content, btnCTA, footer }: { content: string; btnCTA: string; footer: string }) {
  //   let html = this.htmlEmailTemplate
  //   html = html.replace('%CONTENT_BODY%', content)
  //   html = html.replace('%BTN_CTA%', btnCTA)
  //   html = html.replace('%FOOTER_CONTENT%', footer)
  //   return html
  // }

  async sendEmail(template: string, subject: string) {
    const emailOptions = {
      from: EMAIL_FROM,
      to: this.user.email,
      subject,
      text: convert(template, { wordwrap: 120 }),
      html: template
    }

    await this.newTransporter().sendMail(emailOptions)
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production')
      return createTransport<TransportOptions>({
        //@ts-ignore
        service: 'gmail',
        secure: true,
        auth: {
          user: EMAIL_USERNAME,
          pass: EMAIL_PASSWORD
        }
      })

    return createTransport<TransportOptions>({
      //@ts-ignore
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }
    })
  }
}
