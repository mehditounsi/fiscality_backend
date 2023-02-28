/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("mf_utilisateur", (t) => {
        t.increments("id").primary();
        t.string("login", 60).unique();
        t.string("password", 100);
        t.string("role",15);
        t.string("nom", 100);
        t.string("nbr_de_requete");
        t.string("uid", 60);
        t.enu("statut", ['Actif', 'Inactif', 'Suspendu','Supprimé']).defaultTo('Inactif')
        t.integer("gerant").defaultTo(0);
        t.integer("nbr_de_reponse")

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("mf_utilisateur")
};
