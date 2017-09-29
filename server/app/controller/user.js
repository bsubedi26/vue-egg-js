const md5 = require('blueimp-md5')
module.exports = app => {
  class UserController extends app.Controller {
    * search () {
      const { query = '' } = this.ctx.query
      const users = yield this.service.user.find(query).lean()
      this.success(users.map(u => {
        delete u.password
        return u
      }))
    }
    * sentResetPassCode () {
      const { email } = this.ctx.request.body
      const user = yield this.service.user.getByEmail(email)
      if (!user) {
        this.error('The provided user is not registered.')
      }
      const key = 'password_' + user._id
      const hasCode = this.service.cache.has(key)
      if (hasCode) {
        this.error('Do not send it repeatedly.')
      }
      const code = this.service.cache.verifyCodeCache(key, 6)
      const rs = yield this.service.email.resetPassword(code, user)
      if (rs && rs.messageId) {
        this.success(true)
      } else {
        this.error('Send verification code failed, please try again.')
      }
    }
    * sentResetPassTicket () {
      const { email } = this.ctx.request.body
      const user = yield this.service.user.getByEmail(email)
      if (!user) {
        this.error('The provided user is not registered.')
      }
      const ticket = this.service.ticket.create(user._id, 'password')
      const rs = yield this.service.email.passwordTicket(ticket, user)
      if (rs && rs.messageId) {
        this.success(true)
      } else {
        this.error('Sending mail failed, please try again.')
      }
    }
    * resetPasswordByTicket () {
      const { email, password, ticket } = this.ctx.request.body
      const user = yield this.service.user.getByEmail(email)
      if (!user) {
        this.error('The provided user is not registered.')
      }
      const encode = this.service.ticket.check(ticket, 'password', user._id.toString(), user.modifiedTime)
      if (!encode.success) {
        this.error(encode.msg)
      }
      const rs = yield this.service.user.updatePassword(email, password)
      if (!rs) {
        this.error('Failed to modify.', 500)
      }
      this.success(true)
    }
    * resetPassword () {
      const { email, password, verifyCode } = this.ctx.request.body
      const user = yield this.service.user.getByEmail(email)
      if (!user) {
        this.error('The provided user is not registered.')
      }
      const key = 'password_' + user._id
      const correctCode = this.service.cache.get(key)
      if (correctCode !== verifyCode) {
        this.ctx.logger.info('verifyCode error', `correctCode: ${correctCode}，verifyCode: ${verifyCode}`)
        this.error('Verification code error.')
      }
      const rs = yield this.service.user.updatePassword(email, password)
      if (!rs) {
        this.error('Failed to edit.', 500)
      }
      this.service.cache.del(key)
      this.success(true)
    }
    * get () {
      const rs = this.service.cookie.getUser()
      if (!rs || !rs._id) {
        this.error({
          code: 401,
          msg: 'Not logged in.'
        })
      }
      const user = yield this.service.user.getById(rs._id)
      if (!user || user.modifiedTime > new Date(rs.modifiedTime)) {
        this.error({
          code: 401,
          msg: 'The information has changed. Please log in again'
        })
      }
      this.success(rs)
    }
    * create () {
      const info = this.ctx.request.body
      const user = yield this.service.user.getByEmail(info.email)
      if (user) {
        this.error('The provided user has already been registered.')
      }
      const rs = yield this.service.user.create(info)
      delete rs.password
      this.service.cookie.setUser(rs)
      this.success(rs)
    }
    * login () {
      const info = this.ctx.request.body
      const user = yield this.service.user.getByEmail(info.email)
      if (!user) {
        this.error('The provided user is not registered.')
      }
      if (user.password !== md5(info.password, this.config.md5Key)) {
        this.error('Invalid Credentials: Incorrect password.')
      }
      delete user.password
      this.service.cookie.setUser(user)
      this.success(user)
    }
    * update () {
      const user = this.ctx.request.body
      const rs = yield this.service.user.update(user)
      if (!rs) {
        this.error({
          code: 500,
          msg: 'Failed to edit.'
        })
      }
      delete rs.password
      this.service.cookie.setUser(rs)
      this.success(rs)
    }
    * updatePassword () {
      const { originPassword, password, verifyPassword } = this.ctx.request.body
      if (originPassword.trim() === '' || password.trim() === '' || verifyPassword.trim() === '') {
        this.error('The information can not be empty.')
      }
      if (password !== verifyPassword) {
        this.error('Confirm password does not match.')
      }
      console.log(this.ctx.request.body)
      const rs = yield this.service.user.updatePasswordByOldPassword(originPassword, password)
      if (!rs) {
        this.error('Invalid Credentials: Incorrect password.')
      }
      delete rs.password
      this.service.cookie.setUser(rs)
      this.success(rs)
    }
    logout () {
      console.log('*******LOGOUT*******')
      console.log('cookie.getUser() ', this.service.cookie.getUser())
      console.log('*******ctx*******')
      console.log(this.ctx)
      console.log('*******ctx.keys*******')
      console.log(Object.keys(this.ctx))
      this.service.cookie.clearUser()
      this.success('Logout Success.')
    }
  }
  return UserController
}
