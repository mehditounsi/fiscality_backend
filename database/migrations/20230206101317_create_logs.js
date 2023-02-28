/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("mf_log_recherche", (t) => {
        t.increments("id").primary();
        t.string("ip_client",512);
        t.string("token", 512);
        t.string("recherche", 512);
        t.string("pays", 512);
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
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
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("mf_log_recherche")
};
