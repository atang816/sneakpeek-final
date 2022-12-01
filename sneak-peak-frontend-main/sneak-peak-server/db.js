const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "admin",
    database: "sneak_peek_db"
});

module.exports = pool;