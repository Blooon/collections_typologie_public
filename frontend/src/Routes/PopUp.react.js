import React from 'react';
import { Link } from "react-router-dom";
import requestUtils from '../Utils/request.utils';

export default class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popups: [],
      open: true,
    }  
    this.loadPopUp = this.loadPopUp.bind(this);   
    this.loadPopUp();
  }

  renderContent(content) {
    if (content !== undefined && content !== null) {
      content = content.split('§')
      const render = content.map((part, index) => {
        if (index === content.length-1) {
          return <span key={index}>{part}</span>
        }
        return <span key={index}>{part}<br/></span>
      })
      return render
    }
    return null
  }

  async loadPopUp() {
    try {
      const body = await requestUtils.get('/pop_ups');
      this.setState({
        popups: body.data
      });
    }
    catch(err) {
      this.setState({ error: err.message })
    }
  }

  changeSrc = () => {
    const popups = this.state.popups;
    const tmp = popups[0].cover;
    popups[0].cover = popups[0].back;
    popups[0].back = tmp;
    this.setState({ popups });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const popup = this.state.popups[0];
    return this.state.open && popup && this.props.location.pathname === '/' ? (
      <div className="popup w3-modal">
        <div className="popup-inner w3-modal-content">
          <div className="popup-bar w3-bar w3-padding-24 w3-padding" >
            <button onClick={this.handleClose} className="close-button w3-bar-item w3-display-container">
                <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="close"/>
            </button>
            <p className="home w3-bar-item w3-left">{this.props.title}</p>
            <button onClick={() => this.props.changeLang() } className="lang-button w3-bar-item w3-right">
              <u>{(this.props.lang === '_fr') ? 'En' : 'Fr'}</u>
            </button>
          </div>
          <div className="popup-content w3-row">
            <div className="w3-col l6 noto w3-center">
              <h2 className="noto">{this.renderContent(popup['title' + this.props.lang])}<b className="helvetica">{this.renderContent(popup['book_title' + this.props.lang])}</b></h2>
              <p>{this.renderContent(popup['description' + this.props.lang])}</p>
              <p className="preorder-button">
                <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow" />
                <Link onClick={this.handleClose} to={popup['book_link']}>{(this.props.lang === '_fr') ? 'précommander' : 'pre-order'}</Link>
                <img className="right-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow" />
              </p>
            </div>
            <div className="w3-col l6 w3-center">
              <img className="" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + popup.cover} alt={popup['book_title' + this.props.lang]} onMouseOver={this.changeSrc} onMouseOut={this.changeSrc}/>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}