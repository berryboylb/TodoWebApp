import {
  GET_ALL_ITEMS,
  ITEM_ERROR,
  TOGGLE_REMINDER,
  DELETE_ITEM,
  ADD_TODO,
  CLEAR_TODO
} from "../types";
const initialState = {
  todos: [],
  loading: true,
  pages: null,
  page: null,
  error: {},
};

export default function todo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_ITEMS:
      return {
        ...state,
        todos: payload.docs,
        pages: payload.pages,
        page: payload.page,
        loading: false,
      };
    case ADD_TODO:
      return {
        ...state,
        todos: state.todos.length > 10 ? (state.todos.pop(), [payload, ...state.todos] ) : [payload, ...state.todos],
        loading: false,
      };
    case DELETE_ITEM:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo._id !== payload),
        loading: false,
      };
    case TOGGLE_REMINDER:
      return {
        ...state,
        todos: state.todos.map(
          (todo) =>
            (todo._id === payload.id
              ? { ...todo, reminder: payload.reminder }
              : todo)
        ),
        loading: false,
      };
    case ITEM_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_TODO: 
      return {
        ...state,
        todos: [],
        loading: true,
        error: {},
      }
    default:
      return state;
  }
}
