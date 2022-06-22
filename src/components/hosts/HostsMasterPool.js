import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Tooltip from '@mui/material/Tooltip';
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import {confirmAlert} from "react-confirm-alert";
import {deleteHost} from "../../services/Hosts";

/***
 * Componente que lista los Hosts Master del POOL
 * @param: props.hosts = Lista de los hosts Master (HM)
 * @param: props.setHosts = Estado del componente padre (ContainerHosts) para actualizar la lista de hosts
 ***/
function HostsMasterPool(props) {

    let navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
    var listHost = props.hosts.sort(function (a, b) {
        if (a.name_host === b.name_host) {
            return 0;
        }
        if (a.name_host < b.name_host) {
            return -1;
        }
        return 1;
    })

    // <<-- | E L I M I N A R - U N A - M Á Q U I N A  |-->
    /*const hostDelete = (host) => () => {
        confirmAlert({
            title: 'Borrar Pool',
            message: 'Esta seguro de borrar el Host Master: ' + host.name_host,
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
    }*/

    // <<-- | F O R M A T E A R - S T R I N G - (S I S T E M A - O P E R A T I V O)  |-->
    /*const OperatingSystem = ((value) => {
        if (value.so === 'W') {
            return <a> Windows</a>;
        } else if (value.so === 'L') {
            return <a> Linux</a>;
        } else if (value.so === 'M') {
            return <a> Mac</a>;
        } else {
            return <a> --</a>;
        }
    });*/

    const tab = <>&nbsp;&nbsp;&nbsp;&nbsp;</>;

    const ItemHostOthers = ((value) => {
        return (
            <Typography variant="button" component="div">
                {tab} <LaptopMacIcon></LaptopMacIcon> {value.other.name_host} <br/>
            </Typography>
        );
    });


    // <<-- | A C O R D I O N - H O S T - M A S T E R  |-->
    const ItemHost = ((value) => {
        return (
            <Accordion expanded={expanded === value.host.name_pool} onChange={handleChange(value.host.name_pool)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.host.name_pool}
                    id={value.host.id}
                >
                    <Typography variant="subtitle1">{value.host.name_pool}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="button" component="div">
                        <strong>Host Master:</strong> {value.host.name_host}<br/>
                        <strong>Ip:</strong> {value.host.ip} <br/>
                        <strong>Mac:</strong> {value.host.mac} <br/>
                        <strong>Url:</strong> {value.host.url} <br/>
                        <strong>Host:</strong>
                        {value.host.others.map((value, index) => (
                            <ItemHostOthers other={value} key={`other-${index}`} index={index}/>
                        ))}
                    </Typography>
                    {/*<Tooltip title="Editar Pool">
                        <IconButton
                            color="primary"
                            aria-label="edit-machine"
                            onClick={() => {
                                navigate(`/host/${value.host.id}`)
                            }}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Nuevo Grupo">
                        <IconButton
                            aria-label="new-group"
                            color="primary"
                            onClick={() => {
                                 navigate(`/pool/${value.host.pool.id}/group/${0}`)
                            }}>
                            <GroupWorkIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Pool">
                        <IconButton
                            aria-label="delete-machine"
                            color="primary"
                            onClick={hostDelete(value.host)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>*/}
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
                </Card>
            </Grid>
        </>
    )

}

export default HostsMasterPool