const express = require('express');
const errUtils = require('../utils/errorutils');
const errors = require('../errors/errors');
const userservice = require('../services/userservice');

const router = express.Router();

function validateUserObj(user) {
    return user.email && user.email.match(/.+@.+/)
        && user.username && user.password;
}

router.post('/register', async function (req, res) {
    const userData = req.body;

    if (!validateUserObj(userData)) {
        errUtils.respondWithError(res, 'Invalid body', 400);
        return;
    }

    userservice.register(userData).then(user => {
        res.json(user);
    }, err => {
        errUtils.respondWithError(res, err);
    });
});

router.post('/login', async function (req, res) {
    userservice.login(req.body).then(token => {
        res.json(token);
    }, err => {
        let statusCode = 500;
        if (err instanceof errors.AppError) {
            statusCode = err.getStatusCode();
        }
        errUtils.respondWithError(res, err, statusCode);
    });
});

module.exports = router;
