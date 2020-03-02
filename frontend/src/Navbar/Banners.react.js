import React from 'react';
import requestUtils from '../Utils/request.utils';
import { Link } from 'react-router-dom';


export default class Banners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            banners: [],
        }
        this.loadBanners = this.loadBanners.bind(this);   
        this.loadBanners();
    }

    async loadBanners() {
        try {
            const body = await requestUtils.get('/banners');
            this.setState({
                banners: body.data
            })
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        const banners = this.state.banners.map(banner => {
            if (banner.printBanner === 'true'){
                return <article key={banner.id} className="banner w3-col s12">
                        <p className="animation w3-col l12 w3-center">
                            <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow" />
                            <Link className="" to={banner['link']}> {banner['caption' + this.props.lang]}</Link>
                        </p>
                    </article>
            }
            return null;
        });

        return <>
            {banners}
        </>
    }
}
