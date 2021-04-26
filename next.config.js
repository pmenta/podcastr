const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    sw: '/sw.js'
  }
})