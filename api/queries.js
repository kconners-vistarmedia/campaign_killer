const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Password1*',
    port: 5433

})

module.exports = {
    pool,
}