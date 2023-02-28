/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("societe", (t) => {
        t.increments("id").primary();
        t.string("mf", 13);
        t.string("rc", 20);
        t.string("nom_fr", 512);
        t.string("adresse_fr", 512);
        t.string("nom_ar", 512);
        t.string("adresse_ar", 512);
        t.string("gerant", 512);
        t.string("type",512);
        t.timestamp("date_maj")
      })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("societe")
}
