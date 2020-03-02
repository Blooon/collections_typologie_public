var knex = require('../utils/knex.utils.js');

class ItemsModels {
    static async getItems(){
        try {
            const items = await knex('item').where({
                archived: 0
            });
            return items;
        }
        catch (err ){
            console.log(err);
            throw new Error("Internal message");
        }
    }

    static async getItem(itemId) {
        try {
            const item = await knex('item').where({
                id: itemId, 
                archived: 0
            });
            return item[0];
        }
        catch( err) {
            console.log(err);
            throw new Error("Internal message");
        }
    }
}

module.exports = ItemsModels;