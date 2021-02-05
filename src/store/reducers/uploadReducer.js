import { 
        LOADING, LOADING_COMPLETE,
        UPLOAD_SUCCESS, UPLOAD_ERROR,
        INITIAL_PLOT_SUCCESS, INITIAL_PLOT_ERROR, 
        STATIONARITY_TEST_SUCCESS, STATIONARITY_TEST_ERROR,
        PLOT_AVERAGE_SUCCESS, PLOT_AVERAGE_ERROR,
        LOAD_AVERAGE_SUCCESS, LOAD_AVERAGE_ERROR,
        CORELATION_PLOT_SUCCESS, CORELATION_PLOT_ERROR,
        DECOMPOSE_PLOT_SUCCESS, DECOMPOSE_PLOT_ERROR,
        TRAIN_ARIMA_SUCCESS, TRAIN_ARIMA_FALIURE,
        TRAIN_LSTM_SUCCESS, TRAIN_LSTM_ERROR,
        AUTO_ARIMA_SUCCESS, AUTO_ARIMA_ERROR,
        FORECAST_SUCCESS, FORECAST_ERROR } from "../actions/types"

const initialState = {
    loading: false,
    filename: localStorage.getItem("filename"),
    avg_filename: localStorage.getItem("avg_filename"),
    graphData: [],
    avgGraphData: [],
    stationaryTestData: null,
    meanGraph: [],
    stdGraph: [],
    acf: [],
    pacf: [],
    size: 0,
    trend: [],
    seasonal: [],
    resid: [],
    results: [],
    predictions: [],
    test: [],
    model: [],
    mape: null,
    mapeValidation: null
};
  
