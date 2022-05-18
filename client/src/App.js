import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";
import Login from "./components/auth/login/Login";
import SignUp from "./components/auth/signup/SignUp";
/*provider allows our store to be accessed from anywhere*/
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Landing from "./components/Landing";
import PrivateRoute from "./components/PrivateRoute";

//commonly setting token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Toaster position={isMobile ? "top-center" : "top-right"} />
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route
              path="/todo/:id"
              element={
                <PrivateRoute>
                  <>
                    <Header
                      onAdd={() => setShowAddTask(!showAddTask)}
                      showAdd={showAddTask}
                    />
                    {showAddTask && <AddTask />}
                    <Tasks/>
                  </>
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
