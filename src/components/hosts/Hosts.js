import React, {useState} from "react";
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
import {deleteHost, getTreeDependence} from "../../services/Hosts";
import Tooltip from "@mui/material/Tooltip";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

/***
 * Componente que lista los Hosts sin grupo
 * @param: props.hosts = Lista de los hosts
 * @param: props.setHosts = Estado del componente padre (ContainerHosts) para actualizar la lista de hosts
 ***/
function Hosts(props) {

    let navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
    var listHost = props.hosts.sort(function (a, b) {
        if (a.name_host == b.name_host) {
            return 0;
        }
        if (a.name_host < b.name_host) {
            return -1;
        }
        return 1;
    })

    // <<-- | E L I M I N A R - U N A - M Á Q U I N A  |-->
    const hostDelete = (host) => () => {
        confirmAlert({
            title: 'Borrar Maquina',
            message: 'Esta seguro de borrar la Maquina: ' + host.name_host,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        // <<- 1). Eliminamos el host de la Base de datos ->>
                        deleteHost(host.id)
                        // <<- 2). Eliminamos el Host de la lista (listHost) ->>
                        listHost = listHost.filter(el => el.id !== host.id);
                        // <<- 3). Actualizamos el Estado (hosts) del componente Padre (ContainerHosts) ->>
                        props.setHosts(listHost);
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | F O R M A T E A R - S T R I N G - (S I S T E M A - O P E R A T I V O)  |-->
    const OperatingSystem = ((value) => {

        if (value.so === 'W') {
            return <a> Windows</a>;
        } else if (value.so === 'L') {
            return <a> Linux</a>;
        } else if (value.so === 'M') {
            return <a> Mac</a>;
        } else {
            return <a> --</a>;
        }
    });


    const tab = <>&nbsp;&nbsp;&nbsp;&nbsp;</>;

    const ItemHostDependences = ((value) => {
        return (
            <Typography variant="button" component="div">
                {tab} <LaptopMacIcon></LaptopMacIcon> {value.child.name_host} - ({value.child.type_host})<br/>
            </Typography>
        );
    });


    // <<-- | A C O R D I O N - H O S T  |-->
    const ItemHost = ((value) => {
        return (
            <Accordion expanded={expanded === value.host.name_host} onChange={handleChange(value.host.name_host)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.host.name_host}
                    id={value.host.id}
                >
                    <Typography variant="subtitle1">{value.host.name_host}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        value.host.type_host === 'MF' &&
                        <Typography variant="button" component="div">
                            <strong>Máquina física</strong><br/><br/>
                            <strong>Ip:</strong> {value.host.ip} <br/>
                            <strong>Mac:</strong> {value.host.mac} <br/>
                            <strong>Sitema Operativo:</strong>{<OperatingSystem so={value.host.so}/>}<br/>
                            <strong>Descripción:</strong> {value.host.description}<br/>
                            {/*value.host.host_host.length > 0 &&
                            < strong> Dependencias:</strong>
                            */}
                            {/*value.host.host_host.map((value, index) => (
                                <ItemHostDependences child={value} key={`child-${index}`} index={index}/>
                            ))*/}
                        </Typography>
                    }
                    {
                        value.host.type_host === 'MV' &&
                        <Typography variant="button" component="div">
                            <strong>Máquina virtual</strong> <br/><br/>
                            <strong>Pool:</strong> {value.host.pool.name_pool} <br/>
                        </Typography>
                    }
                    {
                        value.host.type_host === 'HM' &&
                        <Typography variant="button" component="div">
                            <strong>Host Master</strong> <br/>
                            <strong>Pool:</strong> {value.host.pool.name_pool} <br/>
                            <strong>Ip:</strong> {value.host.pool.ip} <br/>
                        </Typography>
                    }
                    {
                        value.host.type_host === 'SM' &&
                        <Typography variant="button" component="div">
                            <strong>Máquina de almacenamiento</strong><br/><br/>
                            <strong>Ip:</strong> {value.host.ip} <br/>
                            <strong>Mac:</strong> {value.host.mac} <br/>
                            <strong>Sitema Operativo:</strong>{<OperatingSystem so={value.host.so}/>}<br/>
                            <strong>Descripción:</strong> {value.host.description}<br/>
                            {/*value.host.host_host.length > 0 &&
                            < strong> Dependencias:</strong>
                            */}
                            {/*value.host.host_host.map((value, index) => (
                                <ItemHostDependences child={value} key={`child-${index}`} index={index}/>
                            ))*/}
                        </Typography>
                    }
                    <Tooltip title="Editar Máquina">
                        <IconButton aria-label="edit-machine" color="primary"
                                    onClick={() => {
                                        navigate(`/host/${value.host.id}`)
                                    }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Máquina">
                        <IconButton aria-label="delete-machine" color="primary"
                                    onClick={hostDelete(value.host)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </AccordionDetails>
            </Accordion>
        );
    });


    return (
        <>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={2}>
                <Card sx={{minWidth: '97%'}}>
                    <CardContent>
                        {listHost.map((value, index) => (
                            <ItemHost host={value} key={`host-${index}`} index={index}/>
                        ))}
                    </CardContent>
                    {/*<CardActions>
                    <Button size="small">Alta Maquina</Button>
                </CardActions>*/}
                </Card>
            </Grid>
        </>
    )

}

export default Hosts