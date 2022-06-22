import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListIcon from '@mui/icons-material/List';
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Groups from "../../components/groups/Groups";
import Pools from "./Pools";
import {getHosts, getHostsMaster} from "../../services/Hosts";
import {Title, SubTitle} from "../../components/utils/Title";
import {GetIdUser} from "../../components/utils/LittleComponents";

/***
 * Componente (principal contenedor) que muestra los componentes (Pools y Pools-Groups_uno)
 ***/
function ContainerPools() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    let navigate = useNavigate();
    const [hosts, setHosts] = useState([]); //Hosts sin grupo
    const [hostGroups, setHostGroup] = useState([]); //Hosts Con grupo

    useEffect(function () {
        setHostGroup([]);
        getHosts_Api();
    }, [])

    //Obtener los ContainerHosts de la API
    const getHosts_Api = async () => {
        const idUser = GetIdUser();
        const hostsMasterJson = await getHostsMaster(idUser);

        //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
        var resultHost = hostsMasterJson.hosts.sort(function (a, b) {
            if (a.name_host === b.name_host) {
                return 0;
            }
            if (a.name_host < b.name_host) {
                return -1;
            }
            return 1;
        })

        const hostsJson = await getHosts();
        //Recorremos los host y los agrupamos si pertenecen a un grupo
        hostsJson.results.forEach(host => {
            if (host.group !== null) {
                if (!hostGroups.hasOwnProperty(host.group.id)) {
                    hostGroups[host.group.id] = {
                        idGroup: host.group.id,
                        nameGroup: host.group.name_group,
                        hosts: []
                    }
                }

                hostGroups[host.group.id].hosts.push({
                    id: host.id,
                    name_host: host.name_host,
                    ip: host.ip,
                    mac: host.mac,
                    so: host.so,
                    type_host: host.type_host,
                    group: host.group.id,
                    order: host.order,
                    description: host.description,
                    pool: host.pool,
                    user: host.user
                })
            }
        })

        setHosts(resultHost);
    }


    //F U N C I O N E S - D E - E L - B O T O N - D E - O P C I O N E S
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        if (event.currentTarget.id === 'altaPool') {
            navigate(`/pool/${0}`)
        }
        if (event.currentTarget.id === 'newGroup') {
            navigate(`/group/${0}`)
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
            <Title title={'VIRTUALIZACIÓN'}/>

            {<SubTitle title={'Pools'}/>}
            <Pools
                //Enviamos el estado (setHost) a este componente hijo para que lo actualice
                hosts={hosts}
                setHosts={setHosts}
            />

            <SubTitle title={'Grupos con orden de apagado'}/>
            {hostGroups.map((value, index) => (
                <Groups
                    group={value}
                    key={`group-${index}`}
                    hostGroups={hostGroups}
                    // Se envia lista de hosts sin grupo para actualizarla cuando se borre un grupo
                    hosts={hosts}
                    setHosts={setHosts}
                />
            ))}
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
                <MenuItem id="altaPool" onClick={handleClose}>Alta Pool</MenuItem>
                <MenuItem id="newGroup" onClick={handleClose}>Nuevo Grupo</MenuItem>
            </Menu>
        </Grid>

    );

}

export default ContainerPools