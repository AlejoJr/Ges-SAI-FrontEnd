import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import {confirmAlert} from "react-confirm-alert";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import ListIcon from "@mui/icons-material/List";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {GetUsername} from "../utils/LittleComponents";
import {SubTitle, Title} from "../utils/Title";
import {deleteUser, getUsers} from "../../services/Users";

/***
 * Componente que lista los Usuarios
 ***/
function Users() {

    let navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [users, setUsers] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [nameUserLogued, setNameUserLogued] = useState('');


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    useEffect(function () {
        getUsers_Api()
    }, [])

    const getUsers_Api = async () => {

        const usersJson = await getUsers();

        //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
        var listUsers = usersJson.results.sort(function (a, b) {
            if (a.username == b.username) {
                return 0;
            }
            if (a.username < b.username) {
                return -1;
            }
            return 1;
        });

        //Obtenemos el usuario en session y lo omitimos de la lista
        const userLogued = GetUsername();
        setNameUserLogued(userLogued);
        //listUsers = listUsers.filter(el => el.username !== userLogued);

        setUsers(listUsers);
    }

    // <<-- | E L I M I N A R - U N - U S U A R I O  |-->
    const userDelete = (user) => () => {
        confirmAlert({
            title: 'Borrar Usuario',
            message: 'Esta seguro de borrar el usuario: ' + user.username,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        // <<- 1). Eliminamos el user de la Base de datos ->>
                        deleteUser(user.id)
                        // <<- 2). Eliminamos el user de la lista (listUsers) ->>
                        var listUsers = users.filter(el => el.id !== user.id);
                        // <<- 3). Actualizamos el Estado (users) ->>
                        setUsers(listUsers);
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | F O R M A T E A R - S T R I N G  |-->
    const FormatData = ((value) => {
        if (value.usr === true) {
            return <a> SI </a>;
        } else {
            return <a> NO </a>;
        }
    });

    // <<-- | A C O R D I O N - U S E R  |-->
    const ItemUser = ((value) => {
        return (
            <Accordion expanded={expanded === value.user.username} onChange={handleChange(value.user.username)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.user.username}
                    id={value.user.id}
                >
                    <Typography variant="subtitle1">{value.user.username}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="button" component="div">
                        <strong>Login:</strong> {value.user.username} <br/>
                        <strong>Nombre:</strong> {value.user.first_name} <br/>
                        <strong>Email:</strong> {value.user.email}<br/>
                        <strong>Es Técnico:</strong>{<FormatData usr={value.user.is_superuser}/>}<br/>
                    </Typography>


                    <Tooltip title="Editar Usuario">
                        <IconButton aria-label="edit-user" color="primary"
                                    onClick={() => {
                                        navigate(`/user/${value.user.id}`)
                                    }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    {nameUserLogued !== value.user.username &&
                        <Tooltip title="Eliminar Usuario">
                            <IconButton aria-label="delete-user" color="primary"
                                        onClick={userDelete(value.user)}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>}
                </AccordionDetails>
            </Accordion>
        );
    });


    //F U N C I O N E S - D E - E L - B O T O N - D E - O P C I O N E S
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        if (event.currentTarget.id === 'createUser') {
            navigate(`/user/${0}`)
        }
    };

    // Estilos del boton para que se quede fijo por toda la pagina
    const fabStyle = {
        position: 'fixed',
        bottom: 20,
        right: 20,
    };


    return (
        <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              marginTop={5}
              style={{minHeight: '100vh'}}>
            <Title title={'USUARIOS'}/>
            <SubTitle title={'_'}/>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={2}>
                <Card sx={{minWidth: '97%'}}>
                    <CardContent>
                        {users.map((value, index) => (
                            <ItemUser user={value} key={`user-${index}`} index={index}/>
                        ))}
                    </CardContent>
                    {/*<CardActions>
                    <Button size="small">Alta Maquina</Button>
                </CardActions>*/}
                </Card>
            </Grid>

            <Fab id="demo-positioned-button"
                 aria-controls={open ? 'demo-positioned-menu' : undefined}
                 aria-haspopup="true"
                 aria-expanded={open ? 'true' : undefined}
                 color="primary"
                 aria-label="add"
                 onClick={handleClick}
                 sx={fabStyle}>
                <ListIcon/>
            </Fab>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem id="createUser" onClick={handleClose}>Alta Usuario</MenuItem>
            </Menu>
        </Grid>
    )

}

export default Users