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

import {SubTitle, Title} from "../utils/Title";
import {deleteSai, getSais} from "../../services/Sais";

/***
 * Componente que lista los SAIS
 ***/
function Sais() {

    let navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [sais, setSais] = useState([]);
    const [expanded, setExpanded] = useState(false);


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    useEffect(function () {
        getSais_Api()
    }, [])

    const getSais_Api = async () => {

        const saisJson = await getSais();

        //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
        var listSais = saisJson.results.sort(function (a, b) {
            if (a.name_sai == b.name_sai) {
                return 0;
            }
            if (a.name_sai < b.name_sai) {
                return -1;
            }
            return 1;
        });

        setSais(listSais);
    }

    // <<-- | E L I M I N A R - U N - S A I  |-->
    const saiDelete = (sai) => () => {
        confirmAlert({
            title: 'Borrar SAI',
            message: 'Esta seguro de borrar el SAI: ' + sai.name_sai,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        // <<- 1). Eliminamos el sai de la Base de datos ->>
                        deleteSai(sai.id)
                        // <<- 2). Eliminamos el sai de la lista (listSais) ->>
                        var listSais = sais.filter(el => el.id !== sai.id);
                        // <<- 3). Actualizamos el Estado (sais) ->>
                        setSais(listSais);
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | A C O R D I O N - U S E R  |-->
    const ItemSai = ((value) => {
        return (
            <Accordion expanded={expanded === value.sai.name_sai} onChange={handleChange(value.sai.name_sai)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.sai.name_sai}
                    id={value.sai.id}
                >
                    <Typography variant="subtitle1">{value.sai.name_sai}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="button" component="div">
                        <strong>Nombre:</strong> {value.sai.name_sai} <br/>
                        <strong>Url:</strong> {value.sai.url} <br/>
                        <strong>Ip:</strong> {value.sai.ip}<br/>
                        <strong>Mac:</strong> {value.sai.mac}<br/>
                        <strong>Codigo MIB:</strong> {value.sai.code_oid}<br/>
                        <strong>Apagar Máquinas a los :</strong> {value.sai.value_off} Min<br/>
                        <strong>Encender Máquinas a los :</strong> {value.sai.value_on} Min<br/>
                    </Typography>


                    <Tooltip title="Editar Sai">
                        <IconButton aria-label="edit-sai" color="primary"
                                    onClick={() => {
                                        navigate(`/sai/${value.sai.id}`)
                                    }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Sai">
                        <IconButton aria-label="delete-sai" color="primary"
                                    onClick={saiDelete(value.sai)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
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
        if (event.currentTarget.id === 'createSai') {
            navigate(`/sai/${0}`)
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
            <Title title={'SAIS'}/>
            <SubTitle title={'_'}/>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={2}>
                <Card sx={{minWidth: '97%'}}>
                    <CardContent>
                        {sais.map((value, index) => (
                            <ItemSai sai={value} key={`sai-${index}`} index={index}/>
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
                <MenuItem id="createSai" onClick={handleClose}>Alta Sai</MenuItem>
            </Menu>
        </Grid>
    )

}

export default Sais