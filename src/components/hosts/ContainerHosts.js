import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListIcon from '@mui/icons-material/List';
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Groups from "../groups/Groups";
import Hosts from "./Hosts";
import HostsMasterPool from "./HostsMasterPool";
import {getHosts, getHostsMaster, getTreeDependence, getAllFathers} from "../../services/Hosts";
import {Title, SubTitle} from "../utils/Title";
import {GetIdUser} from "../utils/LittleComponents";
import Dependences from "../groups/Dependences";

/***
 * Componente (principal contenedor) que muestra los componentes (Hosts y Groups_uno)
 ***/
function ContainerHosts() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    let navigate = useNavigate();
    const [hosts, setHosts] = useState([]); //Hosts sin grupo
    const [hostGroups, setHostGroup] = useState([]); //Hosts Con grupo
    const [pools, setPools] = useState([]); //Pools (Hosts-Master)
    const [trees, setTrees] = useState([]); //Arboles (dependencias)

    useEffect(function () {
        getHosts_Api();
    }, [])

    //Obtener los ContainerHosts de la API
    const getHosts_Api = async () => {

        const idUser = GetIdUser();
        const hostsMasterJson = await getHostsMaster(idUser);

        if (hostsMasterJson !== 'Without-Machines') {
            //<<-- | O R D E N A M O S - A L F A B E T I C A M E N T E - (Aa-Zz)  |-->
            var resultPools = hostsMasterJson.hosts.sort(function (a, b) {
                if (a.name_host == b.name_host) {
                    return 0;
                }
                if (a.name_host < b.name_host) {
                    return -1;
                }
                return 1;
            });

            resultPools.map((host) => {
                if (!pools.hasOwnProperty(host.pool.id)) {
                    pools[host.pool.id] = {
                        name_pool: host.pool.name_pool,
                        name_host: host.name_host,
                        ip: host.pool.ip,
                        mac: host.mac,
                        url: host.pool.url,
                        others: []
                    }
                }

                hostsMasterJson.others.map((value) => {
                    if (value.pool.id === host.pool.id) {
                        pools[host.pool.id].others.push({
                            name_host: value.name_host,
                        })
                    }
                });
            });

            setPools(pools.filter(el => el != null))
            //setPools(resultPools);
        }

        const hostsJson = await getHosts();

        //Ordenamos ascendentemente por grupo
        var resultHost = hostsJson.results.sort(function (a, b) {
            return (a.group - b.group)
        })

        //Excluimos las maquinas host master (Hipervisor)
        var listHosts = resultHost.filter(el => el.type_host !== 'HM');

        //Recorremos los host y los agrupamos si pertenecen a un grupo
        /*listHosts.forEach(host => {
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

        setHostGroup(hostGroups.filter(el => el != null))*/

        //<<- Filtramos los host - (Maquinas Fisicas y Maquinas almacenaje) ->>

        function filterMachinesMF_SM(obj) {
            if (obj.type_host === 'MF' || obj.type_host === 'SM') {
                return true;
            } else {
                return false;
            }
        }

        var listFilterHost = listHosts.filter(filterMachinesMF_SM);

        setHosts(listFilterHost);
        //setHosts(listHosts.filter(el => el.type_host === 'MF'));

        //<<- Obtener todos los padres mayores para consultar sus ramas (hijos)
        const allFathersJson = await getAllFathers(idUser);

        var listTrees = [];
        var treeDependenceJson = [];

        if (allFathersJson !== 'Without-Machines') {
            for (const hostFather of allFathersJson.hosts) {
                treeDependenceJson = await getTreeDependence(hostFather);
                listTrees.push(treeDependenceJson);
            }
        }

        setTrees(listTrees);

    }


    //F U N C I O N E S - D E - E L - B O T O N - D E - O P C I O N E S
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        if (event.currentTarget.id === 'createMachine') {
            navigate(`/host/${0}`)
        }
        if (event.currentTarget.id === 'dependences') {
            navigate(`/dependences/`)
        }
        /*if (event.currentTarget.id === 'newGroup') {
            navigate(`/group/${0}`)
        }*/
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
              marginBottom={4}
              style={{minHeight: '100vh'}}>
            <Title title={'MÁQUINAS'}/>

            <SubTitle title={'Pools'}/>
            <HostsMasterPool
                //Enviamos el estado (setHost) a este componente hijo para que lo actualice
                hosts={pools}
                setHosts={setPools}
            />

            <SubTitle title={'Máquinas Físicas / Almacenamiento'}/>
            <Hosts
                //Enviamos el estado (setHost) a este componente hijo para que lo actualice
                hosts={hosts}
                setHosts={setHosts}
            />

            <SubTitle title={'Listado de Dependencias'}/>
            <Dependences
                hosts={trees}
            />

            {/*<SubTitle title={'Grupos con orden de apagado'}/>
            {hostGroups.map((value, index) => (
                <Groups
                group={value}
                key={`group-${index}`}
                hostGroups={hostGroups}
                // Se envia lista de hosts sin grupo para actualizarla cuando se borre un grupo
                hosts={hosts}
                setHosts={setHosts}
                />
                ))}*/}
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
                <MenuItem id="createMachine" onClick={handleClose}>Alta Máquina Física</MenuItem>
                <MenuItem id="dependences" onClick={handleClose}>Alta Dependencias</MenuItem>
                {/*<MenuItem id="newGroup" onClick={handleClose}>Alta Grupo</MenuItem>*/}
            </Menu>
        </Grid>

    );

}

export default ContainerHosts