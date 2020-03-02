var knex = require('../utils/knex.utils.js');

async function getFilesOfTypologie(typologieId) {
    var files = await knex('files').where({
        typologieId,
        type: 'typologie'
    });
    return files;
}

async function getFilesOfExpo(expoId) {
    var files = await knex('files').where({
        typologieId: expoId,
        type: 'expo'
    });
    return files;
}
async function addFileToExpo(file, expoId) {
    await file.mv(`./static/${file.name}`);
    await knex('files').insert({
        typologieId: expoId,
        name: file.name,
        type: "expo"
     });
}
async function addFileToTypologie(file, typologieId) {
    await file.mv(`./static/${file.name}`);
    await knex('files').insert({
        typologieId,
        name: file.name,
        type: "typologie"
     });
}

module.exports = {
    addFileToTypologie,
    addFileToExpo,
    getFilesOfTypologie,
    getFilesOfExpo
};