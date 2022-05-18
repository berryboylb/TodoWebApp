import { createStore, applyMiddleware, compose } from "redux";
//import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";


//create an initial state
const initialState = {};


//create a middleware
const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*create a store include reducer, initialstate and middleware*/
const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
    //composeWithDevTools(applyMiddleware(...middleware))
)


// const store = configureStore({
//     reducer,
//     initialState,
//     middleware,
// })

export default store;