const rechercheService = require("../services/recherche");
const Logger = require("winston");
const tools = require("../helpers/tools")
let configuration = require('../config/config')
const { getUserId } = require('../helpers/context')


exports.rechercheAnonyme = async (req, res) => {
    try {
        let recherche = req.query.recherche

        let headers = req.headers

        // parametres des logs pour la recherche anonyme
        let logs = {
            ip_client: tools.getHeaders(headers, "cf-connecting-ip"),
            recherche: recherche,
            pays: tools.getHeaders(headers, "cf-ipcountry"),
        }

        await rechercheService.creationLog(logs)

        // preferences de recherche (filtrer par:)
        let preferences = {
            raison_sociale: headers.raison_sociale,
            matricule_fiscal: headers.matricule_fiscal,
            registre_de_commerce: headers.registre_de_commerce,
            adresse: headers.adresse,
            situation_fiscale: headers.situation_fiscale,
        }

        let societe = await rechercheService.rechercheAnonyme(recherche, preferences)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}



exports. rechercheAuth = async (req, res) => {
    try {
        let recherche = req.query.recherche
        let logs
        let headers = req.headers

        if (headers.authorization && !headers.token) {
            // parametres des logs pour la recherche authentifier
            logs = {
                ip_client: tools.getHeaders(headers, "cf-connecting-ip"),
                recherche: recherche,
                pays: tools.getHeaders(headers, "cf-ipcountry"),
                user_id: getUserId()
            }
        }
        if (headers.authorization && headers.token) {
            // paramétres des logs pour la recherche avec token générer de l'app
            logs = {
                ip_client: tools.getHeaders(headers, "cf-connecting-ip"),
                recherche: recherche,
                pays: tools.getHeaders(headers, "cf-ipcountry"),
                token: headers.token,
                user_id: getUserId()
            }
        }

        await rechercheService.creationLog(logs)

        // préférences de recherche (filtrer par:)
        let preferences = {
            raison_sociale: headers.raison_sociale,
            matricule_fiscal: headers.matricule_fiscal,
            registre_de_commerce: headers.registre_de_commerce,
            adresse: headers.adresse,
            situation_fiscale: headers.situation_fiscale,
            gerant: headers.gerant
        }

        let societe = await rechercheService.rechercheAuth(recherche, preferences)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.rechercheRetenue = async (req, res) => {
    try {
        let mf = req.query.mf
        let societe = await rechercheService.rechercheRetenue(mf)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.detailsSociete = async (req, res) => {
    try {
        let id = req.params.id
        let societe = await rechercheService.detailsSociete(id)
        res.status(200).json(societe)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}