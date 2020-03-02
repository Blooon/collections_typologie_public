import requestUtils from '../Utils/request.utils';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AdminComponent from './AdminComponent.react';
import Onces from './Onces.react';
import AdminElem from './AdminElem.react';
import AdminCommands from '../Commands/Commands.react';
import Login from './Login.react';

export default class Admin extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: null,
            logged: false
        }
        this.getMe = this.getMe.bind(this);
        this.setLogged = this.setLogged.bind(this);
        this.logout = this.logout.bind(this);
        this.getMe();
    }

    componentDidCatch(err) {
        this.setState({ error: "Internal Error" })
    }

    async setLogged() {
        this.setState({ logged: true })
    }

    async logout() {
        await requestUtils.post('/logout',);
        this.setState({ logged: false });
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

    render(match) {
        if (!this.state.logged) {
            return <Login setLogged={this.setLogged}/>
        }
        return <>
            <Router>
                <section id="Admin">
                    <button className="deconnection w3-right w3-bar-item w3-border w3-btn w3-white" onClick={(e) => this.logout()}>Déconnexion</button>
                    <nav className="nav-back w3-center">
                        <h1 className="home-back">Backoffice de Collections Typologie</h1>
                        <Link to={"/admin/once" }><button className={(this.state.active === 'onces') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'onces'})}>Onces</button></Link>
                        <Link to={"/admin/typologie"}><button className={(this.state.active === 'typos') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'typos'})}>Typologies</button></Link>
                        <Link to={"/admin/videos"}><button className={(this.state.active === 'videos') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'videos'})}>Videos</button></Link>
                        <Link to={"/admin/expo"}><button className={(this.state.active === 'expos') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'expos'})}>Expos</button></Link>
                        <Link to={"/admin/item"}><button className={(this.state.active === 'items') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'items'})}>Items</button></Link>
                        <Link to={"/admin/about/1"}><button className={(this.state.active === 'about') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'about'})}>About</button></Link>
                        <Link to={"/admin/news"}><button className={(this.state.active === 'news') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'news'})}>News</button></Link>
                        <Link to={"/admin/popup"}><button className={(this.state.active === 'popup') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'popup'})}>Pop Up</button></Link>
                        <Link to={"/admin/banner"}><button className={(this.state.active === 'banner') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'banner'})}>Banners</button></Link>
                        <Link to={"/admin/press" }><button className={(this.state.active === 'press') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'press'})}>Press</button></Link>
                        <Link to={"/admin/commands" }><button className={(this.state.active === 'commands') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'commands'})}>Commandes</button></Link>
                    </nav>
                    <div className="noto w3-center">{this.state.error}</div>
                    <Route path="/admin/once" component={Onces}/>
                    <Route exact path={"/admin/typologie"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "number", type: "number"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "tooltip1_fr", type: "text"},
                            {name: "tooltip1_en", type: "text"},
                            {name: "tooltip2_fr", type: "text"},
                            {name: "tooltip2_en", type: "text"},
                            {name: "tooltip_color", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "content1_fr", type: "text"},
                            {name: "content1_en", type: "text"},
                            {name: "content2_fr", type: "text"},
                            {name: "content2_en", type: "text"},
                            {name: "content3_fr", type: "text"},
                            {name: "content3_en", type: "text"},
                            {name: "shop_description_fr", type: "text"},
                            {name: "shop_description_en", type: "text"},
                            {name: "discount_caption_fr", type: "text"},
                            {name: "discount_caption_en", type: "text"},
                            {name: "price", type: "number"},
                            {name: "fee_france", type: "number"},
                            {name: "fee_europe", type: "number"},
                            {name: "fee_world", type: "number"},
                            {name: "stock_fr", type: "number"},
                            {name: "stock_en", type: "number"},
                            {name: "release_date", type: "text"},
                            {name: "shop_width", type: "number"},
                            {name: "printBook", type: "text"},
                            {name: "sticker", type: "file"},
                            {name: "shop_sticker", type: "file"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='typologie'
                        listFiles={false}
                        listImages={true}
                        unique={false}
                        {...props}/>
                    }}/>

                    <Route exact path={"/admin/videos"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "number", type: "number"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                            {name: "poster", type: "file"},
                            {name: "video", type: "file"},
                        ]} name='video'
                        listFiles={false}
                        listImages={false}
                        unique={false}
                        {...props}/>
                    }}/>
                    
                    <Route exact path={"/admin/expo"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "number", type: "number"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='expo'
                        listFiles={false}
                        listImages={true}
                        unique={false}
                        {...props}/>
                    }}/>

                    <Route exact path={"/admin/press"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "name", type: "text"},
                            {name: "dossier", type: "file"},
                        ]} name='press'
                        listFiles={false}
                        listImages={false}
                        unique={false}
                        {...props}/>
                    }}/>
                    
                    <Route exact path={"/admin/press/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "name", type: "text"},
                            {name: "dossier", type: "file"},
                        ]} name='press'
                        unique={false}
                        listFiles={true}
                        listImages={false} {...props}/>
                    }}/>
                    <Route exact path={"/admin/popup"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "title_fr", type: "text"},
                            {name: "title_en", type: "text"},
                            {name: "book_title_fr", type: "text"},
                            {name: "book_title_en", type: "text"},
                            {name: "book_link", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='pop_up' 
                        unique={true}
                       listImages={false}
                        {...props}/>
                   }}/>

                    <Route exact path={"/admin/item"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "number", type: "number"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "type_fr", type: "text"},
                            {name: "type_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "price", type: "number"},
                            {name: "fee_france", type: "number"},
                            {name: "fee_europe", type: "number"},
                            {name: "fee_world", type: "number"},
                            {name: "stock", type: "number"},
                            {name: "release_date", type: "text"},
                            {name: "shop_width", type: "number"},
                            {name: "sticker", type: "file"},
                        ]} name='item'
                        unique={false} {...props}/>
                    }}/>
                     <Route exact path={"/admin/about/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "info_fr", type: "text"},
                            {name: "info_en", type: "text"},
                            {name: "contact_fr", type: "text"},
                            {name: "contact_en", type: "text"},
                            {name: "credits_fr", type: "text"},
                            {name: "credits_en", type: "text"},
                            {name: "small", type: "file"},
                            {name: "medium", type: "file"},
                            {name: "large", type: "file"},
                        ]} name='about' 
                        unique={true}
                        listImages={false}
                         {...props}/>
                    }}/>
                    <Route exact path={"/admin/news"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "title_fr", type: "text"},
                            {name: "title_en", type: "text"},
                            {name: "ligne1_fr", type: "text"},
                            {name: "ligne1_en", type: "text"},
                            {name: "content_fr", type: "text"},
                            {name: "content_en", type: "text"},
                            {name: "banner_fr", type: "text"},
                            {name: "banner_en", type: "text"},
                            {name: "bannerLink_fr", type: "text"},
                            {name: "bannerLink_en", type: "text"},
                            {name: "printBanner", type: "text"},
                        ]} name='new'
                        unique={false}
                        {...props}/>
                    }}/>
                    <Route exact path={"/admin/banner"} render={(props) => {
                        return <AdminComponent items={[
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "link", type: "text"},
                            {name: "printBanner", type: "text"},
                        ]} name='banner'
                        unique={false}
                        {...props}/>
                    }}/>
                    <Route exact path={"/admin/popup/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "title_fr", type: "text"},
                            {name: "title_en", type: "text"},
                            {name: "book_title_fr", type: "text"},
                            {name: "book_title_en", type: "text"},
                            {name: "book_link", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='pop_up' 
                        unique={true}
                       listImages={false}
                        {...props}/>
                   }}/>

                    <Route exact path={"/admin/typologie/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "number", type: "number"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "tooltip1_fr", type: "text"},
                            {name: "tooltip1_en", type: "text"},
                            {name: "tooltip2_fr", type: "text"},
                            {name: "tooltip2_en", type: "text"},
                            {name: "tooltip_color", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "content1_fr", type: "text"},
                            {name: "content1_en", type: "text"},
                            {name: "content2_fr", type: "text"},
                            {name: "content2_en", type: "text"},
                            {name: "content3_fr", type: "text"},
                            {name: "content3_en", type: "text"},
                            {name: "shop_description_fr", type: "text"},
                            {name: "shop_description_en", type: "text"},
                            {name: "discount_caption_fr", type: "text"},
                            {name: "discount_caption_en", type: "text"},
                            {name: "price", type: "number"},
                            {name: "fee_france", type: "number"},
                            {name: "fee_europe", type: "number"},
                            {name: "fee_world", type: "number"},
                            {name: "stock_fr", type: "number"},
                            {name: "stock_en", type: "number"},
                            {name: "release_date", type: "text"},
                            {name: "shop_width", type: "number"},
                            {name: "printBook", type: "text"},
                            {name: "sticker", type: "file"},
                            {name: "shop_sticker", type: "file"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='typologie'
                        listFiles={false}
                        listImages={true}
                        unique={false}
                        {...props}/>
                    }}/>

                    <Route exact path={"/admin/videos/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "number", type: "text"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                            {name: "poster", type: "file"},
                            {name: "video", type: "file"},
                        ]} name='video'
                        unique={false}
                        listFiles={false}
                        listImages={false} {...props}/>
                    }}/>

                    <Route exact path={"/admin/expo/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "number", type: "text"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "cover", type: "file"},
                            {name: "back", type: "file"},
                        ]} name='expo'
                        unique={false}
                        listFiles={false}
                        listImages={true} {...props}/>
                    }}/>
                    
                    <Route exact path={"/admin/item/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "number", type: "text"},
                            {name: "name_fr", type: "text"},
                            {name: "name_en", type: "text"},
                            {name: "type_fr", type: "text"},
                            {name: "type_en", type: "text"},
                            {name: "description_fr", type: "text"},
                            {name: "description_en", type: "text"},
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "price", type: "number"},
                            {name: "fee_france", type: "number"},
                            {name: "fee_europe", type: "number"},
                            {name: "fee_world", type: "number"},
                            {name: "stock", type: "number"},
                            {name: "release_date", type: "text"},
                            {name: "shop_width", type: "number"},
                            {name: "sticker", type: "file"},
                        ]} name='item'
                        listImages={true}
                        unique={false} {...props}/>
                    }}/>
                    <Route exact path={"/admin/news/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "title_fr", type: "text"},
                            {name: "title_en", type: "text"},
                            {name: "ligne1_fr", type: "text"},
                            {name: "ligne1_en", type: "text"},
                            {name: "content_fr", type: "text"},
                            {name: "content_en", type: "text"},
                            {name: "banner_fr", type: "text"},
                            {name: "banner_en", type: "text"},
                            {name: "bannerLink_fr", type: "text"},
                            {name: "bannerLink_en", type: "text"},
                            {name: "printBanner", type: "text"},
                        ]} name='new'
                        unique={false}
                        {...props}/>
                    }}/>

                    <Route exact path={"/admin/banner/:itemId"} render={(props) => {
                        return <AdminElem items={[
                            {name: "caption_fr", type: "text"},
                            {name: "caption_en", type: "text"},
                            {name: "link", type: "text"},
                            {name: "printBanner", type: "text"},
                        ]} name='banner'
                        unique={false}
                        {...props}/>
                    }}/>

                    <Route path={"/admin/commands"} component={AdminCommands} />
                </section>
            </Router>
        </>
    }
}