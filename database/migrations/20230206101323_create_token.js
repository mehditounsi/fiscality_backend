/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("mf_token", (t) => {
        t.increments("id").primary();
        t.string("token", 100);
        t.enu("statut", ['Actif', 'Inactif', 'Suspendu' , 'Expirer', 'Supprimé']).defaultTo('Actif')
        t.integer("gerant").defaultTo(0);
        t.integer("nbr_de_requete");
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        t.timestamp("expiration")
        t.integer("user_id").unsigned();
        t.foreign("user_id")
            .references("mf_utilisateur.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("mf_token")
};
