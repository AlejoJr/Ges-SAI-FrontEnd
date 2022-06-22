import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import {createTheme, ThemeProvider} from '@mui/material/styles';


const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: '#009688',
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
        },
    },
});
ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Root name="Toda la gloria es para Dios"/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')

    // LE QUITE EL MODO ESTRICTO PARA QUE NO ME MUESTRE ADVERTENCIAS PERO HAY QUE VOLVERLO A PONER
    /*<Root name="Toda la gloria es para Dios"/>,
    document.getElementById('root')*/
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
