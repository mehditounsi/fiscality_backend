const genericModel = require('./model');

const name = 'Utilisateur';
const tableName = 'mf_utilisateur';
const selectableProps = [
    'id',
    'login',
    'password',
    'role',
    'nom',
    'nbr_de_requete',
    'uid',
    'statut',
    'gerant',
    'nbr_de_reponse'
]


module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });


    const findByUid = async (uid) => {
        let rs = await knex.select(selectableProps).from(tableName).where({ uid: uid })
        if (rs && rs.length > 0) {
            return rs[0]
        }
        return null
    }

    const findByLogin = async (login) => {
        let rs = await knex.select(selectableProps).from(tableName).where({ login: login })
        if (rs && rs.length > 0) {
            return rs[0]
        }
        return null
    }

    const modifierNom = async (id, nom) => {
        try {
            let rs = await knex
                .update({ nom: nom })
                .from(tableName)
                .where({ id: id })
                .returning(selectableProps)
            if (rs && rs.length > 0) {
                return rs[0]
            }
            return null
        } catch (error) {
            console.log(error);
        }
    }

    return {
        ...model,
        findByUid,
        findByLogin,
        modifierNom,
    };
};
