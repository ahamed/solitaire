import cardImages from '../cards';

export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const cardKeys = ["c2", "d2", "h2", "s2", "c3", "d3", "h3", "s3", "c4", "d4", "h4", "s4", "c5", "d5", "h5", "s5", "c6", "d6", "h6", "s6", "c7", "d7", "h7", "s7", "c8", "d8", "h8", "s8", "c9", "d9", "h9", "s9", "c10", "d10", "h10", "s10", "cj", "dj", "hj", "sj", "cq", "dq", "hq", "sq", "ck", "dk", "hk", "sk", "ca", "da", "ha", "sa"];

const keyToCard = (key, frontView = false, position = 'deck', style = {}, cardHelperClasses = '') => {
    return {
        name: 'sample card',
        id: key,
        front: cardImages[key],
        back: cardImages['back'],
        frontView,
        position,
        style,
        cardHelperClasses
    };
};

export const generateInitialPiles = () => {
    const keys = cardKeys;
    const cardIndexes = [];

    // get random 28 cards for initial piles
    for (let i = 0; i < 28; i ++) {
        let cardIndex = keys[getRandom(0, 51)];
        while (cardIndexes.indexOf(cardIndex) > -1) {
            cardIndex = keys[getRandom(0,51)];
        }
        cardIndexes.push(cardIndex);
    }

    // get remaining 24 cards for deck
    let extraCards = keys.filter(key => cardIndexes.indexOf(key) === -1);
    extraCards = shuffle(extraCards);
    extraCards = extraCards.map((ecard, index) => keyToCard(ecard, false, 'deck', {marginTop: `-${index}px`, marginLeft: `${index}px`}));

    let index = 0;
    const piles = [];

    for (let i = 0; i < 7; i ++) {
        let cards = [];
        let pileHead = '';
        for (let j = 0; j < 7 - i; j ++) {
            let frontView = false;
            if (j === 7 - i - 1) {
                frontView = true;
                pileHead = cardIndexes[index];
            }
            let style = {
                marginTop: `${j * 20}px`
            };

            let card = keyToCard(cardIndexes[index], frontView, `pile-${index}`, style);
            index++;

            cards.push(card);
        }

        let cardObj = {};
        cardObj.cards = cards;
        cardObj.pileNo = i + 1;
        cardObj.pileHead = pileHead;
        piles.push(cardObj);

    }
    return {piles, deck: extraCards};
}


export const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const generateDeck = () => {

};