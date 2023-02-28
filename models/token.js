const genericModel = require('./model');
const { getUserId } = require('../helpers/context')

const name = 'Token';
const tableName = 'mf_token';
const selectableProps = [
    'id',
    'token',
    'statut',
    'gerant',
    'nbr_de_requete',
    'created_at',
    'expiration',
    'user_id',
];


module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });


    const listeUserToken = async () => {
        let rs = await knex.select(selectableProps).from(tableName).where({ user_id: getUserId() })
        return rs
    }

    const findTokenById = async (id) => {
        let condition = {
            id: id,
            user_id: getUserId()
        }
        let find = await knex.select(selectableProps).from(tableName).where(condition);
        return find[0]
    }

    const destroyTokenById = async (id) => {
        let condition = {
            id: id,
            user_id: getUserId()
        }
        let rs = await knex.del().from(tableName).where(condition).returning(selectableProps);
        if (rs && rs.length > 0) {
            return rs[0]
        }
        return null
    }

    const listeUtilisateur = async () => {
        try {
            let props = [
                "mf_utilisateur.id AS utilisateur_id",
                "mf_utilisateur.login AS utilisateur_login",
                "mf_utilisateur.nom AS nom_utilisateur",
                "mf_utilisateur.nbr_de_requete AS nbr_de_req",
                "mf_utilisateur.statut AS statut_utilisateur",
                "mf_utilisateur.nbr_de_reponse AS nbr_de_rep",
                "mf_utilisateur.gerant AS gerant_utilisateur"
            ]
            let utilisateur = await knex.select(props).from(tableName)
                .rightJoin("mf_utilisateur", "mf_utilisateur.id", "=", "user_id")
                .count('user_id AS nbr_de_token').groupBy('mf_utilisateur.id')
            return utilisateur
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }


    return {
        ...model,
        listeUserToken,
        findTokenById,
        destroyTokenById,
        listeUtilisateur
    };
};
