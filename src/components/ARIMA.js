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
import { trainArima } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
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

const ARIMA = props => {

    const classes = useStyles();

    const [options, setOptions] = useState({});
    const [selectedValue, setSelectedValue] = React.useState('original');
    const [boxcox, setBoxcox] = React.useState('No');
    const [state, setState] = React.useState({
        p: null,
        d: null,
        q: null,
        P: null,
        D: null,
        Q: null,
        s: null
    });

    const [seasonality, setSeasonality] = React.useState('true');

    useEffect(() => {

        if(props.results && props.results.length > 0){

            let title;

            if(localStorage.getItem("lam") && localStorage.getItem("lam") != "null"){
                if(state.q === 0){
                    title = "AR Model " + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")" + " Lambda: "+localStorage.getItem("lam");
                }else if(state.p === 0){
                    title = "MA Model " + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")" + " Lambda: "+localStorage.getItem("lam");
                }else{
                    title = "ARIMA Model" + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")" + " Lambda: "+localStorage.getItem("lam");
                }
            }else{
                if(state.q === 0){
                    title = "AR Model " + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")";
                }else if(state.p === 0){
                    title = "MA Model " + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")";
                }else{
                    title = "ARIMA Model" + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")";
                }
            }
            
            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: title,
                  fontSize: 15
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
                    name: "original",
                    showInLegend: true,
                    dataPoints: props.graphData,
                },{				
                    type: "line",
                    name: "Fitted values",
                    showInLegend: true,
                    dataPoints: props.results,
                },{				
                    type: "line",
                    name: "Test values",
                    showInLegend: true,
                    dataPoints: props.test,
                },{				
                    type: "line",
                    name: "Predictions",
                    showInLegend: true,
                    dataPoints: props.predictions,
                }]
            });
        }
        
    }, [props.results, process.predictions]);

    const onSubmit = e => {
        if((state.p === 0 && state.q === 0) || (state.p === null && state.q === null)){
            toast.error("Invalid ARIMA parameters. Both p and q are 0 or empty");
        }else{
            console.log(state.P)
            if(((state.P !== 0 && state.P !== null) || (state.Q !== 0 && state.Q !== null)) && (state.s === 0 || state.s === null)){
                toast.error("Seasonal periodicity cannot be 0 if including seasonal AR, MA or difference");
            }else{
                if(state.s === 1){
                    toast.error("Seasonal periodicity should be greater than 1");
                }else{
                    let formData = new FormData();
                    if(selectedValue === "original"){
                        if(localStorage.getItem("filename")){
                            formData.append("p", state.p);
                            formData.append("q", state.q);
                            formData.append("d", state.d || 0);
                            formData.append("P", state.P || 0);
                            formData.append("Q", state.Q || 0);
                            formData.append("D", state.D || 0);
                            formData.append("s", state.s || 0);
                            formData.append("seasonality", seasonality);
                            formData.append("boxcox", boxcox);
                            formData.append("filename", localStorage.getItem("filename"));
                            formData.append("testFilename", localStorage.getItem("filename"));
                            props.trainArima(formData);
                        }else{
                            toast.error("Bank Statements not found. Please upload bank statements first!");
                        }
                    }else if(selectedValue === "average"){
                        if(localStorage.getItem("avg_filename")){
                            formData.append("p", state.p);
                            formData.append("q", state.q);
                            formData.append("d", state.d || 0);
                            formData.append("P", state.P || 0);
                            formData.append("Q", state.Q || 0);
                            formData.append("D", state.D || 0);
                            formData.append("s", state.s || 0);
                            formData.append("seasonality", seasonality);
                            formData.append("boxcox", boxcox);
                            formData.append("filename", localStorage.getItem("avg_filename"));
                            formData.append("testFilename", localStorage.getItem("avg_filename"));
                            props.trainArima(formData);
                        }else{
                            toast.error("Average plot not found. Please take average of original plot first!");
                        }
                    }
                }
            }
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChange2 = (event) => {
        setState({ ...state, [event.target.name]: parseInt(event.target.value) });
    };

    const handleChange3 = (event) => {
        setBoxcox(event.target.value);
    }

    const handleChange4 = (event) => {
        setSeasonality(event.target.value);
    };

    if (!props.isLoading && !props.isAuthenticated) {
        return <Redirect to="/" />;
    }

    if(props.loading){
        return (
            <div style={{textAlign: "center"}}>
                <InputLabel style={{fontSize: 30, marginTop: 20}}>
                Please be patient this may take a while!
                </InputLabel>
                <div className="loader">
                    <BeatLoader
                        size={150}
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
                        <strong>Train ARIMA Model</strong>
                    </InputLabel>
                </FormGroup>
                <FormGroup row>
                <InputLabel
                style={{marginLeft: 48, marginTop: 12}}>
                    Seasonality
                </InputLabel>
                <FormControlLabel style={{marginLeft: 10}} value="true" control={<Radio
                    checked={seasonality === 'true'}
                    onChange={handleChange4}
                    value="true"
                    name="seasonal"
                />} label="True" />
                <FormControlLabel value="false" control={<Radio
                    checked={seasonality === 'false'}
                    onChange={handleChange4}
                    value="false"
                    name="seasonal"
                />} label="False" />
                </FormGroup>
                <FormGroup row>
                    <TextField style={{marginLeft: 48}} name="p" label="Auto Regressive terms (p)" type="number" value={state.p} onChange={handleChange2}/>
                    <TextField style={{marginLeft: 48}} name="d" label="Order of differencing (d)" type="number" value={state.d} onChange={handleChange2}/>
                    <TextField style={{marginLeft: 48}} name="q" label="Moving Average terms (q)" type="number" value={state.q} onChange={handleChange2}/>
                </FormGroup>
                <br />
                { seasonality == 'true' ? (
                    <FormGroup row>
                        <TextField style={{marginLeft: 48}} name="P" label="Seasonal AR terms (P)" type="number" value={state.P} onChange={handleChange2}/>
                        <TextField style={{marginLeft: 48}} name="D" label="Seasonal diff (D)" type="number" value={state.D} onChange={handleChange2}/>
                        <TextField style={{marginLeft: 48}} name="Q" label="Seasonal MA terms (Q)" type="number" value={state.Q} onChange={handleChange2}/>
                        <TextField style={{marginLeft: 48}} name="s" label="Periodicity (s)" type="number" value={state.s} onChange={handleChange2}/>
                    </FormGroup>
                ) : (
                    <div></div>
                )}
                <br />
                <FormGroup row>
                    <InputLabel
                    style={{marginLeft: 48, marginTop: 12}}>
                        Apply Box Cox Transformation
                    </InputLabel>
                    <FormControlLabel style={{marginLeft: 48}} value="Yes" control={<Radio
                        checked={boxcox === 'Yes'}
                        onChange={handleChange3}
                        value="Yes"
                        name="boxcox"
                    />} label="Yes" />
                    <FormControlLabel style={{marginLeft: 48}} value="No" control={<Radio
                        checked={boxcox === 'No'}
                        onChange={handleChange3}
                        value="No"
                        name="boxcox"
                    />} label="No" />
                </FormGroup>
                <FormGroup row>
                <InputLabel
                    style={{marginLeft: 48, marginTop: 12}}>
                    Data
                </InputLabel>
                <FormControlLabel style={{marginLeft: 48}} value="original" control={<Radio
                    checked={selectedValue === 'original'}
                    onChange={handleChange}
                    value="original"
                    name="original"
                />} label="Apply ARIMA on original data" />
                {(localStorage.getItem("avg_filename") && localStorage.getItem("days")) ? (
                    <FormControlLabel style={{marginLeft: 48}} value="average" control={<Radio
                            checked={selectedValue === 'average'}
                            onChange={handleChange}
                            value="average"
                            name="average"
                        />} label="Apply ARIMA on average data" />
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
    graphData: state.upload.graphData,
    results: state.upload.results,
    predictions: state.upload.predictions,
    test: state.upload.test,
    mape: state.upload.mape,
    mapeValidation: state.upload.mapeValidation,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { trainArima })(ARIMA);