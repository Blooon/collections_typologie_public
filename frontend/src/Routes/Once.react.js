import React from 'react';
import requestUtils from '../Utils/request.utils';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Once extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            data: {
                fr: {},
                en: {}
            },
        }
        this.loadData = this.loadData.bind(this);
        this.onEnChange = this.onEnChange.bind(this);
        this.onFrChange = this.onFrChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.loadData();
        
    }

    async loadData() {
        try {
            const body = await requestUtils.get(`/once/${this.props.keyValue}`);
            this.setState({ data: body.data });
        }
        catch (err) {
            console.log(err);
            // this.setState({ error: err.message });
        }
    }

    onEnChange(event) {
        const data = this.state.data;
        data.en[event.target.name]= event.target.value;
        this.setState({ data });
    }

    onFrChange(event) {
        const data = this.state.data;
        data.fr[event.target.name]= event.target.value;
        this.setState({ data });
    }

    async onSubmit(event) {
        event.preventDefault();
        try {
            await requestUtils.put(`/admin/once/${this.props.keyValue}`,this.state.data);
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
        }
    }

    render() {
        const once = this.props.property.map((property) => {
            return <div key={property.name}>               
                <div>
                    <p className="helvetica w3-show-inline-block">{property.name} EN</p>
                    <input placeholder={property.name + ' en Anglais'} type='text' name={property.name} value={this.state.data.en[property.name]} onChange={this.onEnChange}/>
                </div>
                <div>
                    <p className="helvetica w3-show-inline-block">{property.name} FR</p>
                    <input placeholder={property.name + ' en Français'} type='text' name={property.name} value={this.state.data.fr[property.name]} onChange={this.onFrChange}/>
                </div>
            </div>
        });
        return <article className="w3-col l4">
            <div className="noto w3-center">{this.state.error}</div>
            <h2 className="noto">Modifier le {this.props.keyValue}</h2>
            <form onSubmit={this.onSubmit}>
                {once}
                <input readOnly className="w3-panel" type="submit" value ="Modifier" />
            </form>
        </article>
    }
}