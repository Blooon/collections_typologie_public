const  typologieModel =  require('./typologies.models');
const itemModel = require('./items.models')
const shopModel = require('./shop.models');

class Shop {
    static async addItemToBasket(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        const item = await itemModel.getItem(req.params.itemId);
        const index = req.session.basket.items.findIndex((userItem) => {
            if (userItem.id  == req.params.itemId) {
                return true;
            }
            return false;
        });
        if ( index !== -1) {
            const newAmount = req.session.basket.items[index].amount + 1;
            await shopModel.verifStockItem('item', item.id, newAmount);
            req.session.basket.items[index].amount += 1;
        }
        else {
            item.amount = 1;
            await shopModel.verifStockItem('item', item.id, item.amount);
            req.session.basket.items.push(item);
        }
        await res.send({ basket: req.session.basket });
    }

    static async addTypologieToBasket(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        const typologie = await typologieModel.getTypologie(req.params.typologieId);
        const index = req.session.basket.typologies.findIndex((typo) => {
            if (typo.id  == req.params.typologieId && typo.lang === req.body.lang) {
                return true;
            }
            return false;
        });
        if ( index !== -1) {
            const newAmount = req.session.basket.typologies[index].amount + 1;
            await shopModel.verifStockTypologie('typologie', typologie.id, newAmount, req.session.basket.typologies[index].lang);
            req.session.basket.typologies[index].amount += 1;
        }
        else {
            typologie.amount = 1;
            typologie.lang = req.body.lang;
            await shopModel.verifStockTypologie('typologie', typologie.id, typologie.amount, req.body.lang);
            req.session.basket.typologies.push(typologie);
        }
        await res.send({ basket: req.session.basket });
    }

    static async removeItemFromBasket(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        const item = await itemModel.getItem(req.params.itemId);
        const index = req.session.basket.items.findIndex((userItem) => {
            if (userItem.id  == req.params.itemId) {
                return true;
            }
            return false;
        });
        if ( index !== -1) {
            req.session.basket.items.splice(index, 1);
        }
        await res.send({ basket: req.session.basket });
    }

    static async removeTypologieFromBasket(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        const typologie = await typologieModel.getTypologie(req.params.typologieId);
        const index = req.session.basket.typologies.findIndex((typo) => {
            if (typo.id  == req.params.typologieId && typo.lang === req.body.lang) {
                return true;
            }
            return false;
        });
        if ( index !== -1) {
            req.session.basket.typologies.splice(index, 1);
        }
        await res.send({ basket: req.session.basket });
    }
    static async getMyBasket(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }        
        }
        await res.send({ basket: req.session.basket })
    }



    static async updateAmount(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        if (req.body.typologieId) {
            const index = req.session.basket.typologies.findIndex((typologie) => {
                if (typologie.id  == req.body.typologieId && typologie.lang === req.body.lang) {
                    return true;
                }
                return false;
            });
            if ( index !== -1) {
                const typologie = req.session.basket.typologies[index];
                await shopModel.verifStockTypologie('typologie', typologie.id, req.body.amount);
                req.session.basket.typologies[index].amount = req.body.amount;
            }
        }
        else if (req.body.itemId) {
            const index = req.session.basket.items.findIndex((item) => {
                if (item.id  == req.body.itemId) {
                    return true;
                }
                return false;
            });
            if ( index !== -1) {
                const item = req.session.basket.items[index];
                await shopModel.verifStockItem('item', item.id, req.body.amount);
                req.session.basket.items[index].amount = req.body.amount;
            }
        }
        await res.send({ basket: req.session.basket });
    }

    static async updateLang(req, res) {
        if (!req.session.basket) {
            req.session.basket = {
                items: [],
                typologies: []
            }
        }
        if (req.body.typologieId) {
            const index = req.session.basket.typologies.findIndex((typologie) => {
                if (typologie.id  == req.body.typologieId && typologie.lang === req.body.old_lang) {
                    return true;
                }
                return false;
            });
            if ( index !== -1) {
                req.session.basket.typologies[index].lang = req.body.new_lang;
            }
        }
    }
}

module.exports = Shop