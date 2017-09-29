const Crypto = require('crypto')
module.exports = app => {
  class Ticket extends app.Service {
    create (id, act, maxAge = 15 * 60 * 1000) {
      const Cipher = Crypto.createCipher('aes192', 'a password')
      const ticket = JSON.stringify({
        id,
        act,
        maxAge,
        date: new Date()
      })
      return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
    }
    check (ticket, act, id, modifiedTime) {
      const Decipher = Crypto.createDecipher('aes192', 'a password')
      let rs
      try {
        rs = Decipher.update(ticket, 'hex', 'utf8') + Decipher.final('utf8')
        rs = JSON.parse(rs)
      } catch (err) {
        return { success: false, msg: 'Ticket unknown' }
      }
      const expires = +new Date(rs.date) + rs.maxAge
      if (expires < Date.now()) {
        return { success: false, msg: 'Ticket expired' }
      }
      if (act !== rs.act) {
        return { success: false, msg: 'Ticket error' }
      }
      if (id && id !== rs.id) {
        return { success: false, msg: 'Ticket is wrong' }
      }
      if (modifiedTime && modifiedTime > new Date(rs.date)) {
        return { success: false, msg: 'Ticket failed' }
      }
      return { success: true, data: rs }
    }
  }
  return Ticket
}
