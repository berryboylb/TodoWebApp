import React, { useState } from "react";
import Styles from "../signup/styles.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginUser } from "../../../actions/auth";
import { Navigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

const Login = ({ loginUser, isAuthenticated, user}) => {
  //get states
  const [loginformValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });

  //destructure so it can be used withou dot notation
  const { email, password } = loginformValues;

  //handle onchange events for login form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormValues({ ...loginformValues, [name]: value });
  };

  //disable button
  const [disabled, setDisabled] = useState(false);
  //submit login form
  const handleLoginSubmission = (e) => {
    e.preventDefault();
    //email regex
    const filterEmail =
      /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!email) {
      return toast.error("Email is required");
    } else if (!filterEmail.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!password) {
      return toast.error("Password is required");
    } else if (password.length <6) {
      return toast.error("Password is too short");
    }
    //disable button
    setDisabled(true);
    //make requests here
    loginUser({ email, password }, () => setDisabled(false));
  };

  //toggle password
  const [pwdState, setpwdState] = useState(false);
  function showPassword(evt) {
    let x = evt.currentTarget.previousElementSibling;
    if (x.type === "password") {
      x.type = "text";
      setpwdState(!pwdState);
    } else {
      x.type = "password";
      setpwdState(!pwdState);
    }
  }

  //if a user is authenticated before just redirect them already
  if (isAuthenticated && user) {
    return <Navigate to={`/todo/${user._id}`} />;
  }

  return (
    <div className={Styles.signup}>
      <div>
        <div className={Styles.inner}>
        {disabled && <div className={Styles.loader_}>
            <BounceLoader color="#000" />
          </div>}
          <div className={Styles.content_}>
            <h3 id="sign">Sign in</h3>
            <form id="formlogin" onSubmit={handleLoginSubmission}>
              <div className={Styles.space_}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleLoginChange}
                />
              </div>

              <div className={Styles.space_}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Choose password"
                  value={password}
                  onChange={handleLoginChange}
                />
                <span onClick={showPassword}>
                  <FontAwesomeIcon
                    className="icon"
                    icon={pwdState ? faEye : faEyeSlash}
                  />
                </span>
              </div>
              {disabled && <div className={Styles.loader_}>
            <BounceLoader color="#000" />
          </div>}
              <button disabled={disabled} type="Submit">
                 Sign In
              </button>
            </form>

            <h4 id="mini">
              Don’t have an account? <Link to="/register">Sign Up</Link>{" "}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, { loginUser })(Login);
