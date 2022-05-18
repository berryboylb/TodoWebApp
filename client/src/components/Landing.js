import React from "react";
import PropTypes from "prop-types";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";

const Landing = ({ isAuthenticated }) => {
  //if a user is authenticated before just redirect them already
  if (isAuthenticated) {
    return <Navigate to="/todo" />;
  }
  const btnStyles = { display: 'flex', justifyContent: 'center', marginTop: '1rem' }
  return (
    <div >
      <h1  style={{ textAlign: "center" }}>Todo App</h1>
      <p style={{ textAlign: "center" }}>Manage your todo all in one app</p>
      <div style={btnStyles} className="buttons">
        <Link to="/register" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-light">
          Login
        </Link>
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Landing);
