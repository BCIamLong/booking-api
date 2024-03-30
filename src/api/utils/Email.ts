import { TransportOptions, createTransport } from 'nodemailer'
import { convert } from 'html-to-text'
import { emailConfig } from '~/config'
import { IGuest } from '../interfaces'

const { EMAIL_FROM, EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, emailTemplate } = emailConfig
export default class Email {
  public firstName: string
  public htmlEmailTemplate: string

  constructor(
    public user: IGuest,
    public url: string
  ) {
    this.firstName = this.user.fullName.split(' ')[0]

    let html = emailTemplate
    html = emailTemplate.replace('%FIRST_NAME%', this.firstName)
    html = html.replace('%URL_REDIRECT%', url)
    this.htmlEmailTemplate = html
  }

  sendResetPwdMail() {
    const content = `<p>We've received a request to reset the password associated with your account at [YourWebsiteName]. To complete this process, please follow the instructions below:</p>
    <p>1. Click the following link as a button bellow to reset your password</p>
    <p>2. Once you're on the password reset page, you'll be prompted to enter a new password. Please choose a strong password that is unique to this account</p>
    <p>3. After setting your new password, you'll be able to log in to your account using your updated credentials</p>`
    const footer = `<p>If you didn't request a password reset, or if you believe this email was sent to you in error, please disregard it. Your account security is important to us, and no changes will be made without your verification.</p>
    <p>Please remember to keep your password secure and don't share it with anyone. If you have any concerns about the security of your account, please contact our support team immediately.</p>
    <p>Thank you for choosing Booking App</p>`
    const btnCTA = `Reset your password`
    const subject = `Reset Your Password - Booking App (valid in 3 minutes)`
    const html = this.getTemplate({ footer, btnCTA, content })

    this.sendEmail(html, subject)
  }

  sendWelcomeMail() {
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
    const html = this.getTemplate({ content, btnCTA, footer })

    this.sendEmail(html, 'Welcome to booking app')
  }

  getTemplate({ content, btnCTA, footer }: { content: string; btnCTA: string; footer: string }) {
    let html = this.htmlEmailTemplate
    html = html.replace('%CONTENT_BODY%', content)
    html = html.replace('%BTN_CTA%', btnCTA)
    html = html.replace('%FOOTER_CONTENT%', footer)
    return html
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
