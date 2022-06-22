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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

/***
 * Componente que lista los Hosts Master del POOL
 * @param: props.hosts = Lista de los hosts Master (HM)
 * @param: props.setHosts = Estado del componente padre (ContainerHosts) para actualizar la lista de hosts
 ***/
function Dependences(props) {

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


    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );

    // <<-- | A C O R D I O N - H O S T - M A S T E R  |-->
    const ItemHost = ((value) => {
        return (
            <Accordion expanded={expanded === value.host.name} onChange={handleChange(value.host.name)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={value.host.name}
                    id={value.host.id}
                >
                    <Typography variant="subtitle1">{value.host.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TreeView
                        aria-label="rich object"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon/>}
                        sx={{height: 150, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
                    >
                        {renderTree(value.host)}
                    </TreeView>
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

export default Dependences