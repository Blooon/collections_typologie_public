import React from 'react';
import requestUtils from '../Utils/request.utils';



export default class AdminElem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data: {},
            order: 1,
        }
        this.fileReader = {}
        this.onSubmit = this.onSubmit.bind(this);
        this.submitFile = this.submitFile.bind(this);
        this.submitImage = this.submitImage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.setNewOrder = this.setNewOrder.bind(this);
        // this.props.items.map((item) => {
        //     this.state.newElem[item.name] = '';
        // });
        this.loadData()
    }

    async loadData() {
        try {
            const body = await requestUtils.get(`/admin/${this.props.name}/${this.props.match.params.itemId}`);
            if (body.data.images) {
                body.data.order = body.data.images.length+1
            }
            this.setState({data: body.data,});
        }
        catch (err) {
            console.log(err);
        }
    }

    handleFileRead(e, filename, itemName) {
        this.state.data[itemName] = {name: filename, data: e.target.result}
    }

    async fileChange(e, itemName) {
        if (!e.target.files[0]) {
            return;
        }
        const filename = e.target.files[0].name;
        this.fileReader = new FileReader();
        this.fileReader.onloadend = (e) => {this.handleFileRead(e, filename, itemName)};
        this.fileReader.readAsDataURL(e.target.files[0]);

    }

    createRender() {
        const elem = this.props.items.map((item) => {
            if (item.type === 'text') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input type="text" name={item.name} value={this.state.data[item.name]} onChange={this.onChange} />
                </div>
            }
            if (item.type === 'number') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input type="number" name={item.name} value={this.state.data[item.name]} onChange={this.onChange} />
                </div>
            }
            else if (item.type === 'file') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input type="file" name={item.name} onChange={(e) => this.fileChange(e, item.name)}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + `${this.state.data[item.name]}`} tag={item.name} alt={item.name}/>
                </div>
            }
            return null
        });
        return elem;
    }


    async onSubmit(event) {
        event.preventDefault();
        try {
            this.state.modifierConfirmation = null;
            await requestUtils.put(`/admin/${this.props.name}/${this.props.match.params.itemId}`, this.state.data);
            this.loadData();
            this.setState({modifierConfirmation: "Success !"})
            setTimeout(()=> this.setState({modifierConfirmation: null}), 1000)

        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    onChange(event) {
        const data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({ data });
    }

    async submitFile(event) {
        event.preventDefault();
        try {
            this.state.data.file.order = this.state.order;
            await requestUtils.post(`/admin/${this.props.name}/${this.props.match.params.itemId}/file`,{
                file: this.state.data.file,
            });
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    async submitImage(event) {
        event.preventDefault();
        try {
            await requestUtils.post(`/admin/${this.props.name}/${this.props.match.params.itemId}/image`,{
                file_small: this.state.data.file_small,
                file_medium: this.state.data.file_medium,
                file_large: this.state.data.file_large,
                order: this.state.order
            });
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    async deleteFile(event, fileId) {
        event.preventDefault();
        try {
            // this.state.data.file.order = this.state.order;
            await requestUtils.delete(`/admin/${this.props.name}/${this.props.match.params.itemId}/file/${fileId}`);
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }


    async deleteImage(event, imageId) {
        event.preventDefault();
        try {
            // this.state.data.file.order = this.state.order;
            await requestUtils.delete(`/admin/${this.props.name}/${this.props.match.params.itemId}/image/${imageId}`);
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    async setNewOrder(e, file) {
        try {
            this.state.confirmationNewOrder = null;
            await requestUtils.put(`/admin/${this.props.name}/${this.props.match.params.itemId}/image/${file.id}`, {order: e.target.value});
            this.loadData();
            this.setState({ confirmationNewOrder: "Order saved !" })
            setTimeout(()=> this.setState({confirmationNewOrder: null}), 400)
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)
        }
    }

    render() {
        let error = null;
        if (this.state.error) {
            error = <p>{this.state.error}</p>
        }
        const elem = this.createRender();
        let fileForm = null;
        let imagesForm = null;
        let files = null;
        let images = null;
        if (this.props.listFiles && this.state.data.files) {
            fileForm = <div>
                <h2 className="noto">Ajouter un fichier au diapo</h2>
                <form onSubmit={this.submitFile}>
                    <div>
                        <p className="helvetica w3-show-inline-block">File n°</p>
                        <input type="number" name='order' value={this.state.order} onChange={this.onChange} required/>
                    </div>
                    <input type="file" name='file' onChange={(e) => this.fileChange(e, 'file')} required/>
                    <input type="submit" value ="Ajouter" />
                </form>
            </div>
            files = this.state.data.files.map((file) => {
                return <>
                <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.filename} tag={file.name} alt={file.name}/>
                <button onClick={(e) => this.deleteFile(e, file.id)}>supprimer</button>
                </>
            });
        }
    
        if (this.props.listImages && this.state.data.images) {
            imagesForm = <div>
                <h2 className="noto">Ajouter une image au diapo</h2>
                <form onSubmit={this.submitImage}>
                    <div>
                        <p className="helvetica w3-show-inline-block">Image n°</p>
                        <input type="number" name='order' value={this.state.data.order} onChange={this.onChange} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Petit format ({(this.props.name === 'typologie') ? '568 x 359 px' : '536 x 356 px'})</p>
                        <input type="file" name='file' onChange={(e) => this.fileChange(e, 'file_small')} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Moyen format ({(this.props.name === 'typologie') ? '992 x 627 px' : '928 x 617 px'})</p>
                        <input type="file" name='file' onChange={(e) => this.fileChange(e, 'file_medium')} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Grand format ({(this.props.name === 'typologie') ? '1251 x 791 px' : '1175 x 781 px'})</p>
                        <input type="file" name='file' onChange={(e) => this.fileChange(e, 'file_large')} required/>
                    </div>
                    <input type="submit" value ="Ajouter" />
                </form>
            </div>
            images = this.state.data.images.map((file) => {
                return <div key={file.id}>
                    <input type="number" name='order' value={file.ordered} onChange={(e) => this.setNewOrder(e, file)} required/>                
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.small} tag={file.name} alt={file.name}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.medium} tag={file.name} alt={file.name}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.large} tag={file.name} alt={file.name}/>
                    <button onClick={(e) => this.deleteImage(e, file.id)}>supprimer</button>
                </div>
            });
        }
        
        return <div className="w3-row-padding">
            <div className="noto w3-center">{error}</div>
            <article className="w3-col l6">
                <h2 className="noto">Modifier {this.props.name} {this.state.data.id}</h2>
                <form onSubmit={this.onSubmit}>
                    {elem}
                    <p>{this.state.modifierConfirmation}</p>
                    <input className="w3-panel" type="submit" value="Modifier" />
                </form>
            </article>
            <article className="w3-col l6">
                {fileForm}
                {imagesForm}
                <div className="w3-padding-16">
                    {files}
                    <p>{this.state.confirmationNewOrder}</p>
                    {images}
                </div>
            </article>
        </div>
    }
}