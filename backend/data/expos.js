const exposModels = require('./expos.models')
class expos {
     static async getExpos(req, res) {
        try {
            const expos = await exposModels.getExpos();
            await res.send({ expos });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }

     static async getExpo(req, res) {
        try {
            const expo = await exposModels.getExpo(req.params.expoId);
            await res.send({ expo });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }
}

module.exports = expos