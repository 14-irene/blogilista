require('dotenv').config()

const info = (...p) => { if (process.env.NODE_ENV !== 'test') { console.log(...p) } }
const error = (...e) => { if (process.env.NODE_ENV !== 'test') { console.error(...e) } }

module.exports = { info, error }
