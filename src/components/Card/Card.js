import React, { Component } from 'react'

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    rotateCard = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {currentTarget: el} = event;
        if (!el.classList.contains('is-frontview')) {
            el.classList.add('is-frontview');
        }
    }

    render() {
        const {card, margin} = this.props;
        
        return (
            <div className="solitaire-card" style={{marginTop: margin}}>
                <div className={`solt-card ${card.frontView ? 'is-frontview': ''}`} onClick={this.rotateCard}>
                    <div className="solt-card__face solt-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                    <div className="solt-card__face solt-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                </div>
            </div>
        )
    }
}

export default Card;