import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Once from './Once.react';


export default class Onces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return <Router>
        <div>
            <nav className="nav-back w3-center">
                <Link to={this.props.match.url + '/navbar'}><button className={(this.state.active === 'navbar') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'navbar'})}>Navbar</button></Link>
                <Link to={this.props.match.url + '/footer'}><button className={(this.state.active === 'footer') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'footer'})}>Footer</button></Link>
            </nav>
            <div className="w3-row-padding">
                <Route path={this.props.match.url + '/navbar'} render={(props) => <Once keyValue="navbar" property={[
                    { name: 'title'},
                    { name: 'livre'},
                    { name: 'videos'},
                    { name: 'expositions'},
                    { name: 'about'},
                    { name: 'shop'},
                ]} {...props}/>}/>
                <Route path={this.props.match.url + '/footer'} render={(props) => <Once keyValue="footer" property={[
                    { name: 'contactLink'},
                    { name: 'instagramLink'},
                    { name: 'facebookLink'},
                    { name: 'legalMention'}
                ]}{...props}/>}/>
            </div>
        </div>
    </Router>
    }
}