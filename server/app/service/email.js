module.exports = app => {
  const nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport(app.config.transporter)
  class Email extends app.Service {
    sent (to, subject, html) {
      const { auth, appName } = this.config.transporter
      const mailOptions = {
        from: `${appName} <${auth.user}>`,
        to,
        subject,
        html
      }
      return transporter.sendMail(mailOptions).catch(error => {
        this.ctx.logger.info('Message %s sent error: %s', error)
        return error
      })
    }
    resetPassword (verifyCode, user) {
      const html = `
        <strong>Reset Password</strong>
        <p>Account Name: ${user.name}</p>
        <p>Verification Code: ${verifyCode}</p>
      `
      return this.sent(user.email, 'Reset Password', html)
    }
    passwordTicket (ticket, user) {
      const html = `
        <strong>Retrieve Password</strong>
        <p>Account Name: ${user.name}</p>
        <p>Link：${app.config.clientRoot}/#/reset-pass?ticket=${ticket}</p>
      `
      return this.sent(user.email, 'Retrieve Password', html)
    }
    notifyApiChange (api, users) {
      const html = `
        <strong>API：${api.name}</strong>
        <p>Modifier：${this.ctx.authUser.name}</p>
        <p>Link Address：${app.config.clientRoot}/#/doc/${api.group}/${api._id}</p>
      `
      users.map(user => {
        this.sent(user.email, 'Notify change reminder', html)
      })
    }
  }
  return Email
}
