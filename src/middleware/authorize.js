function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.redirect('/error?message=No+autenticado');
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.redirect('/error?message=No+autorizado');
        }

        next();
    };
}

module.exports = authorize;
