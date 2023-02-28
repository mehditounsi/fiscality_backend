const genericModel = require('./model');

const name = 'Logs';
const tableName = 'mf_log_recherche';
const selectableProps = [
    'id',
    'ip_client',
    'token',
    'user_id',
    'recherche',
    'created_at',
    'pays'
];


module.exports = (knex) => {
    const model = genericModel({
        knex,
        name,
        tableName,
        selectableProps,
    });

    const findLogsIntervale = async (date_debut, date_fin) => {
        try {
            let logs = await knex.select().from(tableName).where('created_at', '>=', date_debut)
            .where('created_at', '<', date_fin)
            return logs
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }

    return {
        ...model,
        findLogsIntervale
    };
};
