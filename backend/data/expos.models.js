var knex = require('../utils/knex.utils.js');
var filesModel = require('./files.models.js');

async function getRecentTypo() {
    const expos = await knex('expo').where({
        archived: 0
    }).orderBy('id', 'desc').limit(3);
    return expos;
}

async function getExpos() {
    var expos = await knex('expo').where({
        archived: 0
    });
    return expos;
}

async function getExpo(expoId) {
    var expo = await knex('expo').where({
        id: expoId,
        archived: 0
    });
    if (expo.length !== 1) {
        return null;
    }
    expo[0].files = await filesModel.getFilesOfExpo(expoId);

    return expo[0];
}

async function insertExpo(body, files) {
    try {
        expoId = await knex('expo').insert({
            name: body.name,
            description: body.description,
            number: body.number,
            date: knex.fn.now(),
            cover: files.cover.name,
            back: files.back.name,
            archived: 0
        }).returning('id');
        // await addItemToExpo(req, expoId);
        await filesModel.addFileToExpo(files.cover, expoId);
        await filesModel.addFileToExpo(files.back, expoId);

    }
    catch (err) {
        console.log(err);
        throw new Error("Failed to insert");
    }
}

async function updateExpo(body, expoId) {
    await knex('expo').update({
        name: body.name,
        description: body.description,
        number: body.number
    })
    .where({
        id: expoId,
        archived: 0
    });
}

async function deleteExpo(expoId) {
    await knex('expo').delete().where({
        id: expoId
    })
}

module.exports = { 
    deleteExpo,
    insertExpo,
     getExpo,
     getExpos,
     updateExpo,
     getRecentTypo }