const knex = require('../utils/knex.utils.js');
const filesModel = require('./files.models.js');

async function getRecentTypo() {
    const typologies = await knex('typologie').where({
        archived: 0
    }).orderBy('number', 'desc')
    // .limit(3);
    return typologies;
}

async function getTypologies() {
    var typologies = await knex('typologie').where({
        archived: 0
    });
    return typologies;
}

async function getTypologieByNumero(numero) {
    var typologie = await knex('typologie').where({
        numero: 1, 
        archived: 0
    });
    return typologie[0].id;
}

async function getTypologie(typologieId) {
    var typologie = await knex('typologie').where({
        id: typologieId,
        archived: 0
    });
    if (typologie.length !== 1) {
        return null;
    }
    // typologie[0].files = await filesModel.getFilesOfTypologie(typologieId);
    return typologie[0];
}

async function insertTypologie(body, files) {
    try {
        typologieId = await knex('typologie').insert({
            name: body.name,
            description: body.description,
            content1: body.content1,
            content2: body.content2,
            content3: body.content3,
            price: body.price,
            number: body.number,
            cover: files.cover.name,
            back: files.back.name,
            shop: files.shop.name,
            miniature: files.miniature.name,
            date: knex.fn.now(),
            archived: 0
        }).returning('id');
        // await filesModel.addFileToTypologie(file, typologieId);
        await files.cover.mv(`./static/${files.cover.name}`);
        await files.back.mv(`./static/${files.back.name}`);
        await files.shop.mv(`./static/${files.shop.name}`);
        await files.miniature.mv(`./static/${files.miniature.name}`);

    }
    catch (err) {
        console.log(err);
        throw new Error("Failed to insert");
    }
}

async function updateTypologie(body, typologieId) {
    await knex('typologie').update({
        name: body.name,
        description: body.description,
        content: body.content,
        price: body.price,
    })
    .where({
        id: typologieId,
        archived: 0
    });
}

async function deleteTypologie(typologieId) {
    await knex('typologie').delete().where({
        id: typologieId
    })
}

module.exports = { 
    deleteTypologie,
    insertTypologie,
     getTypologie,
     getTypologies,
     updateTypologie,
     getRecentTypo,
     getTypologieByNumero
}