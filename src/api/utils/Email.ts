import { TransportOptions, createTransport } from 'nodemailer'
import { convert } from 'html-to-text'
import { emailConfig } from '~/config'
import { IGuest } from '../interfaces'

const { EMAIL_FROM, EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, emailTemplate } = emailConfig
export default class Email {
  public firstName: string

  constructor(
    public user: IGuest,
    public url: string
  ) {
    this.firstName = this.user.fullName.split(' ')[0]
  }

  async sendWelcomeMail() {
    const content = ` <p>
    Welcome to booking app. We're thrilled to have you join our community of users who value convenience
    and seamless booking experiences.
  </p>
  <p>
    With booking app, you can easily discover and book a wide range of services, whether it's scheduling
    appointments, reserving tables, or securing tickets for events – all from the comfort of your
    fingertips.
  </p>
  <p>Let's click here to verify your account and get start </p>`
    const footer = `<p>
  We're here to make your life easier, so if you have any questions or need assistance at any point,
  don't hesitate to reach out to our friendly support team.
</p>
<p>Once again, welcome aboard, and thank you for choosing booking app</p>`
    const btnCTA = `Verify to start`
    let html = emailTemplate
    html = emailTemplate.replace('%FIRST_NAME%', this.firstName)
    html = html.replace('%URL_REDIRECT%', this.url)
    html = html.replace('%CONTENT_BODY%', content)
    html = html.replace('%BTN_CTA%', btnCTA)
    html = html.replace('%FOOTER_CONTENT%', footer)

    this.sendEmail(html, 'Welcome to booking app')
  }

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
