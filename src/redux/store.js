import { createStore } from 'redux';
import update from 'immutability-helper';
import deepcopy from 'deepcopy';
import { cardKeys, generateInitialPiles, updatePileCardStyle, isEmpty } from '../helper/helper';


const {piles, deck} = generateInitialPiles();

const initialState = {
    cardKeys,
    piles,
    deck,
    deckShow: [],
    deckHead: deck[deck.length - 1].id, // deck head card should be the third card from last of the deck
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'RESET_STATE':
            const {piles: newPiles, deck: newDeck} = generateInitialPiles();
            return update(state, {
                piles: {
                    $set: newPiles
                },
                deck: {
                    $set: newDeck
                }
            });
        case 'PULL_FROM_DECK':
            const { payload: topCardId } = action;
            const topCardIndex = state.deck.findIndex(card => card.id === topCardId);
            const { length: deckTotal } = state.deck;
            let updatedDeck;
            const deckShow = [];
            
            // Get the clicked card from the deck top
            if (typeof state.deck[topCardIndex] !== 'undefined') {
                updatedDeck = update(state.deck, {
                    [topCardIndex]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - topCardIndex + 1, transform: `translate3d(0px, 130px, 10px)`}}
                    }
                });
                deckShow.push(state.deck[topCardIndex].id);
            }

            // Check if exists and take the top second card from the deck set
            if (typeof state.deck[topCardIndex - 1] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 1]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - topCardIndex, transform: `translate3d(-20px, 130px, 10px)`}}
                    }
                });
                deckShow.push(state.deck[topCardIndex - 1].id);
            }

            // Check if exists and take the top third card from the deck set
            if (typeof state.deck[topCardIndex - 2] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 2]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - 1 - topCardIndex, transform: `translate3d(-40px, 130px, 10px)`}}
                    }
                });
                deckShow.push(state.deck[topCardIndex - 2].id);
            }

            const copyDeckShow = deepcopy(state.deckShow);
            const updatedDeckShow = [...deckShow, ...copyDeckShow];
            
            let deckHead = '';
            if (typeof updatedDeckShow !== 'undefined' && updatedDeckShow.length > 0) {
                deckHead = updatedDeckShow[0];
            }
            
            return update(state, {
                deck: {$set: updatedDeck},
                deckShow: {$set: updatedDeckShow},
                deckHead: {$set: deckHead}
            });
        
        case 'CARD_SWAP':
            const {dragItemId, dragItemPile, dropItemId, dropItemPile} = action.payload;
            const copyPiles = deepcopy(state.piles);
            const copyDeck = deepcopy(state.deck);

            if (dragItemPile === -1) {
                const { deck, piles } = swapDeck2Pile(copyDeck, copyPiles, dragItemId, dropItemPile);
                
                const updatedDeckShow2 = update(state, {
                    deckShow: {$splice: [[0, 1]]}
                });
                let deckHead = state.deckHead;
                if (typeof updatedDeckShow2.deckShow !== 'undefined' && updatedDeckShow2.deckShow.length > 0) {
                    deckHead = updatedDeckShow2.deckShow[0];
                }

                return update(state, {
                    deck: {$set: deck},
                    piles: {$set: piles},
                    deckShow: {$set: updatedDeckShow2.deckShow},
                    deckHead: {$set: deckHead}
                });
            } else if(dragItemPile > 0) {
                const p2pPiles = swapPile2Pile(copyPiles, dragItemId, dropItemId, dragItemPile, dropItemPile);
                return update(state, {
                    piles: {$set: updatePileCardStyle(p2pPiles, dropItemPile)}
                });
            }
            return state;
        case 'VISIBILITY_TOGGLE':
            const {id: draggingCardId, pileNo: draggingPileNo, status: cardStatus} = action.payload;
            if (draggingPileNo < 0) return state;

            const cloneVisibilityPiles = deepcopy(state.piles);
            const selectedPile = cloneVisibilityPiles[ draggingPileNo - 1];
            const { cards: selectedCards } = selectedPile;
            const selectedCardIndex = selectedCards.findIndex(card => card.id === draggingCardId);
            
            const updatedPilesVisibility = selectedCards.map((card, index) => {
                if (index > selectedCardIndex) {
                    card.style.visibility = cardStatus ? 'visible' : 'hidden';
                }
                return card;
            });

            return update(state, {
                piles: {
                    [draggingPileNo - 1]: {
                        cards: {$set: updatedPilesVisibility}
                    }
                }
            });
        case 'RESET_DECK':
            let deckCopy = deepcopy(state.deck);
            deckCopy = deckCopy.map((card, index) => {
                card.frontView = false;
                card.style = {marginTop: `${index}px`, marginLeft: `${index}px`};
                return card;
            });
            return update(state, {
                deck: {$set: deckCopy}
            });
        default: 
            return state;
    }
};

/**
 * Swap a card from deck to pile
 * @param   array   deck    deck cards
 * @param   array   piles   piles array
 * 
 * @return  array   updated piles and deck
 */
const swapDeck2Pile = (deck, piles, dragCardId, pileNo) => {
    const cardToMove = deck.filter(card => card.id === dragCardId)[0];
    const cardIndex = deck.findIndex(card => card.id === dragCardId);

    // remove card existing style
    cardToMove.style = {};
    cardToMove.position = 'pile';

    const updatedPiles = update(piles, {
        [pileNo - 1]: {
            cards: {$push: [cardToMove]}
        }
    });
    
    const updatedDeck = update(deck, {$splice: [[cardIndex, 1]]});

    const finalPiels = updatePileCardStyle(updatedPiles, pileNo);
    
    return {
        deck: updatedDeck,
        piles: finalPiels
    };
};


const swapPile2Pile = (piles, dragId, dropId, dragPile, dropPile) => {
    const dragCardIndex = piles[dragPile - 1].cards.findIndex(card => card.id === dragId);
    const dragCard      = piles[dragPile - 1].cards[dragCardIndex];
    dragCard.style = {};

    // Remove all the cards from dragging one to all below-
    const pilesAfterRemove = piles[dragPile - 1].cards.filter((card, index) => index < dragCardIndex);
    const removedCards = piles[dragPile - 1].cards.filter((card, index) => index >= dragCardIndex);
    
    const updatedPiles = update(piles, {
        [dragPile - 1]: {
            cards: {$set: pilesAfterRemove}
        },
        [dropPile - 1]: {
            cards: {$push: removedCards}
        }
    });
    
    if (!isEmpty(updatedPiles[dragPile - 1]) && 
        !isEmpty(updatedPiles[dragPile - 1].cards[updatedPiles[dragPile - 1].cards.length - 1])) {
            updatedPiles[dragPile - 1].cards[updatedPiles[dragPile - 1].cards.length - 1].frontView = true;
    }

    return updatedPiles;
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;