import React, {PureComponent} from 'react';
import {Field, reduxForm} from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import renderCheckBoxField from '../../../shared/components/form/CheckBox';
import Socket from '../../../services/Socket';

class LogInForm extends PureComponent {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
    };
    showPassword = (e) => {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };

    constructor() {
        super();
        this.state = {
            showPassword: false,
        };
        /*
        // Simple connection
        var socket = io('http://10.3.1.12:8888',{path: '/api/chart/ip'});
        console.log("socket: ", socket.disconnected);
        if(socket.disconnected){
            socket = io('http://10.3.1.12:8888',{
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax : 5000,
                reconnectionAttempts: Infinity
            });
        }

        socket.on( 'connect', function () {
            console.log( 'connected to server' );
        } );

        socket.on( 'disconnect', function () {
            console.log( 'disconnected from server' );
        });

        socket.emit('ipdata', "Please give us some data sample to test, Thanks");
        socket.on('ipdata', function(data){
            console.log('Server response: ',data);
        });*/

        // Use Socket class in /services folder
        Socket.connect('http://10.3.1.12:8888', '/api/chart/ip');
        Socket.keepConnection('http://10.3.1.12:8888');
        Socket.emit('ipdata', "Please give us some data sample to test, Thanks");
        Socket.on('ipdata', data => {
            console.log('Server response: ', data);
        });
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__form-group">
                    <span className="form__form-group-label">Username</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <AccountOutlineIcon/>
                        </div>
                        <Field
                            name="name"
                            component="input"
                            type="text"
                            placeholder="Name"
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Password</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <KeyVariantIcon/>
                        </div>
                        <Field
                            name="password"
                            component="input"
                            type={this.state.showPassword ? 'text' : 'password'}
                            placeholder="Password"
                        />
                        <button
                            className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                            onClick={e => this.showPassword(e)}
                        ><EyeIcon/>
                        </button>
                    </div>
                    <div className="account__forgot-password">
                        <a href="/">Forgot a password?</a>
                    </div>
                </div>
                <div className="form__form-group">
                    <div className="form__form-group-field">
                        <Field
                            name="remember_me"
                            component={renderCheckBoxField}
                            label="Remember me"
                        />
                    </div>
                </div>
                <Link className="btn btn-primary account__btn account__btn--small" to="/pages/one">Sign In</Link>
                <Link className="btn btn-outline-primary account__btn account__btn--small" to="/log_in">Create
                    Account</Link>
            </form>
        );
    }
}

export default reduxForm({
    form: 'log_in_form',
})(LogInForm);
