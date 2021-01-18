import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../css/App.css';

class DayFixes extends Component {
    render () {
        return (
            <div className="row">
                {this.props.dayfixes.map((item) => (
                    <div className="dayfix-tile" key={item.id}>
                        <div className="img-container"><img className="cat-pic" src={item.catImage} alt="cat pic" /></div >
                        <div className="joke-text">{item.dadJoke}</div>
                        <div className="row">
                            <div class="col text-center">
                                {this.props.isAuth ?
                                    <button className="btn btn-sm btn-success tile-button" onClick={() => {this.props.postToTwitter(item.id)}}>Post to Twitter</button> : null
                                }
                                <button className="btn btn-sm btn-danger tile-button" onClick={() => {this.props.deleteItem(item.id)}}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}            
            </div>
        );
    }
}

export default DayFixes;