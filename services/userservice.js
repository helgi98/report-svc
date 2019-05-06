const db = require('../utils/dbutils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/errors').NotFoundError;
const AuthenticationError = require('../errors/errors').AuthenticationError;
const ValidationError = require('../errors/errors').ValidationError;

const AUTH_SECRET = "GIT GUD";

function mapDbUser(dbuser) {
    return {
        id: dbuser.id,
        email: dbuser.email,
        username: dbuser.username,
        passHash: dbuser.pass_hash,
    }
}

module.exports = {
    authenticateRequest: function(auth) {

    },
    findUser: function (username) {
        return db.query('SELECT * FROM user_info where username = $1', [username])
            .then(({rows}) => {
                if (rows.length > 0) {
                    return mapDbUser(rows[0]);
                }

                return Promise.reject(new NotFoundError(`User ${username} not found`))
            });
    },
    login: function (loginData) {
        return this.findUser(loginData.username)
            .then(user => {
                if (user.passHash === db.hash(loginData.password)) {
                    return user
                }

                return Promise.reject(new AuthenticationError("Invalid credentials"));
            })
            .then(user => {
                const token = jwt.sign({ id: user.username }, AUTH_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                return {token};
            });
    },
    register: function (user) {
        return db.query('SELECT COUNT(1) FROM user_info WHERE email = $1 OR username = $2',
            [user.email, user.username])
            .then(({rows}) => {
                if (rows[0].count > 0) {
                    return Promise.reject(new ValidationError("User is already registered"));
                }

                return db.query('INSERT INTO USER_INFO (EMAIL, USERNAME, PASS_HASH) VALUES ($1, $2, $3)',
                    [user.email, user.username, db.hash(user.password)])
            })
            .then(() => {
                return user;
            });
    }
};