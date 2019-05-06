const {Pool} = require('pg');
const crypto = require('crypto');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/ReportSvc?username=postgres&password=password';

const pool = new Pool({
    connectionString: connectionString
});

module.exports = {
    query: function (text, params) {
        return new Promise((resolve, reject) => {
            pool.query(text, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    },
    hash: function (str) {
        return crypto.createHash('sha256')
            .update(str)
            .digest('hex');
    }
};