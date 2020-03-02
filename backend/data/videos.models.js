var knex = require('../utils/knex.utils.js');
var filesModel = require('./files.models.js');

async function getRecentTypo() {
    const videos = await knex('video').where({
        archived: 0
    }).orderBy('id', 'desc').limit(3);
    return videos;
}

async function getVideos() {
    var videos = await knex('video').where({
        archived: 0
    });
    return videos;
}

async function getVideo(videoId) {
    var video = await knex('video').where({
        id: videoId,
        archived: 0
    });
    if (video.length !== 1) {
        return null;
    }
    video[0].files = await filesModel.getFilesOfVideo(videoId);

    return video[0];
}

async function insertVideo(body, files) {
    try {
        videoId = await knex('video').insert({
            name: body.name,
            description: body.description,
            number: body.number,
            date: knex.fn.now(),
            cover: files.cover.name,
            back: files.back.name,
            archived: 0
        }).returning('id');
        // await addItemToVideo(req, videoId);
        await filesModel.addFileToVideo(files.cover, videoId);
        await filesModel.addFileToVideo(files.back, videoId);

    }
    catch (err) {
        console.log(err);
        throw new Error("Failed to insert");
    }
}

async function updateVideo(body, videoId) {
    await knex('video').update({
        name: body.name,
        description: body.description,
        number: body.number
    })
    .where({
        id: videoId,
        archived: 0
    });
}

async function deleteVideo(videoId) {
    await knex('video').delete().where({
        id: videoId
    })
}

module.exports = { 
    deleteVideo,
    insertVideo,
     getVideo,
     getVideos,
     updateVideo,
     getRecentTypo }