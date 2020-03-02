const typologiesModels = require('./typologies.models');
class Livres {
     static async getLivres(req, res) {
        try {
            const typologies = await typologiesModels.getRecentTypo();
            await res.send({ livres: typologies })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }
     static async getLivre(req, res) {
        try {
            const livre = await typologiesModels.getTypologieByNumero(req.params.typologieId);
            await res.send({ livre })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
     }
}

module.exports = Livres