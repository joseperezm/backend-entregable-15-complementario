function redirectIfLoggedInApi(req, res, next) {
    if (req.session.user) {
        res.redirect('/api/products');
    } else {
        next();
    }
}

module.exports = redirectIfLoggedInApi;