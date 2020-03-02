import React from 'react';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printNewsletter: false
        }
    }
   
    render() {
        let text = this.props.text;
        let footer = null;

        if (!this.state.printNewsletter) {
            footer = <>
                <a className="w3-bar-item" href={"mailto:" + text.contactLink}>{text.contactLink}</a>
                <button onClick={() => this.setState({ printNewsletter: !this.state.printNewsletter})} className="w3-bar-item">newsletter</button>
                <a className="w3-bar-item" href={text.instagramLink} target="_blank" rel="noopener noreferrer">instagram</a>
                <a className="w3-bar-item" href={text.facebookLink} target="_blank" rel="noopener noreferrer">facebook</a>
            </>
        } else {
            footer = <>
                <button onClick={() => this.setState({ printNewsletter: !this.state.printNewsletter})} id="Newsletter" className="w3-bar-item">newsletter</button>
                {/* Begin Mailchimp Signup Form */}
                <div id="mc_embed_signup" className="w3-bar-item">
                    <form action="https://collectionstypologie.us19.list-manage.com/subscribe/post?u=5a369da8555fc7bc5c5fd3783&amp;id=b1033bb1ea" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate w3-bar" target="_blank" noValidate autoComplete="on">
                        <div id="mc_embed_signup_scroll">
                            <div className="mc-field-group w3-bar-item">
                                <label htmlFor="mce-EMAIL">{(this.props.lang === '_fr') ? 'e-mail' : 'e-mail'} : </label>
                                <input type="email" name="EMAIL" className="required email w3-border-0" id="mce-EMAIL" required autoFocus/>
                            </div>
                            <div className="mc-field-group w3-bar-item">
                                <label htmlFor="mce-FNAME">{(this.props.lang === '_fr') ? 'prénom' : 'first name'} : </label>
                                <input type="text" name="FNAME" className="w3-border-0" id="mce-FNAME"/>
                            </div>
                            <div className="mc-field-group w3-bar-item">
                                <label htmlFor="mce-LNAME">{(this.props.lang === '_fr') ? 'nom' : 'last name'} : </label>
                                <input type="text" name="LNAME" className="w3-border-0" id="mce-LNAME"/>
                            </div>
                            <div id="mce-responses" className="clear w3-bar-item">
                                <div className="response" id="mce-error-response"></div>
                                <div className="response" id="mce-success-response"></div>
                            </div>
                            {/* Real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                            <div id="mc-donotfill" aria-hidden="true">
                                <input type="text" name="b_5a369da8555fc7bc5c5fd3783_b1033bb1ea" tabIndex="-1"/>
                            </div>
                            <div className="clear w3-bar-item">
                                <input type="submit" value={(this.props.lang === '_fr') ? "s'inscrire" : "subscribe"} name="subscribe" id="mc-embedded-subscribe" className="button"/>
                            </div>
                        </div>
                    </form>
                </div>
                {/* End mc_embed_signup */}
            </>
        }

        return <footer id="Footer" className="w3-hide-small w3-hide-medium w3-container w3-padding-16">
              <div className="w3-bar">
                  <div className="w3-left">
                      {footer}
                  </div> 
                  <a className="w3-bar-item w3-right" href="/legal">{text.legalMention}</a>
              </div>
          </footer>

    }
}
