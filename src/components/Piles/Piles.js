import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pile from '../Pile';

class Piles extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        
    }

    render() {
        const { piles } = this.props;
        return (
            <div className="solt-piles">
                {piles.map((pile, index) => {
                    return(
                        <Pile key={index + 1} pile={pile} />
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        piles: state.piles
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Piles);