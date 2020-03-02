import React from 'react';
import Step1 from './Step1.react'
import Step2 from './Step2.react'
import Step3 from './Step3.react'

export default class Basket extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            basket: this.props.basket,
            step: 1,
            validatedBasket: {
                items: [],
                typologies: []
            }
        }
        this.setStep = this.setStep.bind(this);
        this.setValidatedBasket = this.setValidatedBasket.bind(this);
    }

    setStep(value) {
        this.setState({ step: this.state.step + value})
    }

    onSuccess(data) {
        console.log('DATA', data);
    }

    onError(data) {
        console.log('ERROR', data);
    }
    
    componentWillUnmount() {
        this.props.setBasketToOut();
    }

    setValidatedBasket(basket, user, user_livraison) {
        this.setState({
            validatedBasket: basket,
            validatedUser: user,
            validatedUserLivraison: user_livraison,
            step: 3
        });
        this.props.setBasket({
            items: [],
            typologies: []
        })
    }

    render() {
        this.props.setBasketToIn();
        let rendered;
        if (this.state.step === 1) {
            rendered = <Step1
                basket={this.props.basket}
                setBasket={this.props.setBasket}
                lang={this.props.lang}
                setStep={this.setStep}/>
        }

        else if (this.state.step === 2) {
            rendered = <Step2 
                basket={this.props.basket}
                setBasket={this.props.setBasket}
                setValidatedBasket={this.setValidatedBasket}
                lang={this.props.lang}
                setStep={this.setStep}/>
        }
        else if (this.state.step === 3) {
            rendered = <Step3
                basket={this.state.validatedBasket}
                user={this.state.validatedUser}
                user_livraison={this.state.validatedUserLivraison}
                lang={this.props.lang}
                setStep={this.setStep}/>
        }
        return <>
            <div className="noto w3-center">{this.state.error}</div>
            {rendered}
        </>
    }
}