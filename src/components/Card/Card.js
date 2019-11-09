import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
        const { card: topCard } = this.props;
        if (topCard.position !== 'deck' || topCard.frontView) return false;
        this.props.dispatchPullFromDeck(topCard.id);
    }

    render() {
        const { 
            card, 
            hoverable = true,
            connectDragPreview,
            connectDragSource,
            connectDropTarget,
            isDragging
        } = this.props;
        
        const opacity = isDragging ? 0 : 1;
        card.style = {...card.style, opacity: opacity};
        
        return connectDragPreview(connectDropTarget(connectDragSource(
            <div 
                className={`solitaire-card-container ${card.cardHelperClasses} ${hoverable ? 'hoverable' : ''}`} 
                style={card.style}
                onClick={this.pullFromDeck}
            >
                <div className={`solitaire-card ${card.frontView ? 'is-frontview' : ''}`}>
                    <div className="solitaire-card__face solitaire-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                    <div className="solitaire-card__face solitaire-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                </div>
            </div>
        )));
    }
}

const itemSource = {
    beginDrag: props => {
        return {
            id: props.id,
            index: props.index,
            pileNo: props.pileNo,
            card: props.card
        }
    },
    canDrag: (props, monitor) => {
        if (props.card.frontView) {
            if (props.card.position === 'deck') {
                if (props.card.id !== props.deckHead) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
};

const itemTarget = {
    hover(props, monitor, component) {
        const dragItem = monitor.getItem();
    },
    drop(props, monitor, component) {
        const dragItem = monitor.getItem();
        const {id: dragItemId, pileNo: dragItemPile} = dragItem;
        const {id: dropItemId, pileNo: dropItemPile} = props;
        
        const dragCard = dragItem.card.property;
        const dropCard = props.card.property;
        
        // Check if the card is droppable into the new pile
        if (dropCard.number - dragCard.number === 1 && dragCard.color !== dropCard.color)
            props.dispatchCardSwap(dragItemId, dragItemPile, dropItemId, dropItemPile);
        else 
            return;
    }
};

const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
};

const dropCollect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }
};

const DragSourceDecorator = DragSource('CARD', itemSource, collect);
const DropTargetDecorator = DropTarget(['CARD'], itemTarget, dropCollect);

const mapStateToProps = (state) => {
    return {
        deckHead: state.deckHead
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
        },

        dispatchCardSwap: (dragItemId, dragItemPile, dropItemId, dropItemPile) => {
            const action = {
                type: 'CARD_SWAP',
                payload: {
                    dragItemId,
                    dragItemPile,
                    dropItemId,
                    dropItemPile
                }
            };
            dispatch(action);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DropTargetDecorator(DragSourceDecorator((Card))));