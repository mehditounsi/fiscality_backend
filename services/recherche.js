const { Societe, Logs, Utilisateur } = require('../models')
const Errors = require('../helpers/errors');
const configuration = require('../config/config')
const Logger = require('winston')
let fs = require('fs');
const { getUserId } = require('../helpers/context')
const redis_client = require('../config/redis');



exports.rechercheAnonyme = async (recherche, preferences) => {
    try {
        if (recherche.length >= 3 && preferences) {
            for (var key in preferences) {
                if (preferences[key] == 'false' || preferences[key] == 'null' || preferences[key] == undefined) {
                    delete preferences[key]
                }
            }
            if (Object.keys(preferences).length !== 0) {
                let societe = await Societe.rechercheAnonyme(recherche, preferences)
                if (societe && societe != []) {
                    let redis_recherche = recherche + preferences.raison_sociale + preferences.matricule_fiscal + preferences.registre_de_commerce + preferences.adresse + preferences.situation_fiscale
                    await redis_client.set(redis_recherche, JSON.stringify(societe));
                    Logger.debug("set search in redis",redis_recherche)
                    await redis_client.expire(redis_recherche, configuration.redis.expire);
                    Logger.info("recherche société", societe)
                    for (let i = 0; i < societe.length; i++) {
                        if (societe[i].nom_fr) {
                            if (societe[i].nom_fr.substr(0, 4) == "STE ") {
                                societe[i].nom_fr = societe[i].nom_fr.substr(+configuration.rs.rs_length - 6, +configuration.rs.rs_length + 4) + '...'
                            } else {
                                societe[i].nom_fr = societe[i].nom_fr.substr(0, +configuration.rs.rs_length) + '...'
                            }
                        }
                        if (societe[i].nom_ar) {
                            if (societe[i].nom_ar.substr(0, 4) == "STE ") {
                                societe[i].nom_ar = societe[i].nom_ar.substr(+configuration.rs.rs_length - 6, +configuration.rs.rs_length + 4) + '...'
                            } else {
                                societe[i].nom_ar = societe[i].nom_ar.substr(0, +configuration.rs.rs_length) + '...'
                            }
                        }
                    }

                    return societe
                } else {
                    return []
                }
            } else {
                return []
            }
        } else {
            return []
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}



exports.rechercheAuth = async (recherche, preferences) => {
    try {
        if (recherche.length >= 3 && preferences) {
            let utilisateur = await Utilisateur.findById(getUserId())
            let nbr_de_reponse = utilisateur.nbr_de_reponse
            //Verification de l'objet preferences
            for (var key in preferences) {
                if (preferences[key] == 'false' || preferences[key] == 'null' || preferences[key] == undefined) {
                    delete preferences[key]
                }
            }
            if (Object.keys(preferences).length !== 0) {
                let societe = await Societe.rechercheAuth(recherche, preferences, nbr_de_reponse)
                if (societe) {
                    let redis_recherche = recherche + preferences.raison_sociale + preferences.matricule_fiscal + preferences.registre_de_commerce + preferences.adresse + preferences.situation_fiscale
                    await redis_client.set(redis_recherche, JSON.stringify(societe));
                    await redis_client.expire(redis_recherche, configuration.redis.expire);
                    Logger.debug("recherche société", societe)
                    for (let i = 0; i < societe.length; i++) {
                        if (societe[i].nom_fr) {
                            if (societe[i].nom_fr.substr(0, 4) == "STE ") {
                                societe[i].nom_fr = societe[i].nom_fr.substr(+configuration.rs.rs_length - 6, +configuration.rs.rs_length + 4) + '...'
                            } else {
                                societe[i].nom_fr = societe[i].nom_fr.substr(0, +configuration.rs.rs_length) + '...'
                            }
                        }
                        if (societe[i].nom_ar) {
                            if (societe[i].nom_ar.substr(0, 4) == "STE ") {
                                societe[i].nom_ar = societe[i].nom_ar.substr(+configuration.rs.rs_length - 6, +configuration.rs.rs_length + 4) + '...'
                            } else {
                                societe[i].nom_ar = societe[i].nom_ar.substr(0, +configuration.rs.rs_length) + '...'
                            }
                        }
                    }
                    return societe
                } else {
                    return []
                }
            } else {
                return []
            }
        } else {
            return []
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.rechercheRetenue = async (mf) => {
    try {
        if (mf.length >= 4) {
            let societe = await Societe.rechercheRetenue(mf)
            if (societe) {
                Logger.debug('search societe', societe)
                return societe
            } else {
                throw new Errors.NotFoundError('aucune société trouvé')
            }
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

exports.detailsSociete = async (id) => {
    try {
        let societe = await Societe.findById(id)
        if (societe) {
            if (societe.to_update == 0 || !societe.to_update){
                this.societeToEdit(societe)
            }
            Logger.info("details société", societe)
            return societe
        } else {
            return {}
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.societeToEdit = async (societe) =>{
    try {
        let current_date = new Date()
        let difference = Math.abs(current_date - societe.date_maj)
        let diffDays = Math.ceil(difference / (1000 * 60 * 60 * 24))
        if ((diffDays > 30 || !societe.date_maj)) {
            Logger.debug('societe à modifier')
            await Societe.update(societe.id, {to_update : 1})
        } else {
            Logger.error("Moins d'un mois depuis la dernière mise à jour")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


//-----------------------------logs--------------------------------------------

exports.creationLog = async (logs) => {
    if (logs) {
        let log = await Logs.create(logs)
        if (log) {
            Logger.info("log : ", log)
        } else {
            Logger.error('pas de données pour les logs')
        }
    } else {
        Logger.error('pas de données pour les logs')
    }
}