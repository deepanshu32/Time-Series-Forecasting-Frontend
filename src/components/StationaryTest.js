import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { BeatLoader } from "react-spinners";
import { testStationary } from "../store/actions/uploadActions";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

const StationaryTest = props => {

    const classes = useStyles();

    const [options, setOptions] = useState({});

    useEffect(() => {

        if(localStorage.getItem("filename") && !props.stationaryTestData){
            let formData = new FormData();
            formData.append("filename", localStorage.getItem("filename"));
            props.testStationary(formData)
        }

        if(props.meanGraph.length > 0 && props.stdGraph.length > 0 && props.graphData.length){
        
            setOptions({
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
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
                    name: "Original",
                    showInLegend: true,
                    dataPoints: props.graphData
                }, {
                    type: "line",
                    name: "Mean",
                    showInLegend: true,
                    dataPoints: props.meanGraph
                }, {
                    type: "line",
                    name: "Standard Deviation",
                    showInLegend: true,
                    dataPoints: props.stdGraph
                }]
            });
        }
       
    }, [props.stationaryTestData]);

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
        if(props && props.stationaryTestData){
    
            return (
                <div>
                    <div style={{textAlign: "left", width: "50%", marginLeft: 48}}>
                    <br />
                    <Typography variant="h5" component="h2">
                        Augmented Dickey Fuller Test Results:
                    </Typography>
                    <br />
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <strong>Lags Used: </strong><span>
                                {props.stationaryTestData["#Lags Used"]}
                            </span>
                            <br />
                            <strong>Number of Observations Used: </strong><span>
                                {props.stationaryTestData["Number of Observations Used"]}
                            </span>
                            <br />
                            <strong>Test Statistic: </strong><span>
                                {props.stationaryTestData["Test Statistic"].toFixed(30)}
                            </span>
                            <br />
                            <strong>p-value: </strong><span>
                                {props.stationaryTestData["p-value"].toFixed(30)}
                            </span>
                        </CardContent>
                    </Card>                
                    </div>
                    <CanvasJSChart options = {options}
                    />
                </div>
            );     
            
        }else{
            return (
                <div>
                    
                </div>
            );   
        }
    }

};

const mapStateToProps = state => ({
    filename: state.upload.filename,
    stationaryTestData: state.upload.stationaryTestData,
    meanGraph: state.upload.meanGraph,
    stdGraph: state.upload.stdGraph,
    graphData: state.upload.graphData,
    loading: state.upload.loading,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});
  
export default connect(mapStateToProps, { testStationary })(StationaryTest);