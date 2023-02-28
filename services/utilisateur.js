const { Utilisateur, Token, Societe, Logs } = require('../models')
const Errors = require('../helpers/errors');
const configuration = require('../config/config')
const Logger = require('winston')
let axios = require('axios');
let fs = require('fs')
const { getUser, getUserId } = require('../helpers/context')
let rechercheService = require('./recherche');
let tools = require('../helpers/tools')

exports.inscription = async (data) => {
    try {
        if (data) {
            let existant = await Utilisateur.findByLogin(data.login)
            if (!existant) {
                data.nbr_de_requete = configuration.utilisateur.nbr_de_requete
                data.nbr_de_reponse = configuration.utilisateur.nbr_de_reponse
                let utilisateur = await Utilisateur.create(data)
                if (utilisateur) {
                    Logger.info('inscription', utilisateur)
                } else {
                    new Errors.InvalidDataError('données invalide')
                }
            } else {
                new Errors.InvalidDataError('Utilisateur déja existant')
            }
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.connexion = async () => {
    try {
        let utilisateur = getUser();
        if (utilisateur) {
            if (utilisateur.statut === "Inactif") {
                await Utilisateur.update(utilisateur.id, { statut: "Actif" })
            }
            Logger.info("connexion : ", utilisateur)
            return utilisateur
        } else {
            new Errors.NotFoundError("pas d'utilisateur trouvé")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.connexionAdmin = async (nom, password) => {
    try {
        if (nom && password) {
            let administrateur = await Utilisateur.findOne({ login: nom, password: password })
            if (administrateur) {
                Logger.info("connexion en tant qu'administrateur", administrateur)
                return administrateur
            } else {
                throw new Errors.InvalidDataError('nom ou mot de passe incorrecte')
            }
        } else {
            throw new Errors.InvalidDataError('données non definie')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError('Invalid data')
    }
}


exports.profil = async () => {
    try {
        //Get id du contexte
        let id = getUserId();
        let utilisateur = await Utilisateur.findById(id);
        if (utilisateur) {
            Logger.info("connexion : ", utilisateur)
            return utilisateur
        } else {
            new Errors.NotFoundError("pas d'utilisateur trouvé")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.modifierProfil = async (nom) => {
    try {
        if (nom) {
            //Get id du contexte
            let id = getUserId();
            let utilisateur = await Utilisateur.modifierNom(id, nom)
            if (utilisateur) {
                Logger.info("modifier nom d'utilisateur", utilisateur)
                return utilisateur
            } else {
                new Errors.NotFoundError("pas d'utilisateur a modifier")
            }
        } else {
            new Errors.NotFoundError("rien a modifier")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


// --------------------------------Token----------------------------------------------------


exports.creationToken = async (data) => {
    try {
        //get id du contexte
        let id = getUserId();
        data.nbr_de_requete = configuration.token.nbr_de_requete
        data.token = await tools.randomAlphabetic(configuration.token.nbr_de_char)
        data.user_id = id
        let token = await Token.create(data)
        if (token) {
            Logger.info("Création de token", token)
            return token
        } else {
            throw new Errors.InvalidDataError('problème lors de la création de token')
        }
    } catch (error) {
        console.log(error)
        throw new error
    }
}


exports.listeToken = async () => {
    try {
        let listeToken = await Token.listeUserToken();
        if (listeToken) {
            Logger.info("liste des tokens de l'utilisateur", listeToken)
            return listeToken
        } else {
            new Errors.NotFoundError('pas de token trouvé')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.getToken = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id);
            if (token) {
                Logger.info('trouvé le token', token)
                return token
            } else {
                new Errors.NotFoundError('pas de token trouvé')
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.supprimerToken = async (id) => {
    try {
        if (id) {
            let exist = await Token.findTokenById(id)
            if (exist) {
                let token = await Token.destroyTokenById(id);
                return token
            } else {
                new Errors.NotFoundError('pas de token a supprimer')
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.activerToken = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id)
            if (token && token.statut !== "Actif") {
                await Token.update(id, { statut: "Actif" })
                return { message: "le Token est désormais actif" }
            } else {
                return { message: "le Token est déja activer" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.desactiverToken = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id)
            if (token && token.statut !== "Inactif") {
                await Token.update(id, { statut: "Inactif" })
                return { message: "le Token est désormais Inactif" }
            } else {
                return { message: "le Token est déja Inactif" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.suspendreToken = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id)
            if (token && token.statut !== "Suspendu") {
                await Token.update(id, { statut: "Suspendu" })
                return { message: "le Token est désormais Suspendu" }
            } else {
                return { message: "le Token est déja Suspendu" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.supprimerTokenStatut = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id)
            if (token && token.statut !== "Supprimé") {
                await Token.update(id, { statut: "Supprimé" })
                return { message: "le Token est désormais Supprimé" }
            } else {
                return { message: "le Token est déja Supprimé" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.accesGerantToken = async (id) => {
    try {
        if (id) {
            let token = await Token.findTokenById(id)
            if (token && token.gerant == 0) {
                await Token.update(id, { gerant: 1 })
                return { message: "l'option recherche gerant est désormais activer pour ce token" }
            } else {
                await Token.update(id, { gerant: 0 })
                return { message: "l'option recherche gerant est désormais désactiver pour ce token" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


//--------------------------admin--------------------------------


exports.listeUtilisateur = async () => {
    try {
        let utilisateur = await Token.listeUtilisateur();
        if (utilisateur) {
            Logger.info('liste des utilisateurs', utilisateur)
            return utilisateur
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.getUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur) {
                Logger.info('get utilisateur', utilisateur)
                return utilisateur
            } else {
                new Errors.NotFoundError("aucun utilisateur trouvé")
            }
        } else {
            new Errors.NotFoundError("données manquante")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.activerUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur && utilisateur.statut !== "Actif") {
                await Utilisateur.update(id, { statut: "Actif" })
                return { message: "l'utilisateur est désormais actif" }
            } else {
                return { message: "l'utilisateur est déja actif" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.desactiverUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur && utilisateur.statut !== "Inactif") {
                await Utilisateur.update(id, { statut: "Inactif" })
                return { message: "l'utilisateur est désormais Inactif" }
            } else {
                return { message: "l'utilisateur est déja Inactif" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.suspendreUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur && utilisateur.statut !== "Suspendu") {
                await Utilisateur.update(id, { statut: "Suspendu" })
                return { message: "l'utilisateur est désormais suspendu" }
            } else {
                return { message: "l'utilisateur est déja suspendu" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.supprimerUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur && utilisateur.statut !== "Supprimé") {
                await Utilisateur.update(id, { statut: "Supprimé" })
                return { message: "l'utilisateur est désormais supprimé" }
            } else {
                return { message: "l'utilisateur est déja supprimé" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.accesGerantUtilisateur = async (id) => {
    try {
        if (id) {
            let utilisateur = await Utilisateur.findById(id)
            if (utilisateur && utilisateur.gerant == 0) {
                await Utilisateur.update(id, { gerant: 1 })
                return { message: "l'option recherche gérant est désormais activer pour cet utilisateur" }
            } else {
                await Utilisateur.update(id, { gerant: 0 })
                return { message: "l'option recherche gérant est désormais désactiver pour cet utilisateur" }
            }
        } else {
            new Errors.InvalidDataError('données invalide')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.listeTokenUtilisateur = async (id) => {
    try {
        if (id) {
            let token = await Token.find({ user_id: id })
            if (token) {
                Logger.info("token utilisateur", token)
                return token
            } else {
                new Errors.NotFoundError('no token found')
            }
        } else {
            new Errors.InvalidDataError('données manquante')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.modifierUtilisateur = async (id, update) => {
    try {
        if (id && update) {
            let utilisateur = await Utilisateur.update(id, update)
            if (utilisateur) {
                Logger.info('modifier utilisateur', utilisateur)
                return utilisateur
            } else {
                new Errors.NotFoundError('Aucun utilisateur trouvé')
            }
        } else {
            new Errors.InvalidDataError('données manquantes')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


//--------societe


exports.ListeSociete = async (recherche) => {
    try {
        let societe = await Societe.rechercheAnonyme(recherche)
        if (societe) {
            Logger.info("recherche société", societe)
            return societe
        } else {
            throw new Errors.NotFoundError('aucune société trouvée')
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}
exports.getSociete = async (id) => {
    try {
        if (id) {
            let societe = await Societe.findById(id)
            if (societe) {
                rechercheService.editSociete(societe)
                Logger.info("trouvé la société", societe)
                return societe
            } else {
                return {}
            }
        } else {
            throw new Errors.InvalidDataError("données manquantes")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

exports.modifierSociete = async (id, update) => {
    try {
        if (id && update) {
            let societe = await Societe.update(id, update)
            if (societe) {
                Logger.info("modifier la societe", societe)
                return societe
            } else {
                throw new Errors.NotFoundError('aucune société trouvée')
            }
        } else {
            throw new Errors.InvalidDataError("données manquantes")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}


exports.supprimerSociete = async (id) => {
    try {
        if (id) {
            let exist = await Societe.findById(id)
            if (exist) {
                let societe = await Societe.destroy(id)
                return societe
            } else {
                throw new Errors.NotFoundError('aucune société trouvée')
            }
        } else {
            throw new Errors.InvalidDataError("données manquantes")
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}

//-----------------------------logs-----------------------------------


exports.getLogs = async (user_id, token, date_debut, date_fin) => {
    try {
        let logs
        //affichage de tous les logs
        if (!user_id && !token && !date_debut && !date_fin) {
            logs = await Logs.findAll()
            if (logs) {
                Logger.info("trouvé tous les logs", logs)
                return logs
            }
        }
        //affichage des logs d'un utilisateur specifique
        if (user_id) {
            logs = await Logs.find({ user_id: user_id })
            if (logs) {
                Logger.info("trouvé logs avec l'id de l'utilisateur", logs)
                return logs
            }
        }
        //affichage des logs d'un token specifique
        if (token) {
            logs = await Logs.find({ token: token })
            if (logs) {
                Logger.info("trouvé logs avec un token", logs)
                return logs
            }
        }
        //affichage des logs selon une intervalle de date
        if (date_debut && date_fin) {
            logs = await Logs.findLogsIntervale(date_debut, date_fin)
            if (logs) {
                Logger.info("trouvé logs avec un token", logs)
                return logs
            }
        }
    } catch (error) {
        console.log(error);
        throw new error
    }
}