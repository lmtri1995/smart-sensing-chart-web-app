import React, { Component } from 'react'
import { ButtonGroup,ButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem } from "reactstrap";
import LineChart from "../../Charts/ChartJS/components/RandomeAnimatedLinesLong";
export default class Temperature extends Component {
    constructor(props) {
      super(props)
      this.toggle = this.toggle.bind(this);
      this.state = {
        dropdownOpen:false
      }
    }
  toggle(){
      this.setState({dropdownOpen:!this.state.dropdownOpen})
  }  
  render() {
    return (
        <div className="temperature">
            <div className="row">
                <div className="col">
                    <h4 className="float-left">temperature Trend</h4>
                    <ButtonGroup className="float-right">
                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                        Monitoring Time: 30 mins
                        </DropdownToggle>
                        <DropdownMenu>
                        <DropdownItem>30 Minutes</DropdownItem>
                        <DropdownItem>1 Hour</DropdownItem>
                        <DropdownItem>3 Hour</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                    </ButtonGroup>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                </div>
                <div className="col">
                <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>
                    <div classname="col">
                        <h4>USL/ Value/ LSL</h4>
                        <LineChart />
                    </div>

                </div>
            </div>
        </div>
    )
  }
}
