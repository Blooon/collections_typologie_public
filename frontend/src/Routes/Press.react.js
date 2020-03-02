import React from 'react';
import requestUtils from '../Utils/request.utils';
import Login from './Login.react';
import '../w3.css';
import '../stylesheet.css';

export default class Livres extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: null,
            logged: false,
            press: []
        }
        this.getMe = this.getMe.bind(this);
        this.setLogged = this.setLogged.bind(this);
        this.loadLivre = this.loadLivre.bind(this);
        this.loadLivre();
        this.getMe();
    }

    async getMe() {
        try {
            await requestUtils.get('/me');
            this.setState({ logged: true });
        }
        catch (err) {
            console.log(err);
            // this.setState({ error: err.message })
        }
    }
    async setLogged() {
        this.setState({ logged: true })
    }


    async loadLivre() {
        try {
            const body = await requestUtils.get(`/presss`);
            console.log(body);
            this.setState({
                press: body.data,
            });
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    render(match) {
        if (!this.state.logged) {
            return <Login setLogged={this.setLogged}/>
        }
        else {
            return this.state.press.map((dossier) => {
                
                return <section id="Press" className="w3-center w3-padding-24">
                    <h1 className="home-back">{dossier.name}</h1>
                    <a className="w3-bar-item w3-border w3-btn w3-white w3-padding-16" href={process.env.REACT_APP_S3_BUCKET_BASE_URL + dossier.dossier } download>
                        {(this.props.lang === '_fr') ? 'Télécharger' : 'Download'}
                    </a>
                </section>
            })
        }
    }
}