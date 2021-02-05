import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import { BeatLoader } from "react-spinners";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { autoArima } from "../store/actions/uploadActions";
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

const Auto = props => {

    const classes = useStyles();

    const [options, setOptions] = useState({});
    const [selectedValue, setSelectedValue] = React.useState('original');
    const [boxcox, setBoxcox] = React.useState('No');
    const [seasonality, setSeasonality] = React.useState('true');

    useEffect(() => {

        if(props.predictions && props.predictions.length > 0){
            
            let title;
            if(localStorage.getItem("lam1") && localStorage.getItem("lam1") != "null"){
                title = props.model + "  (Validation MAPE: " + props.mapeValidation + ")"+" Lambda: "+localStorage.getItem("lam1");
            }else{
                title = props.model + "  (Validation MAPE: " + props.mapeValidation + ")";
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
                    name: "Predicted values",
                    showInLegend: true,
                    dataPoints: props.predictions,
                },{
                    type: "line",
                    name: "Test values",
                    showInLegend: true,
                    dataPoints: props.test,
                }]
            });
        }
        
    }, [props.predictions, props.graphData, props.test]);

    const onSubmit = e => {
        e.preventDefault();
        let formData = new FormData();
        if(selectedValue === "original"){
            if(localStorage.getItem("filename")){
                formData.append("seasonality", seasonality);
                formData.append("boxcox", boxcox);
                formData.append("filename", localStorage.getItem("filename"));
                formData.append("testFilename", localStorage.getItem("filename"));
                props.autoArima(formData);
            }else{
                toast.error("Bank Statements not found. Please upload bank statements first!");
            }
        }else if(selectedValue === "average"){
            if(localStorage.getItem("avg_filename")){
                formData.append("seasonality", seasonality);
                formData.append("boxcox", boxcox);
                formData.append("filename", localStorage.getItem("avg_filename"));
                formData.append("testFilename", localStorage.getItem("avg_filename"));
                props.autoArima(formData);
            }else{
                toast.error("Average plot not found. Please take average of original plot first!");
            }
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChange2 = (event) => {
        setSeasonality(event.target.value);
    };

    const handleChange3 = (event) => {
        setBoxcox(event.target.value);
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
                        <strong>Apply Auto ARIMA</strong>
                    </InputLabel>
                </FormGroup>
                <br />
                <FormGroup row>
                <InputLabel
                style={{marginLeft: 48, marginTop: 12}}>
                    Seasonality
                </InputLabel>
                <FormControlLabel style={{marginLeft: 10}} value="true" control={<Radio
                    checked={seasonality === 'true'}
                    onChange={handleChange2}
                    value="true"
                    name="seasonal"
                />} label="True" />
                <FormControlLabel value="false" control={<Radio
                    checked={seasonality === 'false'}
                    onChange={handleChange2}
                    value="false"
                    name="seasonal"
                />} label="False" />
                </FormGroup>
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
                />} label="Apply auto ARIMA on original data" />
                {(localStorage.getItem("avg_filename") && localStorage.getItem("days")) ? (
                    <FormControlLabel style={{marginLeft: 48}} value="average" control={<Radio
                            checked={selectedValue === 'average'}
                            onChange={handleChange}
                            value="average"
                            name="average"
                        />} label="Apply auto ARIMA on average data" />
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
    predictions: state.upload.predictions,
    test: state.upload.test,
    mapeValidation: state.upload.mapeValidation,
    model: state.upload.model,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { autoArima })(Auto);