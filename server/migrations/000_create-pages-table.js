/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

/* eslint-env node */

exports.up = knex =>
  knex.schema.createTable('pages', table => {
    table.string('name').primary();

    table.jsonb('data').defaultTo('{}');
  });

exports.down = knex => knex.schema.dropTable('pages');
