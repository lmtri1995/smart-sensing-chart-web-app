const initialState = [{id: 5, text: "0.8350665935176824", completed: false}]
const todos = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          {
            id: action.id,
            text: action.text,
            completed: false
          }
        ]
      case 'TOGGLE_TODO':
        return state.map(
          todo =>
            todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      default:
        return state
    }
  }
  
  export default todos