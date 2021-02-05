import { LOADING, LOADING_COMPLETE,
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
    FORECAST_SUCCESS, FORECAST_ERROR } from "./types"
import axios from "axios";
import { toast } from "react-toastify";

export const upload = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"upload",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: UPLOAD_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: UPLOAD_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const loadInitialPlot = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"plotInitial",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: INITIAL_PLOT_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: INITIAL_PLOT_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const testStationary = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"stationarity",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: STATIONARITY_TEST_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: STATIONARITY_TEST_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const plotAverage = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"average",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: PLOT_AVERAGE_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: PLOT_AVERAGE_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const loadAveragePlot = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"plotAverage",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: LOAD_AVERAGE_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: LOAD_AVERAGE_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const plotCorelation = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"corelation",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: CORELATION_PLOT_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: CORELATION_PLOT_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const plotDecompose = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"decompose",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: DECOMPOSE_PLOT_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: DECOMPOSE_PLOT_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const trainArima = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"arima",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: TRAIN_ARIMA_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: TRAIN_ARIMA_FALIURE,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const autoArima = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"autoArima",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: AUTO_ARIMA_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: AUTO_ARIMA_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const trainLSTM = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"lstm",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: TRAIN_LSTM_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: TRAIN_LSTM_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}

export const forecast = formData => dispatch => {
    dispatch({
        type: LOADING
    });
    axios({
        method: 'post',
        url: process.env.REACT_APP_BACKEND_URL+"forecast",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
        dispatch({
            type: FORECAST_SUCCESS,
            payload: response.data
        });
        dispatch({
            type: LOADING_COMPLETE
        });
    })
    .catch((error) => {
        console.log(error);
        dispatch({
            type: FORECAST_ERROR,
            payload: null
        });
        dispatch({
            type: LOADING_COMPLETE
        });
        toast.error("Server error!!");
    });
}



