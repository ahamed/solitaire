import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import Card from './Card';

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

    renderItem(item, type) {
        const {card, pileNo} = item;
        console.log(card);
        switch(type) {
            case 'CARD':
                return (
                    <div style={this.getItemStyles(this.props)}>
                        <div 
                            className={`solitaire-card-container hoverable`}
                        >
                            <div className={`solitaire-card is-frontview`}>
                                <div className="solitaire-card__face solitaire-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                                <div className="solitaire-card__face solitaire-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                            </div>
                        </div>
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

export default DragLayer(collect)(CustomDragLayer);