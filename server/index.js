process.env.NODE_ENV = 'production'

require('egg').startCluster({
  // If you need https, please cancel the comment and configure the certificate file
  // https: true,
  // key: '{{key_file}}',
  // cert: '{{crt_file}}',
  baseDir: __dirname,
  workers: 4,
  port: process.env.PORT || 7001 // default to 7001
})
