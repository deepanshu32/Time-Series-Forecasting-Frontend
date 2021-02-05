import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import StationaryTest from "./components/StationaryTest";
import Header from "./components/Header";
import SideNav from "./components/Sidenav";
import Average from "./components/Average";
import Corelation from "./components/Corelation";
import Decompose from "./components/Decompose";
import ARIMA from "./components/ARIMA";
import Auto from "./components/Auto";
import LSTM from "./components/LSTM";
import Forecast from "./components/Forecast";
import Grid from '@material-ui/core/Grid';
import { connect } from "react-redux";

const Main = props => {
    if(props.isAuthenticated){
        return(
            <Grid container>
              <Grid item xs>
                <SideNav />
              </Grid>
              <Grid item xs={10}>
                <Header />
                <ToastContainer closeOnClick hideProgressBar={true} transition={Zoom} />
                <Router>
                  <div className="App">
                    <Switch>
                      <Route exact path="/" component={Login} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/upload" component={Upload} />
                      <Route exact path="/average" component={Average} />
                      <Route exact path="/decompose" component={Decompose} />
                      <Route exact path="/stationaryTest" component={StationaryTest} />
                      <Route exact path="/corelation" component={Corelation} />
                      <Route exact path="/arima" component={ARIMA} />
                      <Route exact path="/autoArima" component={Auto} />
                      <Route exact path="/lstm" component={LSTM} />
                      <Route exact path="/forecast" component={Forecast} />
                    </Switch>
                  </div>
                </Router>
              </Grid>
            </Grid>  
          
        );
      }else{
        return (
            <Grid container>
              <Grid item xs={12}>
                <Header />
                <ToastContainer closeOnClick hideProgressBar={true} transition={Zoom} />
                <Router>
                  <div className="App">
                    <Switch>
                      <Route exact path="/" component={Login} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/upload" component={Upload} />
                      <Route exact path="/average" component={Average} />
                      <Route exact path="/decompose" component={Decompose} />
                      <Route exact path="/stationaryTest" component={StationaryTest} />
                      <Route exact path="/corelation" component={Corelation} />
                      <Route exact path="/arima" component={ARIMA} />
                      <Route exact path="/autoArima" component={Auto} />
                      <Route exact path="/lstm" component={LSTM} />
                      <Route exact path="/forecast" component={Forecast} />
                    </Switch>
                  </div>
                </Router>
              </Grid>
            </Grid>  
        );
      }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps)(Main);

