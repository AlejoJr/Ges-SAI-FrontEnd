import React, {useState} from "react";

//import imgLoading from '../images/loader.gif';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Loading = () => {
    return (
        /*<Spinner animation="border" variant="primary"/>*/
        <CircularProgress color="primary"/>
        /*<div className="img-loading">
            <img src={imgLoading} height="200" width="200" alt="Imagen Loading"/>
        </div>*/
    )
}

function Message(props) {
    const [open, setOpen] = useState(props.isActive);
    const vertical = 'top'
    const horizontal = 'right'

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };


    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </>
    );
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={8000}
                onClose={handleClose}
                action={action}
                anchorOrigin={{vertical, horizontal}}
            >
                <Alert onClose={handleClose} severity={props.severity} sx={{width: '100%'}}>
                    {props.message}
                </Alert>
            </Snackbar>
        </>
    )
}

function ValidateFields(value) {
    if (value.hasOwnProperty('group')) {
        value.groupId = value.group !== null ? value.group : null;
        delete value.group;
    }
    if (value.hasOwnProperty('group_id')) {
        value.groupId = value.group_id !== null ? value.group_id : null;
        delete value.group_id;
    }
    if (value.hasOwnProperty('pool')) {
        value.poolId = value.pool !== null ? value.pool.id : null;
        delete value.pool;
    }
    if (value.hasOwnProperty('pool_id')) {
        value.poolId = value.pool_id !== null ? value.pool_id : null;
        delete value.pool_id;
    }
    if (value.hasOwnProperty('user_id')) {
        delete value.user_id;
        value.user = GetIdUser();
    }
    if (value.hasOwnProperty('power_state')) {
        delete value.power_state;
    }
    if (value.hasOwnProperty('ref')) {
        delete value.ref;
    }

    return value
}

function SerializerHost_MV(value, index, idGroup) {
    var idPool = ''
    if (value.hasOwnProperty('poolId')) {
        idPool = value.poolId;
    }
    if (value.hasOwnProperty('pool_id')) {
        idPool = value.pool_id;
    }

    var host_virtual_machine = {
        "name_host": value.name_host,
        "ip": null,
        "mac": null,
        "so": null,
        "groupId": idGroup,
        "order": index + 1,
        "description": null,
        "poolId": idPool,
        "user": GetIdUser(),
        "type_host": value.type_host,
        "sais": []
    }

    return host_virtual_machine
}


//<<--| D A T O S - D E L - U S U A R I O - E N - S E S S I O N |-->>

function GetToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
}

function GetIdUser() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.id;
}

function GetUsername() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.username;
}


function GetIsTechnical() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.is_superuser;
}

export {Loading, Message, ValidateFields, SerializerHost_MV, GetToken, GetIdUser, GetUsername, GetIsTechnical};