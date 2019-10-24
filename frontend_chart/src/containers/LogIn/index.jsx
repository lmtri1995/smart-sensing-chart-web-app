import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import LogInForm from './components/LogInForm';
import {connect} from 'react-redux'
import {fetchData} from '../../redux/actions/loginActions';
import {ROUTE} from "../../constants/constants";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: [],
            message: ''
        };
        this.login = this.login.bind(this);
        this.responseData = this.responseData.bind(this)
    }

    login(values) {
        let user = {
            username: values.name,
            password: values.password
        };
        //dispatch(fetchData(user))
        this.props.fetchData(user, this.responseData)
    }

    responseData(value) {
        if (value.success === false)
            this.setState({message: value.message})
    }

    componentWillReceiveProps(nextProps) {
        this.setState({login: nextProps.datalogin.data})
    }


    render() {
        //console.log('LogIn state',this.state.login)
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        console.log("42 42 42 loginData42: ", loginData);
        if (loginData !== null) return <Redirect
         to={ROUTE.IPDashboard}/>;
        /*if (loginData !== null && (loginData.data.role === 'as')) return <Redirect to={ROUTE.MasterPage}/>;*/
        return (
            <div className="account">
                <div className="account__wrapper">
                    <div className="account__card">
                        <div className="account__head">
                            <h3 className="account__title">Welcome to
                                <span className="account__logo">
              <span className="account__logo-accent"> HSVINA</span>
            </span>
                            </h3>
                            <h4 className="account__subhead subhead">Login form</h4>
                        </div>
                        <div>
                            <h4 className="account__subhead text-danger">{this.state.message}</h4>
                        </div>
                        <LogInForm onSubmit={this.login}/>
                        <div className="account__or">
                            <p>HSVINA company</p>
                        </div>
                        <div className="account__social">
                            {/* <Link
            className="account__social-btn account__social-btn--facebook"
            to="/pages/one"
          ><FacebookIcon />
          </Link>
          <Link
            className="account__social-btn account__social-btn--google"
            to="/pages/one"
          ><GooglePlusIcon />
          </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//export default LogIn
function mapStateToProps(state) {
    return {datalogin: state.login}
}

function mapDispatchToProps(dispatch) {
    return {
        fetchData: (user, responseData) => dispatch(fetchData(user, responseData)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogIn)

