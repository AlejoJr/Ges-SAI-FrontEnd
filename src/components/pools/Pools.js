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
import SyncIcon from '@mui/icons-material/Sync';
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
import {deletePool, getPools, syncronizePool} from "../../services/Pools";
import {Loading} from "../utils/LittleComponents";

/***
 * Componente que lista los POOL
 ***/
function Pool() {

    let navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [namePoolLoading, setNamePoolLoading] = useState('');
    const [pools, setPools] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isErrorSyncPool, setErrorSyncPool] = useState(false);




    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    useEffect(function () {
        getPools_Api()
    }, [])

    const getPools_Api = async () => {

        const poolsJson = await getPools();

        //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
        var listPools = poolsJson.results.sort(function (a, b) {
            if (a.name_pool == b.name_pool) {
                return 0;
            }
            if (a.name_pool < b.name_pool) {
                return -1;
            }
            return 1;
        });

        setPools(listPools);
    }

    // <<-- | E L I M I N A R - U N - P O O L  |-->
    const poolDelete = (pool) => () => {
        confirmAlert({
            title: 'Borrar POOL',
            message: 'Esta seguro de borrar el Pool: ' + pool.name_pool,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        // <<- 1). Eliminamos el pool de la Base de datos ->>
                        deletePool(pool.id)
                        // <<- 2). Eliminamos el pool de la lista (listPools) ->>
                        var listPools = pools.filter(el => el.id !== pool.id);
                        // <<- 3). Actualizamos el Estado (pools) ->>
                        setPools(listPools);
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | S I N C R O N I Z A R - U N - P O O L  |-->
    const syncPool = (pool) => async () => {
        setNamePoolLoading(pool.name_pool);
        setLoading(true);
        const syncPoolsJson = await syncronizePool(pool);

        if (syncPoolsJson === 'Sync-OK') {
            setLoading(false);
        }else{
            setLoading(false);
            setErrorSyncPool(true);
        }

    }


    // <<-- | A C O R D I O N - P O O L |-->
    const ItemPool = ((value) => {
        return (
            <Accordion expanded={expanded === value.pool.name_pool} onChange={handleChange(value.pool.name_pool)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.pool.name_pool}
                    id={value.pool.id}
                >
                    <Typography variant="subtitle1">{value.pool.name_pool}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="button" component="div">
                        <strong>Nombre:</strong> {value.pool.name_pool} <br/>
                        <strong>Ip:</strong> {value.pool.ip}<br/>
                        <strong>Url:</strong> {value.pool.url} <br/>
                        <strong>Username:</strong> {value.pool.username}<br/>
                        <strong>Hipervisor:</strong> {value.pool.type}<br/>
                    </Typography>


                    <Tooltip title="Editar Pool">
                        <IconButton aria-label="edit-pool" color="primary"
                                    onClick={() => {
                                        navigate(`/pool/${value.pool.id}`)
                                    }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Pool">
                        <IconButton aria-label="delete-pool" color="primary"
                                    onClick={poolDelete(value.pool)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sincronizar Pool">
                        <IconButton aria-label="sync-pool" color="primary"
                                    onClick={syncPool(value.pool)}>
                            <SyncIcon/>
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
        if (event.currentTarget.id === 'createPool') {
            navigate(`/pool/${0}`)
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
            <Title title={'POOLS'}/>
            <SubTitle title={'_'}/>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={2}>
                <Card sx={{minWidth: '97%'}}>
                    <CardContent>
                        {
                            isLoading && <Loading></Loading>
                        }
                        {
                            isLoading && <p>Sincronizando Pool: <strong>{namePoolLoading}</strong></p>
                        }
                        {
                            isErrorSyncPool && <p><strong>Ocurrio un Error Sincronizando Pool:</strong> {namePoolLoading}</p>
                        }
                        {pools.map((value, index) => (
                            <ItemPool pool={value} key={`pool-${index}`} index={index}/>
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
                <MenuItem id="createPool" onClick={handleClose}>Alta Pool</MenuItem>
            </Menu>
        </Grid>
    )

}

export default Pool