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
import { trainLSTM } from "../store/actions/uploadActions";
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

const LSTM = props => {
    const classes = useStyles();

    const [options, setOptions] = useState({});
    const [state, setState] = React.useState({
        look_back: 4,
        batch_size: 1,
        epochs: 30
    });
    const [selectedValue, setSelectedValue] = React.useState('original');

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleChange1 = (event) => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {

        if(props.results && props.results.length > 0){

            let title = "LSTM Model" + " (MAPE Training: " + props.mape + ")" + " (MAPE Validation: " + props.mapeValidation + ")";
            
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
        e.preventDefault();
        if(state.look_back && state.batch_size && state.epochs){
            let formData = new FormData();
            if(selectedValue === "original"){
                if(localStorage.getItem("filename")){
                    formData.append("look_back", state.look_back);
                    formData.append("batch_size", state.batch_size);
                    formData.append("epochs", state.epochs);
                    formData.append("filename", localStorage.getItem("filename"));
                    formData.append("testFilename", localStorage.getItem("filename"));
                    props.trainLSTM(formData);
                }else{
                    toast.error("Bank Statements not found. Please upload bank statements first!");
                }
            }else if(selectedValue === "average"){
                if(localStorage.getItem("avg_filename")){
                    formData.append("look_back", state.look_back);
                    formData.append("batch_size", state.batch_size);
                    formData.append("epochs", state.epochs);
                    formData.append("filename", localStorage.getItem("avg_filename"));
                    formData.append("testFilename", localStorage.getItem("avg_filename"));
                    props.trainLSTM(formData);
                }else{
                    toast.error("Average plot not found. Please take average of original plot first!");
                }
            }
        }else{
            toast.error("Please fill all the parameters!");
        }
    }

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
                            <strong>Train LSTM Model</strong>
                        </InputLabel>
                    </FormGroup>
                    <br/>
                    <FormGroup row>
                        <TextField style={{marginLeft: 48}} name="look_back" label="Number of previous steps to use for next prediction" value={state.look_back} onChange={handleChange}/>
                        <TextField style={{marginLeft: 48}} name="batch_size" label="Batch of dataset to be created for training" value={state.batch_size} onChange={handleChange}/>
                        <TextField style={{marginLeft: 48}} name="epochs" label="Number of iterations of training" value={state.epochs} onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup row>
                <InputLabel
                    style={{marginLeft: 48, marginTop: 12}}>
                    Data
                </InputLabel>
                <FormControlLabel style={{marginLeft: 48}} value="original" control={<Radio
                    checked={selectedValue === 'original'}
                    onChange={handleChange1}
                    value="original"
                    name="original"
                />} label="Apply LSTM on original data" />
                {(localStorage.getItem("avg_filename") && localStorage.getItem("days")) ? (
                    <FormControlLabel style={{marginLeft: 48}} value="average" control={<Radio
                            checked={selectedValue === 'average'}
                            onChange={handleChange1}
                            value="average"
                            name="average"
                        />} label="Apply LSTM on average data" />
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
        )
        
    }
}

const mapStateToProps = state => ({
    filename: state.upload.filename,
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
  
export default connect(mapStateToProps, { trainLSTM })(LSTM);