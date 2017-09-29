module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '500kb'
    },
    mongoose: {
      url: 'mongodb://127.0.0.1/api'
    },
    // COOKIE ENCRYPTION KEYS
    keys: `${appInfo.name}_{{cookie_secret_key}}`,
    // PASSWORD ENCRYPTION KEYS
    md5Key: '{{password_secret_key}}',
    // ALLOW CROSS DOMAIN
    cors: {
      credentials: true
    },
    middleware: [ 'auth' ],
    // Mail push interval
    pushInterval: {
      // An api will not be pushed in an hour
      api: 1000 * 60 * 60
    },
    // Send mail configuration
    transporter: {
      appName: 'Api Server',
      host: 'smtp.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: '{{email_address}}',
        pass: '{{email_password}}'
      }
    }
  }
  return config
}
