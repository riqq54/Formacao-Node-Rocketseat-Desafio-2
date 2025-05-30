import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table)=> {
        table.uuid('id').primary(),
        table.text('name').notNullable(),
        table.text('description').notNullable(),
        table.timestamp('had_at').notNullable(),
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(),
        table.boolean('on_diet').notNullable(),
        table.uuid('user_id').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}