export default function(state = initialState, action) {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case LOADING_COMPLETE:
            return {
                ...state,
                loading: false
            }
        case UPLOAD_SUCCESS:
            localStorage.setItem("filename", action.payload.filename);
            localStorage.setItem("split", action.payload.split);
            localStorage.removeItem("avg_filename");
            localStorage.removeItem("days");
            return {
                ...state,
                filename: action.payload.filename,
                graphData: action.payload.data
            };
        case UPLOAD_ERROR:
            localStorage.removeItem("filename");
            return {
                ...state,
                filename: null,
                graphData: []
            };
        case INITIAL_PLOT_SUCCESS:
            return {
                ...state,
                graphData: action.payload.data 
            };
        case INITIAL_PLOT_ERROR:
            localStorage.removeItem("filename");
            localStorage.removeItem("avg_filename");
            localStorage.removeItem("days");
            return {
                ...state,
                graphData: []
            };
        case STATIONARITY_TEST_SUCCESS:
            return {
                ...state,
                stationaryTestData: action.payload.results["0"],
                meanGraph: action.payload.mean,
                stdGraph: action.payload.std,
                graphData: action.payload.data
            };
        case STATIONARITY_TEST_ERROR:
            return {
                ...state,
                stationaryTestData: {}
            };
        case PLOT_AVERAGE_SUCCESS:
            localStorage.setItem("avg_filename", action.payload.filename);
            localStorage.setItem("days", action.payload.days);
            return {
                ...state,
                avg_filename: action.payload.avg_filename,
                avgGraphData: action.payload.data
            };
        case PLOT_AVERAGE_ERROR:
            localStorage.removeItem("filename");
            localStorage.removeItem("avg_filename");
            localStorage.removeItem("days");
            return {
                ...state,
                avg_filename: null,
                avgGraphData: []
            };
        case LOAD_AVERAGE_SUCCESS:
            return {
                ...state,
                avgGraphData: action.payload.data 
            };
        case LOAD_AVERAGE_ERROR:
            return {
                ...state,
                avgGraphData: []
            };
        case CORELATION_PLOT_SUCCESS:
            return {
                ...state,
                acf: action.payload.acf,
                pacf: action.payload.pacf,
                size: action.payload.size
            };
        case CORELATION_PLOT_ERROR:
            return {
                ...state,
                acf: [],
                pacf: [],
                size: 0
            }
        case DECOMPOSE_PLOT_SUCCESS:
            return {
                ...state,
                trend: action.payload.trend,
                seasonal: action.payload.seasonal,
                resid: action.payload.resid
            }
        case DECOMPOSE_PLOT_ERROR:
            return {
                ...state,
                trend: [],
                seasonal: [],
                resid: []
            }
        case TRAIN_ARIMA_SUCCESS:
            localStorage.setItem("p", action.payload.p);
            localStorage.setItem("q", action.payload.q);
            localStorage.setItem("d", action.payload.d);
            localStorage.setItem("P", action.payload.P);
            localStorage.setItem("Q", action.payload.Q);
            localStorage.setItem("D", action.payload.D);
            localStorage.setItem("s", action.payload.s);
            localStorage.setItem("lam", action.payload.lam);
            localStorage.setItem("arima_filename", action.payload.filename);
            return {
                ...state,
                results: action.payload.results,
                predictions: action.payload.predictions,
                graphData: action.payload.data,
                test: action.payload.test,
                mape: action.payload.mape,
                mapeValidation: action.payload.mapeValidation
            }
        case TRAIN_ARIMA_FALIURE:
            localStorage.removeItem("p");
            localStorage.removeItem("q");
            localStorage.removeItem("d");
            localStorage.removeItem("P");
            localStorage.removeItem("Q");
            localStorage.removeItem("D");
            localStorage.removeItem("s");
            localStorage.removeItem("lam");
            localStorage.removeItem("arima_filename");
            return {
                ...state,
                results: [],
                graphData: [],
                mape: null,
                mapeValidation: null
            }
        case AUTO_ARIMA_SUCCESS:
            localStorage.setItem("model", action.payload.model);
            localStorage.setItem("p1", action.payload.p);
            localStorage.setItem("d1", action.payload.d);
            localStorage.setItem("q1", action.payload.q);
            localStorage.setItem("P1", action.payload.P);
            localStorage.setItem("D1", action.payload.D);
            localStorage.setItem("Q1", action.payload.Q);
            localStorage.setItem("s1", action.payload.s);
            localStorage.setItem("lam1", action.payload.lam);
            localStorage.setItem("auto_arima_filename", action.payload.filename);
            return {
                ...state,
                predictions: action.payload.predictions,
                graphData: action.payload.data,
                test: action.payload.test,
                mapeValidation: action.payload.mapeValidation,
                model: action.payload.model
            }
        case AUTO_ARIMA_ERROR:
            localStorage.removeItem("model");
            localStorage.removeItem("p1");
            localStorage.removeItem("d1");
            localStorage.removeItem("q1");
            localStorage.removeItem("P1");
            localStorage.removeItem("D1");
            localStorage.removeItem("Q1");
            localStorage.removeItem("s1");
            localStorage.removeItem("lam1");
            localStorage.removeItem("auto_arima_filename");
            return {
                ...state,
                predictions: [],
                graphData: [],
                test: [],
                model: null,
                mapeValidation: null
            }
        case TRAIN_LSTM_SUCCESS:
            localStorage.setItem("look_back", action.payload.look_back);
            localStorage.setItem("batch_size", action.payload.batch_size);
            localStorage.setItem("epochs", action.payload.epochs);
            localStorage.setItem("lstm_filename", action.payload.filename);
            return {
                ...state,
                results: action.payload.results,
                predictions: action.payload.predictions,
                graphData: action.payload.data,
                test: action.payload.test,
                mape: action.payload.mape,
                mapeValidation: action.payload.mapeValidation
            }
        case TRAIN_LSTM_ERROR:
            localStorage.removeItem("look_back");
            localStorage.removeItem("batch_size");
            localStorage.removeItem("epochs");
            localStorage.removeItem("lstm_filename");
            return {
                ...state,
                results: [],
                predictions: [],
                graphData: [],
                test: [],
                mape: null,
                mapeValidation: null
            }
        case FORECAST_SUCCESS:
            return {
                ...state,
                predictions: action.payload.predictions
            }
        case FORECAST_ERROR:
            return {
                ...state,
                predictions: []
            }
        default:
            return state;
    }
}