import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { connect } from 'react-redux'
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import {Bar,Line, Doughnut} from 'react-chartjs-2';
import Download from './Download.excel';
import i18n from './i18n';
import { withNamespaces } from 'react-i18next';
import AddTodo from './containers/AddTodo'
class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      data:'0'
    }
    //this.eventSource = new EventSource("http://localhost:5000/events");
  }
  // componentDidMount() {
  //   this.eventSource.onmessage = e =>
  //     this.updateFlightState(JSON.parse(e.data));
  // }

  // updateFlightState(flightState) {
  //   console.log(flightState);
  //   this.setState({data:flightState});

  // }
  componentWillReceiveProps(nexProps){
    console.log(nexProps.todos)
    this.setState({data:nexProps.todos[0].text})
  }
  render() {
    console.log('apprender2',this.state.data)
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      {i: 'a', x: 0, y: 0, w: 3, h: 10},
      {i: 'b', x: 1, y: 0, w: 3, h: 10, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 3, h: 10}
    ];
    var data= {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  }
  const { t } = this.props;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
    return (
      <div className="container-fluid">
        <div>
        <button onClick={() => changeLanguage('ko')}>ko</button>
        <button onClick={() => changeLanguage('en')}>en</button>
        <h1>{t('Welcome to React')}</h1>
        <h2>{this.state.data}</h2>
      </div>
      <Download />
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={10} width={1920} height={1080}>
          <div key="a">
            <Bar
              data={data}
              width={500}
              height={500}
              options={{
                  maintainAspectRatio: false
              }}
            />
          </div>
          <div key="b">
            <Line
              data={data}
              width={500}
              height={500}
              options={{
                  maintainAspectRatio: false
              }}
            />
          </div>
          <div key="c"><Doughnut
              data={data}
              width={500}
              height={500}
              options={{
                  maintainAspectRatio: false
              }}
            /></div>
        </GridLayout>
          <AddTodo />
      </div>
      
    )
  }
}
const mapStateToProps = state => ({
  todos: state.todos
})
export default connect(
  mapStateToProps,
  null
)(withNamespaces()(App))
