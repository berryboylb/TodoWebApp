import React, { useState } from "react";
import Styles from "./styles.module.css";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { register } from "../../../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BounceLoader } from "react-spinners";

const SignUp = ({ register, isAuthenticated, user }) => {
  //get states
  const [signUpFormValues, setSignUpFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  //destructure to be able to use without dot notation
  const { firstname, lastname, email, password } = signUpFormValues;

  //handle onchange events for signup form
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormValues({ ...signUpFormValues, [name]: value });
  };

  //submit forms
  const [disabled, setDisabled] = useState(false);

  //submit signup form
  const handleSignUpSubmission = (e) => {
    e.preventDefault();
    //email regex
    const filterEmail =
      /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //letter and whitespace regex
    const letterAndWhitespace = /^[a-zA-Z\s]*$/;

    if (!firstname) {
      return toast.error("Firstname is required");
    } else if (!letterAndWhitespace.test(firstname)) {
      return toast.error("Firstname can only contain letters and whitespaces");
    }

    if (!lastname) {
      return toast.error("lastname is required");
    } else if (!letterAndWhitespace.test(lastname)) {
      return toast.error("lastname can only contain letters and whitespaces");
    }

    if (!email) {
      return toast.error("Email is required");
    } else if (!filterEmail.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!password) {
      return toast.error("Password is required");
    } else if (password.length < 6) {
      return toast.error("Password is too short");
    }
    //return console.log(signUpFormValues)
    //disable button
    setDisabled(true);
    //make requests here
    register({ firstname, lastname, email, password }, () =>
      setDisabled(false)
    );
  };

  //toggle password

  const [pwdState, setpwdState] = useState(false);

  function showPassword(evt) {
    var x = evt.currentTarget.previousElementSibling;
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
          <div className={Styles.content_}>
            <h3 id="title">Sign Up</h3>

            <form onSubmit={handleSignUpSubmission} id="signupform">
              <h5>All fields are required*</h5>

              <div className={Styles.flex_}>
                <div>
                  <label htmlFor="firstname">First name</label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First name"
                    value={firstname}
                    onChange={handleSignUpChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastname">Last name</label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last name"
                    value={lastname}
                    onChange={handleSignUpChange}
                  />
                </div>
              </div>

              <div className={Styles.space_}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleSignUpChange}
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
                  onChange={handleSignUpChange}
                />
                <span onClick={showPassword}>
                  <FontAwesomeIcon
                    className="icon"
                    icon={pwdState ? faEye : faEyeSlash}
                  />
                </span>
              </div>
              {disabled && (
                <div className={Styles.loader_}>
                  <BounceLoader color="#000" />
                </div>
              )}
              <button disabled={disabled} type="Submit">
                Sign up
              </button>
            </form>
            <h4 id="bottom">
              Do you have an account already? <Link to="/login">Sign In</Link>{" "}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, { register })(SignUp);
