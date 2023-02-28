const dotenv = require('dotenv');

dotenv.config();

const env = {
    database: {
        db: process.env.DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    logs: {
        console: process.env.LOG_CONSOLE,
        console_level: process.env.LOG_CONSOLE_LEVEL,
        file: process.env.LOG_FILE,
        file_level: process.env.LOG_FILE_LEVEL,
        file_path: process.env.LOG_FILE_PATH,
        knex: process.env.LOG_KNEX
    },
    jwt: {
        jwt_secret: process.env.JWT_SIGN_SECRET
    },
    redis: {
        server: process.env.REDIS_SERVER,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
    url: {
        societe_url: process.env.SOCIETE_URL
    },
    token: {
        nbr_de_requete: process.env.NBR_REQUETE,
        nbr_de_char: process.env.TOKEN_LENGTH,
    },
    utilisateur: {
        nbr_de_requete: process.env.NBR_REQUETE_USER,
        nbr_de_reponse: process.env.NBR_REPONSE_USER,
    },
    redis: {
        server: process.env.REDIS_SERVER,
        port: process.env.REDIS_PORT,
        expire: process.env.REDIS_EXPIRE
    },
    limiter: {
        anonyme_limiter: process.env.ANONYME_LIMITER,
        anonyme_window: process.env.ANONYME_WINDOW,
        auth_limiter: process.env.AUTH_LIMITER,
        auth_window: process.env.AUTH_WINDOW,
        retenue_limiter: process.env.RETENUE_LIMITER,
        retenue_window: process.env.RETENUE_WINDOW,
    },
    rs: {
        rs_length: process.env.RS_LENGTH,
    },
    anonyme: {
        nbr_de_reponse_anonyme: process.env.NBR_REPONSE_ANONYME
    },
    recherche:{
        word_length: process.env.WORD_LENGTH
    }
    
}


module.exports = env;