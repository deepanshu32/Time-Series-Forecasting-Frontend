import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));

const Header = props => {

    const classes = useStyles();

    const [state, setState] = React.useState({
        loginRedirect: false,
        registerRedirect: false
    });

    return (
        <div className={classes.root}>
            <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                <strong>SME Credit Forecasting</strong>
                </Typography>
                { props.isAuthenticated ? <Button style={{float: "right"}} onClick={props.logout} variant="contained" color="danger"> Logout </Button>: <div>
                    <a style={{fontSize:18}} href="/"><strong>Login</strong></a>
                    <a style={{fontSize:18, marginLeft: 20}} href="/register"><strong>Register</strong></a>
                </div>}
            </Toolbar>
            </AppBar>
        </div>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { logout })(Header);
