import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addTodo,update_chart } from '../actions'
import Todolist from "../components/TodoList";
// const AddTodo = ({ addTodo }) => {
//   let input

//   return (
    // <div>
    //   <form
    //     onSubmit={e => {
    //       e.preventDefault()
    //       if (!input.value.trim()) {
    //         return
    //       }
    //       addTodo(input.value)
    //       input.value = ''
    //     }}
    //   >
    //     <input ref={node => (input = node)} />
    //     <button type="submit">Add Todo</button>
    //   </form>
    // </div>
//   )
// }
class AddTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.eventSource = new EventSource("http://localhost:5000/events");
        this.eventSource_chart = new EventSource("http://localhost:5001/chart_events");
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      componentDidMount() {
        this.eventSource.onmessage = e =>
          this.updateFlightState(JSON.parse(e.data));
          this.eventSource_chart.onmessage = e =>{
            this.updateChartState(JSON.parse(e.data));
          }
          
      }
      updateFlightState(flightState) {
        console.log(flightState);
        this.props.addTodo(flightState.toString())
    
      }
      updateChartState(flightState) {
        console.log(flightState);
        this.props.update_chart(flightState)
    
      }
      handleSubmit(event){
        console.log('inputvalue',this.state.value)
        event.preventDefault()
            if (!this.state.value) {
              return
            }
            this.props.addTodo(this.state.value)
    }
    render() {
        return (
        <div>
                <Todolist todos ={this.props.todos} />
        </div>
        );
    }
}
const mapStateToProps = state => ({
    todos: state.todos
  })
const mapDispatchToProps = (dispatch, ownProps) => ({
    addTodo: (value) => dispatch(addTodo(value)),
    update_chart: (value) => dispatch(update_chart(value))
  })
export default connect( mapStateToProps,
    mapDispatchToProps)(AddTodo)