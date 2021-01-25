import React, {Component} from 'react';
import './Login.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import {Link, Redirect} from 'react-router-dom';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            correctUsername: "upgrad123@gmail.com",
            correctPassword: "upgrad@123",
            loginUsername: "",
            loginPassword: "",
            usernameRequired: "dispNone",
            passwordRequired: "dispNone",
            errorMessage: "dispNone",
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            // Pls Update Access Token in Controller.js File
        }
    }

    usernameChangeHandler = (e) => {
        this.setState({loginUsername: e.target.value})
    }

    passwordChangeHandler = (e) => {
        this.setState({loginPassword: e.target.value})
    }

    loginHandler = () => {
        this.setState({errorMessage: "dispNone"})
        this.state.loginUsername === "" ? this.setState({usernameRequired: "dispBlock"}) : this.setState({usernameRequired: "dispNone"})
        this.state.loginPassword === "" ? this.setState({passwordRequired: "dispBlock"}) : this.setState({passwordRequired: "dispNone"})

        if (this.state.loginUsername === this.state.correctUsername && this.state.loginPassword === this.state.correctPassword) {
            sessionStorage.setItem('access-token', this.props.accessToken);
            //this.props.history.push('/home');
        } else {
            if (this.state.loginUsername !== "" && this.state.loginPassword !== "")
                this.setState({errorMessage: "dispBlock"});
        }
    }

    render() {
        return (
            <div>
                {this.state.loggedIn === true ?
                    <Redirect to="/home"/>
                    :
                    <div>
                        <Header/>
                        <div>
                            <Card className="LoginCard">
                                <CardContent>
                                    <Typography className="unselectable" variant="h5">LOGIN</Typography><br/>
                                    <FormControl required className="formControl">
                                        <InputLabel className="unselectable" htmlFor="username">Username</InputLabel>
                                        <Input id="username" type="text" onChange={this.usernameChangeHandler}/>
                                        <FormHelperText className={this.state.usernameRequired}>
                                            <span className="red unselectable">required</span>
                                        </FormHelperText>
                                    </FormControl><br/><br/>
                                    <FormControl required className="formControl">
                                        <InputLabel className="unselectable" htmlFor="password">Password</InputLabel>
                                        <Input id="password" type="password" onChange={this.passwordChangeHandler}/>
                                        <FormHelperText className={this.state.passwordRequired}>
                                            <span className="red unselectable">required</span>
                                        </FormHelperText>
                                    </FormControl><br/><br/>
                                    <FormHelperText className={this.state.errorMessage}>
                                        <span className="red unselectable">Incorrect username and/or password</span>
                                    </FormHelperText><br/>
                                    <Link style={{textDecoration: 'none'}}
                                          to={(this.state.loginUsername === this.state.correctUsername && this.state.loginPassword === this.state.correctPassword) ? "/home" : "/"}>
                                        <Button variant="contained" color="primary"
                                                onClick={this.loginHandler}>LOGIN</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>}
            </div>
        )
    }
}

export default Login;