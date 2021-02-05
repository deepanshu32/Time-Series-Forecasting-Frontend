import React, {useState, useEffect} from 'react';
import './App.css';
import Main from "./main"
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./store/actions/auth";

function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )

}

export default App;
