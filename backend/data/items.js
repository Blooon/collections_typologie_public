const ItemsModels = require('./items.models');

class Items {
    static async getItems(req, res) {
        const items = await ItemsModels.getItems();
        await res.send({items});
    }
}

module.exports = Items;