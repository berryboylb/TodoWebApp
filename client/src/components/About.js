import { Link } from 'react-router-dom';
import { connect } from "react-redux";

const About = ({ user }) => {
  return (
    <div>
      <h4>Version 1.1.0</h4>
      <p>This is a react crash course done by Brad Traversy last year which i upgraded and added server side with node and Express</p>
      {user && (<Link to={`/todo/${user._id}`}>Go Back</Link>)}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {  })(About)
