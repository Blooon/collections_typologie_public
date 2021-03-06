import React from 'react';
import requestUtils from '../Utils/request.utils';
export default class Commands extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            error :null,
            command: null
        }
        this.loadCommand = this.loadCommand.bind(this);
        this.loadCommand();
    }

    async loadCommand() {
        try {
            const body = await requestUtils.get(`/admin/command/${this.props.match.params.commandId}`)
            this.setState({
                command: body.data
            })
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
        }
    }

    render() {
        const command = this.state.command
        if (!command) {
            return null;
        }
        
        let otherAddress = null; 

        const typologies = this.state.command.basket.typologies.map((typologie) => {
            return <>
            <div className="order-item item">
                <div className="w3-bar">
                    <p className="item-name basket-title w3-left">Typologie ({typologie.lang.substring(1,3)})</p> {/* Remplacer par le type d'article : typologie pour un livre, sinon attribut type pour un objet */}
                    <p className="w3-right">{typologie.price}€</p> {/* Remplacer par le prix de l'article */}
                </div>
                <div className="w3-bar">
                    <p className="w3-left">{typologie.name_fr}</p> {/* Remplacer par le nom de l'article ou nom de typologie associée si objet */}
                    <p className="w3-right">x{typologie.amount}</p> {/* Remplacer par la quantité de l'article */}
                </div>
            </div>
            </>
        });

        const items = this.state.command.basket.items.map((item) => {
            return <>
            <div className="order-item item">
                <div className="w3-bar">
                    <p className="item-name basket-title w3-left">{item.type_fr}</p> {/* Remplacer par le type d'article : typologie pour un livre, sinon attribut type pour un objet */}
                    <p className="w3-right">{item.price}€</p> {/* Remplacer par le prix de l'article */}
                </div>
                <div className="w3-bar">
                    <p className="w3-left">{item.name_fr}</p> {/* Remplacer par le nom de l'article ou nom de typologie associée si objet */}
                    <p className="w3-right">x{item.amount}</p> {/* Remplacer par la quantité de l'article */}
                </div>
            </div>
            </>
        })
        console.log(this.state.command.user_information.user_livraison)

        /* Si l'adresse d'expéditon est différente de l'adresse de facturation */
        if (this.state.command.user_information.user_livraison) {
            otherAddress = <>
            <div id="Other-Address">
                <div className="order-other-address">
                    <p className="w3-padding-16">Livraison à une autre adresse</p>
                </div>
                <div className="order-heading">
                    <p className="">détails d'expédition</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">nom</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user_livraison.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">prénom</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user_livraison.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">pays</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user_livraison.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">Ville</p>
                    <p className="w3-right-align w3-right w3-half" >{this.state.command.user_information.user_livraison.city }</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">Code postal</p>
                    <p className="w3-right-align w3-right w3-half"> {this.state.command.user_information.user_livraison.postal_code }</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">adresse ligne 1</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user_livraison.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">adresse ligne 2</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user_livraison.address2}</p>
                </div>
            </div>
            </>
        }

        return  <section className="order-section w3-row w3-panel">
            <div className="noto w3-center">{this.state.error}</div>
            <div id="Order-Form" className="order-table w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">détails de facturation</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">nom</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">prénom</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">pays</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">ville</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.city}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">adresse ligne 1</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">adresse ligne 2</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.address2}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">code postal</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.postal_code}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">téléphone</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.tel}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">adresse mail</p>
                    <p className="w3-right-align w3-right w3-half">{this.state.command.user_information.user.email}</p>
                </div>
                {otherAddress}
            </div>

            <div className="order-table w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">commande {command.transaction_id}</p>
                </div>
                {typologies}
                {items}
                <div className="total-bar w3-bar">
                    <p className="w3-left">sous-total</p>
                    <p className="w3-right">{this.state.command.price}€</p> {/* Remplacer par le sous total du panier */}
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">expédition</p>
                    <p className="w3-right">{this.state.command.fee}€</p> {/* Remplacer par les frais d'expédition */}
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">total</p>
                    <p className="w3-right">{this.state.command.price + this.state.command.fee}€</p> {/* Remplacer par le total du panier */}
                </div>
            </div>
        </section>
    }
}