import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import Card from './Card';
import { connect } from 'react-redux';
import deepcopy from 'deepcopy';

class CustomDragLayer extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.layerStyles = {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
        };
    }

    getItemStyles(props) {
        const { currentOffset } = props
        if (!currentOffset) {
          return {
            display: 'none',
          }
        }
      
        const { x, y } = currentOffset
        const transform = `translate(${x}px, ${y}px)`
        return {
          transform: transform,
          WebkitTransform: transform,
        }
    }

    getAllCards = (card, pileNo) => {
        // If card is from deck then return the card
        const display = [];
        const cloneCard = deepcopy(card);

        if (pileNo < 0) {
            cloneCard.style = {};
            display.push(cloneCard);
            return display;
        }

        const piles = deepcopy(this.props.piles);
        const pile = piles[pileNo - 1];
        
        const {cards} = pile;
        const cardIndex = cards.findIndex(item => item.id === card.id);

        cards.splice(0, cardIndex);
        
        // Customize the style of cards for drag preview
        console.log(card);
        let marginTop = 0;
        return cards.map(card => {
            card.style.opacity = 1;
            card.style.marginTop = `${marginTop}px`;
            card.style.visibility = 'visible';
            marginTop += 20;
            return card;
        });
    };

    renderCard = (cards) => {
        return cards.map(card => {
            return (
                <div 
                    className={`solitaire-card-container`}
                    key={card.id}
                    style={card.style}
                >
                    <div className={`solitaire-card is-frontview`}>
                        <div className="solitaire-card__face solitaire-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                        <div className="solitaire-card__face solitaire-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                    </div>
                </div>
            );
        })
    };

    renderItem(item, type) {
        const {card, pileNo} = item;
        switch(type) {
            case 'CARD':
                const cards = this.getAllCards(card, pileNo);
                return (
                    <div style={this.getItemStyles(this.props)}>
                        {this.renderCard(cards)}
                    </div>
                );
            default:
                return null;
        }
    };

    render() {
        const {itemType, isDragging, item} = this.props;
        
        if (!isDragging) {
            return null;
        }

        return (
            <div style={this.layerStyles}>
                {this.renderItem(item, itemType)}
            </div>
        )
    }
}

const collect = (monitor) => {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }
}

const mapStateToProps = (state) => {
    return {
        piles: state.piles
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToggleVisibility: (id, pileNo, status) => {
            const action = {
                type: 'VISIBILITY_TOGGLE',
                payload: {
                    id,
                    pileNo,
                    status
                }
            };
            dispatch(action);
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DragLayer(collect)(CustomDragLayer));