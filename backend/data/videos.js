const videosModels = require('./videos.models')
class videos {
     static async getVideos(req, res) {
        try {
            const videos = await videosModels.getVideos();
            await res.send({ videos });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }

     static async getExpo(req, res) {
        try {
            const expo = await videosModels.getExpo(req.params.expoId);
            await res.send({ expo });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }
}

module.exports = videos