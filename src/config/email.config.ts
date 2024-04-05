import fs from 'fs'

// console.log(emailTemplate)
// const emailTemplate = fs.readFileSync('src/public/templates/email.template.html', 'utf-8')
const welcomeEmailTemplate = fs.readFileSync('src/public/templates/email/welcome.template.html', 'utf-8')
const resetPasswordEmailTemplate = fs.readFileSync('src/public/templates/email/resetPassword.template.html', 'utf-8')

export default {
  EMAIL_HOST: process.env.NODE_ENV === 'development' ? process.env.EMAIL_HOST_DEV : process.env.EMAIL_HOST,
  EMAIL_USERNAME: process.env.NODE_ENV === 'development' ? process.env.EMAIL_USERNAME_DEV : process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.NODE_ENV === 'development' ? process.env.EMAIL_PASSWORD_DEV : process.env.EMAIL_PASSWORD,
  EMAIL_PORT: process.env.NODE_ENV === 'development' ? process.env.EMAIL_PORT_DEV : process.env.EMAIL_PORT,
  EMAIL_FROM: process.env.EMAIL_FROM,
  welcomeEmailTemplate,
  resetPasswordEmailTemplate
}
