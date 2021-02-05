import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import { BeatLoader } from "react-spinners";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import DateFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { forecast } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
import moment from 'moment';
import LSTM from './LSTM';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

const Forecast = props => {

    const classes = useStyles();

    const [options, setOptions] = useState({});
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [state, setState] = React.useState({
        startDate: null,
        endDate: null
    });

    useEffect(() => {

        if(props.predictions && props.predictions.length > 0){

            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: "Prediction of balances",
                  fontSize: 20
                },
                toolTip:{   
                    contentFormatter: function (e) {
                        var content = "";
                        for (var i = 0; i < e.entries.length; i++){
                            content = CanvasJS.formatDate(e.entries[i].dataPoint.x, "DD MMM YYYY") + " : " + e.entries[i].dataPoint.y;       
                        }       
                        return content;
                    }
                },
                axisY: {
                    title: "Closing Balance"
                },
                axisX: {
                    title: "Date",
                    labelFormatter: function (e) {
                        return CanvasJS.formatDate( new Date(e.value), "DD MMM YYYY");
                    },
                    labelAngle: -20
                },
                data: [{				
                    type: "line",
                    name: "Predicted values",
                    showInLegend: true,
                    dataPoints: props.predictions,
                }]
            });
        }
        
    }, [props.predictions, props.graphData, props.test]);

    const onSubmit = e => {
        e.preventDefault();
        if(state.startDate && state.endDate){
            if(selectedValue === "arima"){
                if(localStorage.getItem("arima_filename")){
                    let formData = new FormData();
                    formData.append("filename", localStorage.getItem("arima_filename"));
                    formData.append("testFilename", localStorage.getItem("arima_filename"));
                    formData.append("type", selectedValue);
                    formData.append("p", localStorage.getItem("p"));
                    formData.append("d", localStorage.getItem("d"));
                    formData.append("q", localStorage.getItem("q"));
                    formData.append("P", localStorage.getItem("P"));
                    formData.append("D", localStorage.getItem("D"));
                    formData.append("Q", localStorage.getItem("Q"));
                    formData.append("s", localStorage.getItem("s"));
                    formData.append("startDate", moment(state.startDate).format("YYYY-MM-DD"));
                    formData.append("endDate", moment(state.endDate).format("YYYY-MM-DD"));
                    if(localStorage.getItem("lam") && localStorage.getItem("lam") != "null"){
                        formData.append("lam", localStorage.getItem("lam"));
                    }else{
                        formData.append("lam", null);
                    }
                    props.forecast(formData);
                }else{
                    toast.error("ARIMA trained model not found!");
                }
            }else if(selectedValue === "auto_arima"){
                if(localStorage.getItem("auto_arima_filename")){
                    let formData = new FormData();
                    formData.append("filename", localStorage.getItem("auto_arima_filename"));
                    formData.append("testFilename", localStorage.getItem("auto_arima_filename"));
                    formData.append("type", selectedValue);
                    formData.append("p", localStorage.getItem("p1"));
                    formData.append("d", localStorage.getItem("d1"));
                    formData.append("q", localStorage.getItem("q1"));
                    let P;
                    if(localStorage.getItem("P1").charAt(0) === '['){
                        P = JSON.parse(localStorage.getItem("P1"));
                    }else{
                        P = JSON.parse("[" + localStorage.getItem("P1") + "]");
                    }   
                    let Q;
                    if(localStorage.getItem("Q1").charAt(0) === '['){
                        Q = JSON.parse(localStorage.getItem("Q1"));
                    }else{
                        Q = JSON.parse("[" + localStorage.getItem("Q1") + "]");
                    } 
                    formData.append("P", JSON.stringify(P));
                    formData.append("D", localStorage.getItem("D1"));
                    formData.append("Q", JSON.stringify(Q));
                    formData.append("s", localStorage.getItem("s1"));
                    formData.append("startDate", moment(state.startDate).format("YYYY-MM-DD"));
                    formData.append("endDate", moment(state.endDate).format("YYYY-MM-DD"));
                    if(localStorage.getItem("lam1") && localStorage.getItem("lam1") != "null"){
                        formData.append("lam", localStorage.getItem("lam1"));
                    }else{
                        formData.append("lam", null);
                    }
                    props.forecast(formData);
                }else{
                    toast.error("Auto ARIMA trained model not found");
                }
            }else if(selectedValue === "lstm"){
                if(localStorage.getItem("lstm_filename")){
                    let formData = new FormData();
                    formData.append("filename", localStorage.getItem("lstm_filename"));
                    formData.append("testFilename", localStorage.getItem("lstm_filename"));
                    formData.append("type", selectedValue);
                    formData.append("look_back", localStorage.getItem("look_back"));
                    formData.append("batch_size", localStorage.getItem("batch_size"));
                    formData.append("epochs", localStorage.getItem("epochs"))
                    formData.append("startDate", moment(state.startDate).format("YYYY-MM-DD"));
                    formData.append("endDate", moment(state.endDate).format("YYYY-MM-DD"));
                    props.forecast(formData);
                }else{
                    toast.error("LSTM trained model not found");
                }
            }else{
                toast.error("Please select model to forecast!");
            }
        }else{
            toast.error("Select start date and end date to forecast balances");
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setState({ ...state, startDate: date });
    };

    const handleEndDateChange = (date) => {
        setState({ ...state, endDate: date });
    };

    if (!props.isLoading && !props.isAuthenticated) {
        return <Redirect to="/" />;
    }

    if(props.loading){
        return (
            <div style={{textAlign: "center"}}>
                <div className="loader">
                <BeatLoader
                    size={100}
                    color={"#3399ff"}
                    loading={props.loading}
                />
            </div>
            </div>
        )
    }else{
        return (
            <div className={classes.root}>
                <form>
                <br />
                <FormGroup 
                row>
                    <InputLabel
                     style={{marginLeft: 48}}>
                        <strong>Forecast Future Balances</strong>
                    </InputLabel>
                </FormGroup>
                <FormGroup row>
                    <InputLabel
                    style={{marginLeft: 48, marginTop: 40}}>
                        Forecast between:
                    </InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            style={{marginLeft: 48}}
                            disableToolbar
                            variant="inline"
                            format="DD/MM/yyyy"
                            margin="normal"
                            name="startDate"
                            id="startDate"
                            label="Start Date"
                            value={state.startDate}
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        <KeyboardDatePicker
                            style={{marginLeft: 48}}
                            disableToolbar
                            variant="inline"
                            format="DD/MM/yyyy"
                            margin="normal"
                            name="endDate"
                            id="endDate"
                            label="End Date"
                            value={state.endDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                    </MuiPickersUtilsProvider>
                </FormGroup>
                <br />
                <FormGroup row>
                    <InputLabel
                        style={{marginLeft: 48, marginTop: 15}}>
                            Select Model:
                    </InputLabel>
                </FormGroup>
                <FormGroup row>
                    {(localStorage.getItem("p") && localStorage.getItem("d") && localStorage.getItem("q") && localStorage.getItem("P") && localStorage.getItem("Q") && localStorage.getItem("D") && localStorage.getItem("s")) ? (
                        <FormControlLabel style={{marginLeft: 48}} value="arima" control={<Radio
                                checked={selectedValue === 'arima'}
                                onChange={handleChange}
                                value="arima"
                                name="model"
                            />} label={"Forecast using" + " ARIMA(order=("+localStorage.getItem('p')+", "+localStorage.getItem('d')+", "+localStorage.getItem('q')+"), seasonal_order=("+localStorage.getItem("P")+", "+localStorage.getItem("D")+", "+localStorage.getItem("Q")+", "+localStorage.getItem("s")+"))"} />
                    ) : (
                        <div></div>
                    )}
                </FormGroup>
                <FormGroup row>
                    {(localStorage.getItem("p1") && localStorage.getItem("d1") && localStorage.getItem("q1") && localStorage.getItem("P1") && localStorage.getItem("Q1") && localStorage.getItem("D1") && localStorage.getItem('s1') && localStorage.getItem('model')) ? (
                        <FormControlLabel style={{marginLeft: 48}} value="auto_arima" control={<Radio
                                checked={selectedValue === 'auto_arima'}
                                onChange={handleChange}
                                value="auto_arima"
                                name="model"
                            />} label={"Forecast using " + localStorage.getItem("model")} />
                    ) : (
                        <div></div>
                    )}
                </FormGroup>
                <FormGroup row>
                    {(localStorage.getItem("look_back") && localStorage.getItem("batch_size") && localStorage.getItem("epochs")) ? (
                        <FormControlLabel style={{marginLeft: 48}} value="lstm" control={<Radio
                                checked={selectedValue === 'lstm'}
                                onChange={handleChange}
                                value="lstm"
                                name="model"
                            />} label={"Forecast using " + "LSTM(look_back="+localStorage.getItem("look_back")+", batch_size="+localStorage.getItem("batch_size")+", epochs="+localStorage.getItem("epochs")+")"} />
                    ) : (
                        <div></div>
                    )}
                </FormGroup>
                <br />
                <FormGroup row>
                    <Button style={{marginLeft: 48}} onClick={onSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </FormGroup>
                </form>
                <br />
                <CanvasJSChart options = {options}
                />
            </div>
        );
    }
    
};

const mapStateToProps = state => ({
    filename: state.upload.filename,
    avg_filename: state.upload.filename,
    predictions: state.upload.predictions,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { forecast })(Forecast);