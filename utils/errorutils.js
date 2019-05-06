module.exports = {
    respondWithError: function (res, msg, status = 400) {
        res.status(status);
        res.json({error: msg});
    }
};