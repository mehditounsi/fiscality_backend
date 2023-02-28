const utilisateurService = require("../services/utilisateur");
const Logger = require("winston");
let configuration = require('../config/config')
let jwtUtils = require('../helpers/jwt')


//utilisateur

exports.inscription = async (req, res) => {
    try {
        let data = {
            nom: req.body.nom,
            login: req.body.login,
            uid: req.body.uid,
            role: req.body.role
        }
        //nom , login et uid obligatoire
        if (!data.nom || !data.uid || !data.login) {
            res.status(420).send("missing credentials");
        } else {
            await utilisateurService.inscription(data)
            res.status(200).send({ message: "le compte utilisateur a été créer avec succès" })
        }
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.connexion = async (req, res) => {
    try {
        //connexion en tant qu'utilisateur
        if (req.headers.authorization) {
            let token = await jwtUtils.generateTokenForUser(req.headers.authorization)
            let utilisateur_auth = await utilisateurService.connexion()
            if (utilisateur_auth) {
                utilisateur_auth.token = token
                res.status(200).send(utilisateur_auth)
            } else {
                res.status(401)
            }
            //connexion en tant qu'administrateur
        } else if (req.body.password && req.body.nom) {
            let nom = req.body.nom
            let password = req.body.password
            let token
            let administrateur = await utilisateurService.connexionAdmin(nom, password)
            if (administrateur) {
                token = await jwtUtils.generateTokenForAdmin(administrateur.nom)
                administrateur.token = token
            }
            res.status(200).send(administrateur)
        } else {
            res.status(401).send("no token provided");
        }
    } catch (err) {
        console.error(err);
        Logger.error("Error" + err)
        res.status(420).send({ error: err.message, code: err.code });
    }
}

// exports.deconnexion = async (req, res) => {
//     try {

//     } catch (error) {
//         Logger.error(error)
//         res.status(420).send(error);
//     }
// }

exports.profil = async (req, res) => {
    try {
        let profil = await utilisateurService.profil()
        res.status(200).json(profil)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error)
    }
}

exports.modifierProfil = async (req, res) => {
    try {
        let nom = req.body.nom
        let profil = await utilisateurService.modifierProfil(nom)
        res.status(200).json(profil)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.creationToken = async (req, res) => {
    try {
        let token = await utilisateurService.creationToken(req.body)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.listeToken = async (req, res) => {
    try {
        let tokens = await utilisateurService.listeToken()
        res.status(200).json(tokens)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.getToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.supprimerToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.supprimerToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.activerToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.activerToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.desactiverToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.desactiverToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.suspendreToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.suspendreToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.supprimerTokenStatut = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.supprimerTokenStatut(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.accesGerantToken = async (req, res) => {
    try {
        let id = req.params.id
        let token = await utilisateurService.accesGerantToken(id)
        res.status(200).json(token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

//admin


exports.listeUtilisateur = async (req, res) => {
    try {
        let utilisateur = await utilisateurService.listeUtilisateur()
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.getUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.activerUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.activerUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.desactiverUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.desactiverUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.suspendreUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.suspendreUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}



exports.supprimerUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.supprimerUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.accesGerantUtilisateur = async (req, res) => {
    try {
        let id = req.params.id
        let utilisateur = await utilisateurService.accesGerantUtilisateur(id)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.listeTokenUtilisateur = async (req, res) => {
    try {
        // id utilisateur
        let id = req.params.id
        let liste_token = await utilisateurService.listeTokenUtilisateur(id)
        res.status(200).json(liste_token)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.modifierUtilisateur = async (req, res) => {
    try {
        let data = {
            nbr_de_requete: req.body.nbr_de_requete,
            nbr_de_reponse: req.body.nbr_de_reponse
        }
        let id = req.params.id
        let utilisateur = await utilisateurService.modifierUtilisateur(id, data)
        res.status(200).json(utilisateur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.ListeSociete = async (req, res) => {
    try {
        let recherche = req.query.recherche
        let societe = await utilisateurService.ListeSociete(recherche)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.getSociete = async (req, res) => {
    try {
        let id = req.params.id
        let societe = await utilisateurService.getSociete(id)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.modifierSociete = async (req, res) => {
    try {
        let id = req.params.id
        let societe = await utilisateurService.modifierSociete(id, req.body)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.supprimerSociete = async (req, res) => {
    try {
        let id = req.params.id
        let societe = await utilisateurService.supprimerSociete(id)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getLogs = async (req, res) => {
    try {
        let user_id = req.query.user_id
        let token = req.query.token
        let date_debut = req.query.date_debut
        let date_fin = req.query.date_fin
        let logs = await utilisateurService.getLogs(user_id, token, date_debut, date_fin)
        res.status(200).json(logs)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}