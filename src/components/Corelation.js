import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { plotCorelation } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
import Grid from '@material-ui/core/Grid';
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Corelation = props => {

    const [options1, setOptions1] = useState({});
    const [options2, setOptions2] = useState({});
    const [lags, setLags] = useState(20);
    const [selectedValue, setSelectedValue] = React.useState('original');

    useEffect(() => {
   
        if(props.acf && props.pacf && props.acf.length > 0 && props.pacf.length > 0){

            let acf = [];
            let pacf = [];

            props.acf.forEach((value, index) => {
                acf.push({
                    x: index,
                    y: value
                })
                if(index === props.acf.length - 1){
                    setOptions1({
                        animationEnabled: true,
                        exportEnabled: true,
                        theme: "light2",
                        title: {
                          text: (selectedValue === "original") ? "ACF for original plot" : `ACF for ${localStorage.getItem("days")} days average plot` 
                        },
                        axisY:{
                            stripLines:[
                            {                
                                startValue: -1.96/Math.sqrt(props.size),
                                endValue: 1.96/Math.sqrt(props.size),                
                                color:"#d8d8d8"                      
                            }
                            ]
                        },
                        data: [{				
                            type: "line",
                            dataPoints: acf
                        }]
                    });
                }
            });

            props.pacf.forEach((value, index) => {
                pacf.push({
                    x: index,
                    y: value
                })
                if(index === props.pacf.length - 1){
                    setOptions2({
                        animationEnabled: true,
                        exportEnabled: true,
                        theme: "light2",
                        title: {
                          text: (selectedValue === "original") ? "ACF for original plot" : `ACF for ${localStorage.getItem("days")} days average plot`
                        },
                        axisY:{
                            stripLines:[
                            {                
                                startValue: -1.96/Math.sqrt(props.size),
                                endValue: 1.96/Math.sqrt(props.size),                 
                                color:"#d8d8d8"                      
                            }
                            ]
                        },
                        data: [{				
                            type: "line",
                            dataPoints: pacf
                        }]
                    });
                }
            });

        }
        
    }, [props.acf, props.pacf]);

    const handleChange2 = (event) => {
        setLags(event.target.value);
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const onSubmit = e => {
        e.preventDefault();
        if(lags){
            let formData = new FormData();
            if(selectedValue === "original"){
                if(localStorage.getItem("filename")){
                    formData.append("lags", lags);
                    formData.append("filename", localStorage.getItem("filename"));
                    props.plotCorelation(formData);
                }else{
                    toast.error("Bank Statements not found. Upload bank statements to plot ACF and PACF plot.");
                }
            }else if(selectedValue === "average"){
                if(localStorage.getItem("avg_filename")){
                    formData.append("lags", lags);
                    formData.append("filename", localStorage.getItem("avg_filename"));
                    props.plotCorelation(formData);
                }else{
                    toast.error("Average plot not found. Please take average of original plot first");
                }
            }
        }else{
            toast.error("Lags in acf and pacf is required");
        }
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
        return(
            <div>
                <form>
                <br />
                <FormGroup 
                row>
                    <InputLabel
                     style={{marginLeft: 48}}>
                        <strong>Plot ACF and PACF graphs</strong>
                    </InputLabel>
                </FormGroup>
                <br />
                <FormGroup 
                row>
                    <TextField style={{marginLeft: 48}} name="lags" label="No of lags" onChange={handleChange2} value={lags}/>
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
                {(props.acf.length > 0 && props.pacf.length > 0) ? (
                    <Grid container>
                        <Grid item xs={6}>
                            <CanvasJSChart options = {options1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CanvasJSChart options = {options2}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <div></div>
                )}
                <br />
            </div>
        )
    }
};

const mapStateToProps = state => ({
    filename: state.upload.filename,
    avg_filename: state.upload.avg_filename,
    acf: state.upload.acf,
    pacf: state.upload.pacf,
    size: state.upload.size,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { plotCorelation })(Corelation);