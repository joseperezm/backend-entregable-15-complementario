const passport = require('passport');
const createUserDto = require('../dto/userDto');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../dao/models/token-mongoose');
const UserModel = require('../dao/models/user-mongoose');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    },
    pool: true,
    rateLimit: 1,
    maxConnections: 1,
    maxMessages: 10
});

exports.requestResetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        req.flash('error', 'No existe una cuenta con ese correo.');
        return res.redirect('/forgot-password');
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save();

    const link = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await transport.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `<h4>Hola ${user.first_name}</h4>
               <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
               <a href="${link}">Restablecer Contraseña</a>
               <p>Este enlace expira en 1 hora.</p>`
    });

    req.flash('success', 'Correo de restablecimiento enviado.');
    res.redirect('/login');
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await Token.findOne({ token: hash });
    if (!resetToken) {
        req.flash('error', 'Token inválido o ha expirado.');
        return res.redirect('/forgot-password');
    }

    const user = await UserModel.findById(resetToken.userId);
    if (!user) {
        req.flash('error', 'Usuario no encontrado.');
        return res.redirect('/forgot-password');
    }

    if (isValidPassword(password, user)) {
        req.flash('error', 'No puedes usar la misma contraseña.');
        return res.redirect(`/reset-password/${token}`);
    }

    user.password = createHash(password);
    await user.save();
    await resetToken.deleteOne();

    req.flash('success', 'Contraseña restablecida exitosamente.');
    res.redirect('/login');
};

exports.registrationInstructions = (req, res) => {
    const registrationInstructions = {
        Status: "Not logged in...",
        steps: [
            "Open Postman or your preferred HTTP client.",
            "Set the request method to POST.",
            "Set the request URL to the endpoint for registration. For example, 'http://localhost:8080/api/sessions/register' if you are running your server locally.",
            "Go to the 'Headers' tab and add a header with key 'Content-Type' and value 'application/json'.",
            "Go to the 'Body' tab, select 'raw', and then select 'JSON' from the dropdown menu.",
            "Enter your registration details in JSON format. For example: {\"first_name\": \"John\", \"last_name\": \"Doe\", \"email\": \"johndoe@example.com\", \"age\": 30, \"password\": \"your_password\"}.",
            "Send the request.",
            "If the registration is successful, you should be redirected to the login page or receive a success message. You can now log in with the credentials you registered."
        ],
        note: "Replace the example details with your actual registration information."
    };

    res.json(registrationInstructions);
};

exports.register = (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {

        if (err) { return next(err); }

        if (!user) {
            return res.redirect('/register');
        }

        req.logIn(user, async (err) => {
            if (err) { return next(err); }

            req.flash('success', `¡Registro exitoso para ${user.email}!`);
            res.redirect('/login');
        });
    })(req, res, next);
};

exports.loginInstructions = (req, res) => {
    const loginInstructions = {
        Status: "Not logged in...",
        steps: [
            "Open Postman or your preferred HTTP client.",
            "Set the request method to POST.",
            "Set the request URL to the endpoint for logging in. For example, 'http://localhost:8080/api/sessions/login' if you are running your server locally.",
            "Go to the 'Headers' tab and add a header with key 'Content-Type' and value 'application/json'.",
            "Go to the 'Body' tab, select 'raw', and then select 'JSON' from the dropdown menu.",
            "Enter your login credentials in JSON format. Example: {\"email\": \"your_email@example.com\", \"password\": \"your_password\"}.",
            "Send the request.",
            "If login is successful, you should receive a response including a session cookie. Use this cookie for subsequent requests to authenticated routes."
        ],
        note: "If not registered visit 'http://localhost:8080/api/sessions/register'"
    };

    res.json(loginInstructions);
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const user = {
            email,
            first_name: 'Admin',
            last_name: 'CoderHouse',
            age: '9999',
            role: 'admin'
        };    
        req.session.user = user;    
        const userName = `${user.first_name} ${user.last_name}`;
        logger.info(`Inicio de sesión local para usuario: ${userName}`);
        req.flash('success', `¡Inicio de sesión exitoso para: ${userName}!`);
        return res.redirect('/products');
    }    

    passport.authenticate('login', (err, user, info) => {
        if (err) {
            logger.error('Error al iniciar sesión:', err);
            req.flash('error', 'Error al iniciar sesión...');
            return next(err);
        }
        if (!user) {
            logger.warn(`Intento de inicio de sesión fallido para: ${email}`);
            req.flash('error', 'Usuario o contraseña incorrectos...');
            return res.redirect('/login'); 
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.error('Error al iniciar sesión:', err);
                req.flash('error', 'Error al iniciar sesión...');
                return next(err);
            }
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role
            };
            const userName = `${user.first_name} ${user.last_name}`;
            logger.info(`Inicio de sesión local para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión exitoso para: ${userName}!`);
            return res.redirect('/products');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    const userName = req.user ? `${req.user.first_name} ${req.user.last_name}` : 'Desconocido';

    req.logout(function(err) {
        if (err) {
            logger.error('Error al cerrar sesión:', err);
            req.flash('error', 'Error al cerrar sesión...');
            return res.redirect('/profile');
        }

        req.session.destroy((err) => {
            if (err) {
                logger.error('Error al destruir la sesión:', err);
                req.flash('error', 'Error al destruir sesión...');
                return res.redirect('/profile');
            }            
            res.clearCookie('connect.sid', { path: '/' });
            logger.info(`Cierre de sesión exitoso para el usuario: ${userName}`);            
            res.redirect('/login');
        });
    });
};

exports.githubAuth = passport.authenticate("github", { scope: ["user:email"] });

exports.githubCallback = (req, res, next) => {
    passport.authenticate("github", { failureRedirect: "/login" }, (err, user, info) => {
        if (err) {
            logger.error(`Error durante la autenticación con GitHub: ${err}`);
            return next(err);
        }
        if (!user) {
            logger.warn("Inicio de sesión fallido con GitHub: No se pudo obtener el usuario.");
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.error(`Error al iniciar sesión después de la autenticación con GitHub: ${err}`);
                return next(err);
            }
            
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido';
            
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: 'GitHub ID: ' + user.email,
                age: user.age,
                role: user.role
            };
            req.session.login = true;
            
            logger.info(`Inicio de sesión desde GitHub para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión con GitHub exitoso para: ${userName}!`);
            res.redirect("/products");
        });
    })(req, res, next);
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/login" }, (err, user, info) => {
        if (err) {
            logger.error(`Error durante la autenticación con Google: ${err}`);
            return next(err);
        }
        if (!user) {
            logger.warn("Inicio de sesión fallido con Google: No se pudo obtener el usuario.");
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.error(`Error al iniciar sesión después de la autenticación con Google: ${err}`);
                return next(err);
            }
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido';
            
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: 'Google ID: ' + user.email,
                age: user.age,
                role: user.role
            };
            req.session.login = true;

            logger.info(`Inicio de sesión desde Google para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión con Google exitoso para: ${userName}!`);
            res.redirect("/products");
        });
    })(req, res, next);
};

exports.currentSession = (req, res) => {
    if (req.user) {
        const userDto = createUserDto(req.user);

        res.json({
            success: true,
            user: userDto
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'No hay un usuario logueado.'
        });
    }
};