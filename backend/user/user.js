const knex = require('../utils/knex.utils');

class User {
    static async loginUser(req, res) {
        const user = await knex('users').where({
            mail: req.body.mail.replace(/\s/g,''),
            password: req.body.password
        }).catch((err) => {
            console.log(err);
            throw new Error ("Internal Error")
        });
        if (user.length !== 1) {
            throw new Error("Invalid email/password");
        }
        // if (user[0].valid === 0) {
        //     throw new Error("You have to validate your email");
        // }
        req.session.connected = 1;
        req.session.user = user[0]
        await res.send({ status: 200, user: user[0] });
    }

    static async addUser(req, res) {
        await knex('users').insert({
            mail: req.body.mail.replace(/\s/g,''),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            address: req.body.address
        }).catch(err => {
            console.log(err);
            throw new Error("Internal Error")} )
        // await this.loginUser(req, res);
        await res.send(req.body);
    }

    static async logout(req, res) {
        req.session.destroy();
        await res.send({ message: "Success" });
    }

    static async updateAccount(req, res) {
        await knex('users').where({
            id: req.session.user.id
        }).update({
            mail: req.body.mail,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address
        }).catch(err => {throw new Error("Internal Error")} );
        const user = await knex('users').where({
            id: req.session.user.id}).catch(err => {throw new Error("Internal Error")} );
        await res.send({ status: 200, user: user[0] });
    }

    static async getMe(req, res) {
        if (!req.session.user) {
            throw new Error("Not connected");
        }
        const user = await knex('users').where({
            id: req.session.user.id
        }).catch(err => {throw new Error("Internal Error")} );
        await res.send({ status: 200, user: user[0] });
    }
}

module.exports = User