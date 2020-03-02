import request from 'superagent';

const baseUrl = process.env.REACT_APP_API_BASE;

class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.message = message
      this.name = "ValidationError";
    }
  }
export default class RequestUtils  {
    static async get(url, query) {
        try {
            const res = await request.get(baseUrl + url).send(query).withCredentials();
            return res.body;
        }
        catch(err) {
            console.log(err);
            if (err.response.body) {
                throw new ValidationError(err.response.body.message);
            }
            throw new ValidationError("Check you internet Connection");
        }
    }
    static async put(url, body) {
        try {
            const res = await request.put(baseUrl + url).send(body).withCredentials();
            return res.body;
        }
        catch(err) {
            console.log(err);
            if (err.response.body) {
                throw new ValidationError(err.response.body.message);
            }
            throw new ValidationError("Check you internet Connection");
        }
    }

    static async post(url, body) {
        try {
            const res = await request.post(baseUrl + url).send(body).withCredentials();
            return res.body;
        }
        catch(err) {
            console.log(err);
            if (err.response.body) {
                throw new ValidationError(err.response.body.message);
            }
            throw new ValidationError("Check you internet Connection");
        }
    }

    static async delete(url, body) {
        try {
            const res = await request.delete(baseUrl + url).send(body).withCredentials();
            return res.body;
        }
        catch(err) {
            console.log(err.response.body);
            if (err.response.body) {
                throw new ValidationError(err.response.body.message);
            }
            throw new ValidationError("Check you internet Connection");
        }
    }
}