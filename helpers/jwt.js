var httpContext = require('express-http-context');
var jwt = require('jsonwebtoken');
const { Utilisateur, Token } = require('../models')
const configuration = require('../config/config')
// const redis_client = require('../config/redis');
const Errors = require('../helpers/errors');
const UserService = require('../services/utilisateur');
const Logger = require("winston");

const JWT_SIGN_SECRET = "" + configuration.jwt.jwt_secret;

// Exported functions
module.exports = {
  generateTokenForUser: async function (_token) {
    try {
      var token = module.exports.parseAuthorization(_token);
      if (token == null) throw new Errors.InvalidDataError('No value for token')
      const jwtToken = jwt.decode(token);
      let _user = await Utilisateur.findByUid(jwtToken.user_id)
      if (_user) {
        httpContext.set('gUser', _user)

        return jwt.sign({
          userId: _user.id,
          role: _user.role,
          firebaseToken: token,
          userUID: _user.uid,
          login: _user.login
        },

          JWT_SIGN_SECRET,
          {
            expiresIn: '1200h'
          })
      } else {
        let data = {
          nom: jwtToken.login.split('@')[0],
          login: jwtToken.login,
          uid: jwtToken.uid,
          role: "utilisateur"
        }
        try {
          let user = await UserService.inscription(data)

          httpContext.set('gUser', user)

          return jwt.sign({
            userId: user.id,
            role: user.role,
            firebaseToken: token,
            userUID: user.uid,
            login: user.login
          },

            JWT_SIGN_SECRET,
            {
              expiresIn: '1200h'
            })
        } catch (e) {
          console.log(e);
          Logger.error(e)
          throw e
        }
      }
    } catch (error) {
      console.log(error)
      Logger.error(error)
      throw error
    }
  },
  generateTokenForAdmin: async function (nom) {
    try {
      return jwt.sign({
        login: nom,
      },
        JWT_SIGN_SECRET,
        {
          expiresIn: '1200h'
        })
    } catch (error) {
      console.log(error)
      Logger.error(error)
      throw error
    }
  },
  parseAuthorization: function (authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  // --------------- Get User ID from Token -------------
  getUserId: function (authorization) {
    var user_id = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null)
          user_id = jwtToken.userId;
      } catch (err) { }
    }
    // httpContext.get('gUserID', jwtToken.userId) = user_id
    return user_id;
  },
  // ------------ Verifiy Authentication -------------
  isAuthorized: async function (req, res, next) {
    try {
      // jwt avec authorization
      if (req.headers['authorization']) {
        var auth = req.headers['authorization'];
        var token = module.exports.parseAuthorization(auth);
        if (token == null) return res.status(402).send("Access denied. No token provided.");
        const jwtToken = jwt.decode(token);

        if (jwtToken != null && jwtToken.userId) {
          req.user = {
            id: jwtToken.userId
          }

          if (jwtToken) {
            httpContext.set('token', jwtToken.firebaseToken)
            httpContext.set('gUserIP', req.clientIp)
            httpContext.set('gUserUId', jwtToken.userUID)
            httpContext.set('gUserId', jwtToken.userId)
            httpContext.set('gUserLogin', jwtToken.login)
            next();
          }
          else {
            res.status(402).send("user not found.");
          }
        }
        else {
          res.status(402).send("Token = null");
        }
      }
      // jwt avec token
      else if (req.headers['token']) {
        let user_token = req.headers['token']
        let token = await Token.findOne({ token: user_token })
        if (token && token.statut === "Actif") {
          httpContext.set('token', token)
          httpContext.set('nbr_de_requete', token.nbr_de_requete)
          httpContext.set('nbr_de_reponse', token.nbr_de_reponse)
          httpContext.set('gUserId', token.user_id)
          next();
        } else if (token && token.statut === "Expirer") {
          res.status(402).send("Access denied.your token is expired.");
        } else {
          res.status(402).send("Access denied.your token is not active");
        }
      } else {
        res.status(402).send("Access denied. No token provided.");
      }
    } catch (ex) {
      console.log(ex);
      res.status(402).send("Invalid token.");
    }
  },
  // ------------ Verifiy Authentication -------------
  isAdmin: function (req, res, next) {
    var auth = req.headers['authorization'];
    var token = module.exports.parseAuthorization(auth);
    if (!token) return res.status(402).send("Access denied. No token provided.");
    try {
      const jwtToken = jwt.decode(token);
      if (jwtToken != null)
        if (jwtToken.login != "root") {
          res.status(402).send("Access denied. need more rights.")
        };
      next();
    } catch (ex) {
      res.status(402).send("Invalid token.");
    }
  }
}



