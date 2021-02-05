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
import { plotDecompose } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Decompose = props => {

    const [options1, setOptions1] = useState({});
    const [options2, setOptions2] = useState({});
    const [options3, setOptions3] = useState({});
    const [period, setPeriod] = useState(null);
    const [selectedValue, setSelectedValue] = React.useState('original');

    useEffect(() => {

        if(props.trend && props.seasonal && props.resid && props.trend.length > 0 && props.seasonal.length > 0 && props.resid.length > 0){

            setOptions1({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: (selectedValue === "original") ? "Trend for original plot" : `Trend for ${localStorage.getItem("days")} days average plot` 
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
                    dataPoints: props.trend
                }]
            });

            setOptions2({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: (selectedValue === "original") ? "Seasonality for original plot" : `Seasonality for ${localStorage.getItem("days")} days average plot` 
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
                    dataPoints: props.seasonal
                }]
            });

            setOptions3({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title: {
                  text: (selectedValue === "original") ? "Residual for original plot" : `Residual for ${localStorage.getItem("days")} days average plot` 
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
                    dataPoints: props.resid
                }]
            });
        }
        
    }, [props.trend, props.seasonal, props.resid]);

    const onSubmit = e => {
        e.preventDefault();
        if(period){
            let formData = new FormData();
            if(selectedValue === "original"){
                if(localStorage.getItem("filename")){
                    formData.append("period", period);
                    formData.append("filename", localStorage.getItem("filename"));
                    props.plotDecompose(formData);
                }else{
                    toast.error("Bank Statements not found. Upload some bank statements in csv format");
                }
            }else if(selectedValue === "average"){
                if(localStorage.getItem("avg_filename")){
                    formData.append("period", period);
                    formData.append("filename", localStorage.getItem("avg_filename"));
                    props.plotDecompose(formData);
                }else{
                    toast.error("Average plot not found. Please take average of original plot first");
                }
            }
        }else{
            toast.error("Seasonality in days is required to decompose the plot");
        }
    };

    const handleChange2 = (event) => {
        setPeriod(event.target.value);
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
                <form>
                <br />
                <FormGroup 
                row>
                    <InputLabel
                     style={{marginLeft: 48}}>
                        <strong>Decompose plot into trend, seasonality and residual</strong>
                    </InputLabel>
                </FormGroup>
                <br />
                <FormGroup 
                row>
                    <TextField style={{marginLeft: 48}} name="period" label="Seasonality period in days" type="number" onChange={handleChange2}/>
                </FormGroup>
                <FormGroup row>
                <FormControlLabel style={{marginLeft: 48}} value="original" control={<Radio
                    checked={selectedValue === 'original'}
                    onChange={handleChange}
                    value="original"
                    name="original"
                />} label="Decompose original data" />
                </FormGroup>
                {(localStorage.getItem("avg_filename") && localStorage.getItem("days")) ? (
                    <FormGroup row>
                    <FormControlLabel style={{marginLeft: 48}} value="average" control={<Radio
                            checked={selectedValue === 'average'}
                            onChange={handleChange}
                            value="average"
                            name="average"
                        />} label="Decompose average data" />
                    </FormGroup>
                ) : (
                    <div></div>
                )}
                <FormGroup row>
                    <Button style={{marginLeft: 48}} onClick={onSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </FormGroup>
                </form>
                <br />
                {(props.trend.length > 0 && props.seasonal.length > 0 && props.resid.length > 0) ? (
                    <div>
                        <CanvasJSChart options = {options1}
                        />
                        <CanvasJSChart options = {options2}
                        />
                        <CanvasJSChart options = {options3}
                        />
                    </div>
                    
                ) : (
                    <div></div>
                )}
            </div>
        );
    }

};

const mapStateToProps = state => ({
    trend: state.upload.trend,
    seasonal: state.upload.seasonal,
    resid: state.upload.resid,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { plotDecompose })(Decompose);