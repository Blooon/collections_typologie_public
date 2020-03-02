const knex = require('./knex.utils');
const express = require('express');
const middlewares = require('./middlewares.utils');
const onceModel = require('./once.model');

class Static {
    constructor(key, champs, langues) {
        this.key = key;
        this.champs = champs;
        this.langues = langues;
        this.router = express.Router();
        this.setRoads();
    }

    setRoads() {
        if (this.adminPath) {
            this.router.use(`/admin/${this.key}`, middlewares.isAdmin);
        }
        this.router.get(`/once/${this.key}`, (req, res) => this.getOnceItem(req, res))
        this.router.put(`/admin/once/${this.key}`, (req, res) => this.updateOnceItem(req, res))
    }

    async updateOnceItem(req, res) {
        await onceModel.updateOnce(JSON.stringify(req.body), this.key);
        const once = await onceModel.getOnce(this.key)
        await this.renderResponse(once, res);
    }

    async getOnceItem(req, res) {
        const once = await onceModel.getOnce(this.key)
        await this.renderResponse(JSON.parse(once.data), res);
    }


    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }


}

module.exports = Static