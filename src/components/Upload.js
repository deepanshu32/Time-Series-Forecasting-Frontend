import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import { BeatLoader } from "react-spinners";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { upload, loadInitialPlot } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Upload = props => {

    const [files, setFiles] = useState([]);
    const [options, setOptions] = useState({});
    const [state, setState] = React.useState({
        fillMissing: true,
        uniform: true,
        split: null
    });

    useEffect(() => {

        if(localStorage.getItem("filename") && props.graphData.length === 0){
            let formData = new FormData();
            formData.append("filename", localStorage.getItem("filename"));
            props.loadInitialPlot(formData);
        }
       
        if(props.graphData && props.graphData.length > 0){

            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: "Initial Plot"
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
                    dataPoints: props.graphData
                }]
            });
        }
        
    }, [props.graphData]);

    const onSubmit = e => {
        e.preventDefault();

        if(files.length > 0){
            if(state.split){
                let formData = new FormData();
                formData.append("fillMissing", state.fillMissing);
                formData.append("uniform", state.uniform);
                formData.append("split", state.split);
        
                files.forEach(file => {
                    formData.append("statements", file);
                });
        
                props.upload(formData);
            }else{
                toast.error("Please provide testing dataset percentage");
            }
        }else{
            toast.error("Please choose some files!!");
        }
    };

    const onChangeHandler = event => {
        setFiles([...event.target.files]);
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleChange2 = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    console.log(props.isLoading)
    console.log(props.isAuthenticated)
    if (!props.isLoading && !props.isAuthenticated) {
        return <Redirect to="/" />;
    }

    if(props.loading){
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
        return (
            <div>
                <br />
                <FormGroup 
                row>
                    <InputLabel
                     style={{marginLeft: 48}}>
                        <strong>Upload Bank Statements</strong>
                    </InputLabel>
                </FormGroup>
                <br />
                <FormGroup 
                row>
                    <input
                    style={{marginLeft: 48}}
                    accept=".csv"
                    multiple
                    margin="normal"
                    type="file"
                    onChange={onChangeHandler}
                    />
                </FormGroup>
                <FormGroup row>
                    <FormControlLabel
                        style={{marginLeft: 37}}
                        control={
                        <Checkbox
                            checked={state.fillMissing}
                            onChange={handleChange}
                            name="fillMissing"
                            color="primary"
                        />
                        }
                        label="Fill missing days values with previous day balance"
                    />
                </FormGroup>
                <FormGroup row>
                    <FormControlLabel
                        style={{marginLeft: 37}}
                        control={
                            <Checkbox
                                checked={state.uniform}
                                onChange={handleChange}
                                name="uniform"
                                color="primary"
                            />
                        }
                        label="Fill missing days values and create 31 days for each month for uniformity in seasonality"
                    />
                </FormGroup>
                <FormGroup 
                row>
                    <TextField style={{marginLeft: 48}} name="split" label="Testing data percentage" type="number" value={state.split} onChange={handleChange2}/>
                </FormGroup>
                <br />
                <FormGroup row>
                    <Button style={{marginLeft: 48}} onClick={onSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </FormGroup>
                <br />
                <CanvasJSChart options = {options}
                />
            </div>
        );
    }
    
};

const mapStateToProps = state => ({
    filename: state.upload.filename,
    graphData: state.upload.graphData,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { upload, loadInitialPlot })(Upload);