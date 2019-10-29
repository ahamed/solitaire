import React, { Component } from 'react';
import { connect } from 'react-redux';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        
    }

    rotateCard = (event) => {
        event.preventDefault();
        const {currentTarget: el} = event;
        if (!el.classList.contains('is-frontview')) {
            el.classList.add('is-frontview');
        }
    }

    rotateDeckCard = (event, deck, index, deckTotal) => {
        event.preventDefault();
        event.stopPropagation();

        const {currentTarget: el} = event;
        console.log(deck);
        if (deck) {
            if (!el.classList.contains('.is-deck-show')) {
                el.classList.add('is-deck-show');
                el.setAttribute('style', `z-index: ${deckTotal - index}; margin-left: ${deckTotal - index * 2}px;`);
            }
        }
    }

    pullFromDeck = (event) => {
        event.preventDefault();
        const { card: topCard, deck } = this.props;
        if (!deck) return false;
        this.props.dispatchPullFromDeck(topCard.id);
    }

    render() {
        const { 
            card, 
            hoverable = true
        } = this.props;
        
        return (
            <div 
                className={`solitaire-card-container ${card.cardHelperClasses} ${hoverable ? 'hoverable' : ''}`} 
                style={card.style} 
                // onClick={(event) => this.rotateDeckCard(event, deck, index, deckTotal)}
                onClick={this.pullFromDeck}
            >
                <div className={`solitaire-card ${card.frontView ? 'is-frontview' : ''}`}>
                    <div className="solitaire-card__face solitaire-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                    <div className="solitaire-card__face solitaire-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchPullFromDeck: (topCardId) => {
            const action = {
                type: 'PULL_FROM_DECK',
                payload: topCardId
            };
            dispatch(action);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);