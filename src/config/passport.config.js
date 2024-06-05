const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../dao/models/user-mongoose.js");
const Cart = require("../dao/models/carts-mongoose");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const logger = require("./logger.js");

const GitHubStrategy = require("passport-github2").Strategy;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;

        if (/\d/.test(first_name) || /\d/.test(last_name)) {
          return done(
            null,
            false,
            req.flash("error", "Nombre o Apellido no deben contener números."),
            logger.debug(
              "Registro fallido: Nombre o Apellido contienen números."
            )
          );
        }

        if (parseInt(age) < 18) {
          return done(
            null,
            false,
            req.flash("error", "Debe ser mayor de 18 años para registrarse."),
            logger.debug("Registro fallido: Usuario menor de 18 años.")
          );
        }

        if (!password.match(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)) {
          return done(
            null,
            false,
            req.flash(
              "error",
              "La contraseña debe tener al menos 8 caracteres con letras y números."
            ),
            logger.debug(
              "Registro fallido: Contraseña no cumple con los requisitos."
            )
          );
        }

        if (!username.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
          return done(
            null,
            false,
            req.flash("error", "El email ingresado no es válido."),
            logger.debug("Registro fallido: Email no válido.")
          );
        }

        try {
          let user = await UserModel.findOne({ email: username });
          if (user) {
            return done(
              null,
              false,
              req.flash("error", "El email ya está registrado..."),
              logger.debug(`Registro fallido: Email ${ username } ya registrado.`)
            );
          }
          let newUser = {
            first_name,
            last_name,
            email: username,
            age,
            role: "user",
            password: createHash(password),
          };
          newUser = await UserModel.create(newUser);
          const newCart = await Cart.create({ user: newUser._id });
          newUser.cart = newCart._id;
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(
            null,
            false,
            req.flash("error", "Error al crear el usuario..."),
            logger.error(`Error al crear el usuario ${ email }`)
          );
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, req.flash("error"),
            logger.debug("Login fallido: usuario no encontrado.")
          );
          }
          if (!isValidPassword(password, user)) {
            return done(null, false, req.flash("error"),
            logger.debug("Login fallido: contraseña incorrecta.")
          );
          }
          let cart = await Cart.findOne({ user: user._id });
          if (!cart) {
            cart = await Cart.create({ user: user._id });
          }
          user.cart = cart._id;
          await user.save();
          return done(null, user);
        } catch (error) {
          return done(null, false, req.flash("error"),
          logger.debug("Error al crear carrito desde login.")
        );
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.id });

          if (!user) {
            let newUser = {
              first_name: profile._json.login,
              last_name: "",
              age: null,
              email: profile._json.id,
              role: "user",
              password: "",
            };
            user = await UserModel.create(newUser);
            const newCart = await Cart.create({ user: user._id });
            user.cart = newCart._id;
            await user.save();
            done(null, user);
          } else {
            let cart = await Cart.findOne({ user: user._id });
            if (!cart) {
              cart = await Cart.create({ user: user._id });
            }
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const GoogleStrategy = require("passport-google-oauth20").Strategy;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile.id });

          if (!user) {
            const newUser = new UserModel({
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              age: null,
              email: profile.id,
              role: "user",
              password: "",
            });

            user = await newUser.save();
            const newCart = await Cart.create({ user: user._id });
            user.cart = newCart._id;
            await user.save();
          } else {
            let cart = await Cart.findOne({ user: user._id });
            if (!cart) {
              cart = await Cart.create({ user: user._id });
            }
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
