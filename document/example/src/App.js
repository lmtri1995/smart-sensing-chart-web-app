import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { connect } from 'react-redux'
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import Download from './Download.excel';
import i18n from './i18n';
import { withNamespaces } from 'react-i18next';
import AddTodo from './containers/AddTodo'
import { fetchData } from './actions/action';
import { saveGridLayoutToStore,getDataFailure_chart } from './actions/gridLayoutAction';
import AddChart from "./components/Addchart";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { addTodo,update_chart } from './actions/'
class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      data:'0',
      chart_data: {},
      GridLayout:[],
      modal: false,
      optionValue:0
    }
    this.eventSource = new EventSource("http://localhost:5000/events");
    this.eventSource_chart = new EventSource("http://localhost:5001/chart_events");
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.addHandle = this.addHandle.bind(this)
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  componentWillMount(){
    this.eventSource.onmessage = e =>
          this.updateFlightState(JSON.parse(e.data));
    this.eventSource_chart.onmessage = e =>
          this.updateChartState(JSON.parse(e.data));
    this.props.saveGridLayoutToStore()
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nexProps){
    console.log('componentWillReceiveProps',nexProps.dataGrid)
    this.setState({
      data:nexProps.todos[0].text,
      chart_data:nexProps.datasets,
      GridLayout:nexProps.dataGrid.data}
      )}
  
  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }
  updateFlightState(flightState) {
    console.log(flightState);
    this.props.addTodo(flightState.toString())

  }
  updateChartState(flightState) {
    console.log(flightState);
    this.props.update_chart(flightState)

  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  addHandle(){
    var value = {i: this.props.dataGrid.data.length.toString(), x: 0, y: this.props.dataGrid.data.length, w: 3, h: 10,type:this.state.optionValue}
    this.props.getDataFailure_chart(value)
    //this.setState({GridLayout:[...this.state.GridLayout,value]})
  }

  handleChange(event) {
    console.log('change')
    this.setState({optionValue: event.target.value});
  }

  handleSubmit(event){
    console.log('submit')
    this.addHandle()
    this.toggle()
    event.preventDefault();
  }
  onLayoutChange(layout) {
    console.log(layout)
  }
  render() {
    console.log('<=>',this.state.GridLayout)
    // layout is an array of objects, see the demo for more complete usage
  const { t } = this.props;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  const Grid = this.state.GridLayout.map( item =>{
    return <div key={item.i}>
             <AddChart type={item.type} data={this.state.chart_data}  />
            </div>
  })
    return (
      <div className="container-fluid">
        <div>
        <button onClick={() => changeLanguage('ko')}>ko</button>
        <button onClick={() => changeLanguage('en')}>en</button>
        <h1>{t('Welcome to React')}</h1>
        <h2>{this.state.data}</h2>
      </div>
      <Download />
        <GridLayout className="layout" layout={this.state.GridLayout} cols={12} rowHeight={12} width={1920} height={1080} onLayoutChange={this.onLayoutChange}>
        {Grid}
  
        </GridLayout>
          <AddTodo />
          <div>
          <button  onClick={() => this.props.fetchData() }>
              getdata from API
          </button>
          {
            this.props.appData.isFetching && <div>Loading</div>
          }
          {
            this.props.appData.data.length ? (
              this.props.appData.data.map((people, i) => {
                return <div key={i} >
                  <div>Name: {people.name}</div>
                  <div>Age: {people.age}</div>
                </div>
              })
            ) : null
          }
          </div>
          
            <Button color="danger" onClick={this.toggle}> Add</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
            <form onSubmit={this.handleSubmit} >
              <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
              <ModalBody>
              
              <select type="select" name="select" id="exampleSelect" value={this.state.optionValue} onChange={this.handleChange}>
                <option value="Doughnut">Doughnut</option>
                <option  value="Line">Line</option>
                <option  value="Bar">Bar</option>
                <option  value="Radar">Radar</option>
                <option  value="Pie">Pie</option>
                <option  value="Polar">Polar</option>
                <option  value="Bubble">Bubble</option>
                <option  value="Scatter">Scatter</option>
              </select>
            
              </ModalBody>
              <ModalFooter>
                <Button type="Submit" color="primary">Submit</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
              </form>
            </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => (console.log('map du lieu'),{
  todos: state.todos,
  appData: state.appData,
  datasets:state.update_chart,
  dataGrid:state.dataGrid
})
function mapDispatchToProps (dispatch) {
  return {
    fetchData: () => dispatch(fetchData()),
    saveGridLayoutToStore: () => dispatch(saveGridLayoutToStore()),
    getDataFailure_chart: (data) =>dispatch(getDataFailure_chart(data)),
    addTodo: (value) => dispatch(addTodo(value)),
    update_chart: (value) => dispatch(update_chart(value))
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(App))
