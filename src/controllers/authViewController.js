const crypto = require('crypto');
const Token = require('../dao/models/token-mongoose');

exports.showLogin = (req, res) => {
    const messages = req.flash();
    res.render('login', { messages, user: req.session.user || null });
};

exports.showRegister = (req, res) => {
    const messages = req.flash();
    res.render('register', { messages, user: req.session.user || null });
};

exports.showProfile = (req, res) => {
    res.render('profile', { user: req.session.user });
};

exports.showForgotPassword = (req, res) => {
    const messages = req.flash();
    res.render('forgot-password', { messages, user: req.session.user || null });
};

exports.showResetPasswordForm = async (req, res) => {
    const { token } = req.params;
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await Token.findOne({ token: hash });
    if (!resetToken) {
        req.flash('error', 'Token inválido o ha expirado.');
        return res.redirect('/forgot-password');
    }
    const messages = req.flash();
    res.render('reset-password', { token, messages, user: req.session.user || null  });
};