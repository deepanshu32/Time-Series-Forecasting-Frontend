import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BeatLoader } from "react-spinners";
import Radio from '@material-ui/core/Radio';
import { plotAverage, loadInitialPlot, loadAveragePlot } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Average = props => {

    const [days, setDays] = useState(0);
    const [options, setOptions] = useState({});
    const [selectedValue, setSelectedValue] = React.useState('before');

    useEffect(() => {
        if(localStorage.getItem("avg_filename") && props.avgGraphData.length === 0){
            let formData = new FormData();
            formData.append("filename", localStorage.getItem("avg_filename"));
            props.loadAveragePlot(formData);
        }else if(localStorage.getItem("filename") && props.graphData.length === 0){
            let formData = new FormData();
            formData.append("filename", localStorage.getItem("filename"));
            props.loadInitialPlot(formData);
        }
       
        if(props.avgGraphData && props.avgGraphData.length > 0){

            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: localStorage.getItem("days")+" days average balance plot"
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
                    dataPoints: props.avgGraphData
                }]
            });

        }else if(props.graphData && props.graphData.length > 0){

            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: "Original Plot"
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
        
    }, [props.graphData, props.avgGraphData]);

    const onSubmit = e => {
        e.preventDefault();

        if(days){
            if(localStorage.getItem("split")){
                let formData = new FormData();
                formData.append("day", days);
                formData.append("filename", props.filename);
                formData.append("testFilename", props.filename);
                formData.append("split", localStorage.getItem("split"));
                formData.append("type", selectedValue);
                props.plotAverage(formData);
            }else{
                toast.error("Bank statements not found. Please upload!");
            }
        }else{
            toast.error("Please input days or move to next step to carry further process on original data!!");
        }
    };

    const handleChange2 = (event) => {
        setDays(event.target.value);
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

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
                        <strong>Take n day average balance</strong>
                    </InputLabel>
                </FormGroup>
                <br />
                <FormGroup 
                row>
                    <TextField style={{marginLeft: 48}} name="days" label="Days (n)" type="number" onChange={handleChange2} value={days}/>
                </FormGroup>
                <FormGroup row>
                    <FormControlLabel style={{marginLeft: 48}} value="before" control={<Radio
                        checked={selectedValue === 'before'}
                        onChange={handleChange}
                        value="before"
                        name="before"
                    />} label="Take average balance on a particular day using previous days" />
                </FormGroup>
                <FormGroup row>
                    <FormControlLabel style={{marginLeft: 48}} value="after" control={<Radio
                        checked={selectedValue === 'after'}
                        onChange={handleChange}
                        value="after"
                        name="after"
                    />} label="Take average balance on a particular day using days after" />
                </FormGroup>
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
    avg_filename: state.upload.avg_filename,
    avgGraphData: state.upload.avgGraphData,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { plotAverage, loadInitialPlot, loadAveragePlot })(Average);