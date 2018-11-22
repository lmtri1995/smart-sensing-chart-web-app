import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Bar, HorizontalBar,Line, Doughnut, Radar, Pie, Polar, Bubble, Scatter } from 'react-chartjs-2';
import { runInThisContext } from 'vm';
class Addchart extends Component {
    constructor(props) {
        super(props);
        this.state={
            type:Bar,
            data:{},
            width:100,
            height:100,
            options:{}
        }
    }

    componentWillMount() {
        var types = Bar
        if(this.props.type === "Bar")
            types = Bar
        if(this.props.type === "HorizontalBar")
            types = HorizontalBar 
        if(this.props.type === "Line")
            types = Line   
        if(this.props.type === "Doughnut")
            types = Doughnut  
        if(this.props.type === "Radar")
            types = Radar 
        if(this.props.type === "Pie")
            types = Pie 
        if(this.props.type === "Polar")
            types = Polar 
        if(this.props.type === "Bubble")
            types = Bubble
        if(this.props.type === "Scatter")
            types = Scatter 
        this.setState({
            type:types,
            data:this.props.data,
            width:(this.props.width != null)?this.props.width:100,
            height:(this.props.height != null)?this.props.height:100,
        })
    }

    componentDidMount() {
       
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data:nextProps.data})
    }
    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {

    }

    render() {
        const Charts = this.state.type
        return (
            <div>
                <Charts 
                    data={this.state.data}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        );
    }
}

Addchart.propTypes = {

};

  export default Addchart