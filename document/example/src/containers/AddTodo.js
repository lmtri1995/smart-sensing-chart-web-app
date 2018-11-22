import React, { Component } from 'react';
import { connect } from 'react-redux'
import Todolist from "../components/TodoList";
class AddTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
      }
    render() {
      console.log('this.props.todos',this.props.todos)
        return (
        <div>
                <Todolist todos = {this.props.todos} />
        </div>
        );
    }
}
const mapStateToProps = state => ({
    todos: state.todos
  })
export default connect( mapStateToProps,
    null)(AddTodo)