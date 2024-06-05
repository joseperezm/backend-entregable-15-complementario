function redirectIfNotLoggedInApi(req, res, next) {
    if (!req.session.user) {
        res.redirect('/api/sessions/login');
    } else {
        next();
    }
}

module.exports = redirectIfNotLoggedInApi;