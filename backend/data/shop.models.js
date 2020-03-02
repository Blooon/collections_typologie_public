var knex = require('../utils/knex.utils.js');

class shopModels {
    static async verifStockItem(table, id, askedAmount) {
        let item;
        try {
            item = await knex(table).where({
                id
            });
        }
        catch (err) {
            console.log(err)
            throw new Error("Internal Error")
        }
        if (item.length !== 1) {
            throw new Error("No such item");
        }
        if (askedAmount > item[0].stock && item[0].stock >= 0) {
            throw new Error("Item out of stock");
        }
    }
    static async verifStockTypologie(table, id, askedAmount, lang) {
        let item;
        try {
            item = await knex(table).where({
                id
            });
        }
        catch (err) {
            console.log(err)
            throw new Error("Internal Error")
        }
        if (item.length !== 1) {
            throw new Error("No such typology");
        }
        if (askedAmount > item[0]['stock' + lang] && item[0]['stock' + lang] >= 0) {
            throw new Error("Typology out of stock");
        }
    }
}

module.exports = shopModels