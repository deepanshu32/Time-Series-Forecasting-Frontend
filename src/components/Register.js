import React, {useState, useEffect} from 'react';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../store/actions/auth";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

const Register = props => {

    const [state, setState] = React.useState({
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const onSubmit = e => {
        e.preventDefault();
        if(state.email == ""){
            toast.error("Please provide email!");
        }else{
            if(state.password == ""){
                toast.error("Please provide password!");
            }else{
                props.register(state.email, state.password);
            }
        }
    };

    if (props.isAuthenticated) {
        return <Redirect to="/upload" />;
    }

    if(props.isLoadingUser){
        return (
            <div className="loader">
                <BeatLoader
                    size={150}
                    color={"#3399ff"}
                    loading={props.loading}
                    />
            </div>
        )
    }else{
        return(
            <div>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div>
                        <br />
                        <br />
                        <br />
                        <b><i><span style={{ fontSize: 30, fontWeight: 700, color: "#1a8cff", marginLeft: 20}}>PayMate</span></i></b>
                        <br />
                        <br />
                        <Typography component="h1" variant="h5">
                        Register
                        </Typography>
                        <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            type="text"
                            label="Email Address"
                            name="email"
                            value={state.email}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={state.password}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                        <br />
                        <br />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}
                        >
                            Submit
                        </Button>
                        </form>
                    </div>
                    </Container>
            </div>
        )
    }
   
}

const mapStateToProps = state => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    isLoadingUser: state.auth.isLoading
});

export default connect(mapStateToProps, { register })(Register);