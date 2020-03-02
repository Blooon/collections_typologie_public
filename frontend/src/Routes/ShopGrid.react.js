import React from 'react';
import '../w3.css';
import '../stylesheet.css';
import ShopBook from './ShopBook.react';
import ShopItem from './ShopItem.react';

export default class ShopGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nbArticles: 3,
        }
    }

    updateDimensions() {
        const { nbArticles } = this.state;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        
        if (w <= 992 && nbArticles === 3) {
            this.setState({ nbArticles: 2 });
        } else if (w > 992 && nbArticles === 2) {
            this.setState({ nbArticles: 3 });            
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    renderGrid() {
        const { nbArticles } = this.state;
        const grid = [];
        let row = [];
        let width = 0;
        this.props.data.forEach((elem, index) => {
            width += elem.shop_width ? elem.shop_width : 1;
            row.push(elem)
            if (width === nbArticles || index === this.props.data.length-1) {
                grid.push(
                    <div key={index} className="w3-row w3-content">
                        {this.props.typologies
                          ? row.map(rowElem => <ShopBook key={rowElem.id} typologie={rowElem} {...this.props} />)
                          : row.map(rowElem => <ShopItem key={rowElem.id} item={rowElem} {...this.props} />)}
                    </div>
                );
                row = [];
                width = 0;
            }
        });
        return grid;
    }

    render() {
        return <>
            <div className={`shop w3-container w3-row${this.props.typologies ? " w3-padding-24" : ""}`}>
                <h1 className="w3-container">{this.props.title}</h1>
                {this.renderGrid()}
            </div>
        </>  
    }
}