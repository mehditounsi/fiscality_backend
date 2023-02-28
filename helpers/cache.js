const redis_client = require('../config/redis');
let configuration = require('../config/config')
const Logger = require("winston");


module.exports.checkCache = async (req, res, next) => {
    try {
        let headers = req.headers

        let preferences = {
            raison_social: headers.raison_social,
            matricule_fiscal: headers.matricule_fiscal,
            registre_de_commerce: headers.registre_de_commerce,
            adresse: headers.adresse,
            situation_fiscal: headers.situation_fiscal,
        }
        for (var key in preferences) {
            if (preferences[key] == 'false' || preferences[key] == 'null' || preferences[key] == undefined) {
                delete preferences[key]
            }
        }
        let recherche = req.query.recherche
        let redis_recherche = recherche + preferences.raison_social + preferences.matricule_fiscal + preferences.registre_de_commerce + preferences.adresse + preferences.situation_fiscal;
        let cache = await redis_client.get(redis_recherche)
        if (!cache) {
            Logger.debug("The cache is empty")
            next()
        } else {
            let parsed_cache = JSON.parse(cache)
            for (let i = 0; i < parsed_cache.length; i++) {
                if (parsed_cache[i].nom_fr) {
                    if (parsed_cache[i].nom_fr.substr(0, 4) == "STE ") {
                        parsed_cache[i].nom_fr = parsed_cache[i].nom_fr.substr(+configuration.rs.rs_length - 6,+configuration.rs.rs_length + 4) + '...'
                    } else {
                        parsed_cache[i].nom_fr = parsed_cache[i].nom_fr.substr(0, +configuration.rs.rs_length) + '...'
                    }
                }
                if (parsed_cache[i].nom_ar) {
                    if (parsed_cache[i].nom_ar.substr(0, 4) == "STE ") {
                        parsed_cache[i].nom_ar = parsed_cache[i].nom_ar.substr(+configuration.rs.rs_length - 6,+configuration.rs.rs_length + 4) + '...'
                    } else {
                        parsed_cache[i].nom_ar = parsed_cache[i].nom_ar.substr(0, +configuration.rs.rs_length) + '...'
                    }
                }
            }
            Logger.debug("searched", redis_recherche)
            Logger.info("data from cache", parsed_cache)
            return res.json(parsed_cache);
        }
    } catch (error) {
        console.log(error);
        throw error
    }
};