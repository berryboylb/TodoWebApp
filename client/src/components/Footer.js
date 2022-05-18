import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const Footer = ({ isAuthenticated, logout }) => {
  return (
    <footer >
      <p>Copyright &copy; 2021</p>
      <Link to='/about'>About</Link>{" "}{isAuthenticated && <a href="#!" onClick={() => logout()}>Logout</a>}
    </footer>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { logout })(Footer)
