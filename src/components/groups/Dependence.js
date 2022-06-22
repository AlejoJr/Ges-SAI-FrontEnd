import React, {useState, useEffect, useRef, CSSProperties} from "react";
import {getPools} from "../../services/Pools";
import {
    createDependence,
    getHosts,
    getChildrenFromFather,
    getParentsFromParent,
    deleteDependence,
    getTreeDependence
} from "../../services/Hosts";
import getVirtualMachines from "../../services/VirtualMachines";
import Grid from "@mui/material/Grid";
import Tooltip from '@mui/material/Tooltip';
import Select from 'react-select';
import {Title} from "../utils/Title";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Chip from '@mui/material/Chip';
import Button from "@mui/material/Button";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import Alert from "@mui/material/Alert";
import {confirmAlert} from "react-confirm-alert";


import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '60%',
    marginTop: 50
}));


function Dependence() {


    const [optionSelect_F_V_Father, setOptionSelect_F_V_Father] = useState({
        "id": 0,
        "value": 0,
        "label": 'Máquinas Fisicas',
        "name_pool": 'Máquinas Fisicas'
    });
    const [optionSelectFather, setOptionSelectFather] = useState(0);
    const [optionSelectChild, setOptionSelectChild] = useState(0);
    const [optionSelect_F_V_Child, setOptionSelect_F_V_Child] = useState({
        "id": 0,
        "value": 0,
        "label": 'Máquinas Fisicas',
        "name_pool": 'Máquinas Fisicas'
    });
    const [optionsOfSelect, setOptionsOfSelect] = useState([]);
    const [listAllMachines, setListAllMachines] = useState([]);
    const [listMachinesFather, setListMachinesFather] = useState([]);
    const [listMachinesChild, setListMachinesChild] = useState([]);
    const [listChildrenFromFather, setListChildrenFromFather] = useState([]);
    const [nameMachineFather, setNameMachineFather] = useState('');
    const [activeMessage, setActiveMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isDisableSelect, setIsDisableSelect] = useState(true);
    const [treeDependence, setTreeDependence] = useState({id: 'root'});

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );

    useEffect(function () {

        getHosts_left_api();

    }, [])


    const getHosts_left_api = async () => {

        //Se obtienen los pools existentes para llenar el select
        const poolsJson = await getPools();
        //Ordenamos por orden alfabetico a-z
        var resultPools = poolsJson.results.sort(function (a, b) {
            if (a.name_pool === b.name_pool) {
                return 0;
            }
            if (a.name_pool < b.name_pool) {
                return -1;
            }
            return 1;
        });

        resultPools.unshift({"id": 0, "value": 0, "label": 'Máquinas Fisicas', "name_pool": 'Máquinas Fisicas'})//<-- Añadimos esta opcion inicial para las maquinas fisicas
        resultPools.unshift({"id": 100, "value": 100, "label": 'Máquinas Almacenamiento', "name_pool": 'Máquinas Almacenamiento'})//<-- Añadimos esta opcion inicial para las maquinas de almacenamiento
        setOptionsOfSelect(resultPools);

        //<<- Se crea una lista que contenga cada pool junto con sus maquinas ->>
        resultPools.forEach(pool => {
            if (!listAllMachines.hasOwnProperty(pool.id)) {
                listAllMachines[pool.id] = {
                    idPool: pool.id,
                    namePool: pool.name_pool,
                    hosts: []
                }
            }
        });

        const hostsJson = await getHosts();
        //Ordenamos por orden alfabetico a-z
        var resultHost = hostsJson.results.sort(function (a, b) {
            if (a.name_host === b.name_host) {
                return 0;
            }
            if (a.name_host < b.name_host) {
                return -1;
            }
            return 1;
        })

        //<<- Filtramos solo los host - (Maquinas Fisicas)->>
        var lstHostPhysical = resultHost.filter(el => el.type_host === 'MF');

        //<<- Filtramos solo los host - (Maquinas Almacenamiento) ->>
        var lstStorageMachine = resultHost.filter(el => el.type_host === 'SM');

        //<<- Filtramos solo los host - (Maquinas Virtuales) que SI pertenecen a un grupo ->>
        var lstHostInGroup = resultHost.filter(el => el.group !== null).filter(el => el.type_host === 'MV');

        //<<- Filtramos Host Master - (Host Master)->>
        var lstHostMaster = resultHost.filter(el => el.type_host === 'HM');


        //<<- La primer posición reservada para llenar la lista con las maquinas fisicas (MF) ->>
        lstHostPhysical.forEach(host => {
            listAllMachines[0].hosts.push(host)
        });

        //<<- La posicion 100 reservada para llenar la lista con con las maquinas almacenamiento (SM) ->>
        lstStorageMachine.forEach(host => {
            listAllMachines[100].hosts.push(host)
        });


        //<<- Llenamos las siguientes posiciones con las maquinas (MV) correspondientes a cada Pool ->>
        var lstVmsFound = [];
        for (const obj of resultPools) {
            if (obj.id !== 0 && obj.id != 100) {
                var virtualMachines = await getVirtualMachines(obj.id);
                virtualMachines.results.forEach(host => {
                    var nameHost = host.name_host;
                    lstHostInGroup.map((value) => {
                        if (nameHost === value.name_host) {
                            lstVmsFound.push(host);
                        }
                    });
                });

                // Añadimos el host master al listado de maquinas virtuales del pool
                lstHostMaster.map(hostMaster =>{
                    if(hostMaster.pool.id === obj.id){
                        listAllMachines[obj.id].hosts.push(hostMaster)
                    }
                });

                //array con las maquinas que no se encontraron en un grupo
                let difference = arrayDifference(virtualMachines.results, lstVmsFound);
                difference.map(value => {
                    listAllMachines[obj.id].hosts.push(value);
                });
            }
        }

        //Eliminamos los campos nulos
        setListAllMachines(listAllMachines.filter(el => el != null));
        setListMachinesFather(lstHostPhysical);
        setListMachinesChild(lstHostPhysical);
        //setMachinesPhysical(lstHostPhysical);
        //setLeft(lstHostPhysical);
        //setIsFetch(false);

    }

    //Funcion que saca la diferencia de dos arrays
    const arrayDifference = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) === -1);
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT_FISI_VIRTU_FATHER) |-->>
    const changeSelectFisiVirtuFather = async (event) => {
        var option = event;
        setOptionSelect_F_V_Father(option);
        setOptionSelectFather(0); //Limpiar el select
        setListChildrenFromFather([]); //Limpiar la lista
        setNameMachineFather(''); // Limpiar el nombre
        setTreeDependence({id: 'root'}); // Limpiar arbol de dependencia

        listAllMachines.map(value => {
            if (value.idPool === option.id) {

                value.hosts.sort(function (a, b) {
                    if (a.name_host === b.name_host) {
                        return 0;
                    }
                    if (a.name_host < b.name_host) {
                        return -1;
                    }
                    return 1;
                })
                setListMachinesFather(value.hosts);
            }
        });

    };

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT_FATHER) |-->>
    const changeSelectFather = async (event) => {
        var option = event;
        setOptionSelectFather(option);
        setNameMachineFather(option.name_host)
        setIsDisableSelect(false);
        setOptionSelectChild(0); //Limpiar el select
        setActiveMessage(false);
        var childrenJson;
        var fathersJson;
        var treeDependenceJson;
        var listHosts = [];

        listAllMachines.map(value => {
            if (value.idPool === optionSelect_F_V_Child.id) {
                value.hosts.sort(function (a, b) {
                    if (a.name_host === b.name_host) {
                        return 0;
                    }
                    if (a.name_host < b.name_host) {
                        return -1;
                    }
                    return 1;
                });

                //Quitamos la maquina que ya esta seleccionada en la parte izquierda y dejamos el resto de las maquinas
                listHosts = value.hosts.filter((item) => item !== option);
                setListMachinesChild(listHosts);
            }
        });

        childrenJson = await getChildrenFromFather(option);
        if (childrenJson !== 'Not Exist Machine' && childrenJson !== 'Not Exist Children') {
            //Excluimos los hijos del host
            childrenJson.hosts.map((hijo, indexHijo) => {
                listHosts = listHosts.filter((item) => {
                    return item.label !== hijo.label
                });
            });

            // Excluimos los hijos de los hijos
            childrenJson.childrens.map((hijo) => {
                listHosts = listHosts.filter((item) => {
                    return item.label !== hijo
                });
            });

            setListMachinesChild(listHosts);
            setListChildrenFromFather(childrenJson.hosts);
        } else {
            setListChildrenFromFather([]);
        }

        fathersJson = await getParentsFromParent(option);
        if (fathersJson !== 'Not Exist Machine' && fathersJson !== 'Not Exist Fathers') {
            fathersJson.hosts.map((hijo, indexHijo) => {
                listHosts = listHosts.filter((item) => {
                    return item.label !== hijo
                });
            })

            setListMachinesChild(listHosts);
        }


        treeDependenceJson = await getTreeDependence(option);
        setTreeDependence(treeDependenceJson);
    };

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT_FISI_VIRTU_CHILD) |-->>
    const changeSelectFisiVirtuChild = async (event) => {
        var option = event;
        setOptionSelect_F_V_Child(option);
        setOptionSelectChild(0); //Limpiar el select
        var listHosts = [];

        listAllMachines.map(value => {
            if (value.idPool === option.id) {
                value.hosts.sort(function (a, b) {
                    if (a.name_host === b.name_host) {
                        return 0;
                    }
                    if (a.name_host < b.name_host) {
                        return -1;
                    }
                    return 1;
                });

                //Quitamos la maquina que ya esta seleccionada en la parte izquierda y dejamos el resto de las maquinas
                listHosts = value.hosts.filter((item) => item !== optionSelectFather);
                setListMachinesChild(listHosts);
            }
        });

        listChildrenFromFather.map(hijo => {
            listHosts = listHosts.filter((item) => {
                return item.label !== hijo.label
            });
        });
        setListMachinesChild(listHosts);
    };

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT_CHILD) |-->>
    const changeSelectChild = async (event) => {
        var option = event;
        setOptionSelectChild(option);
        setActiveMessage(false);
    };

    // <<--| G U A R D A R - C A M B I O S  |-->>
    const saveChanges = async () => {
        var dependenceJson;
        var childrenJson;
        setActiveMessage(false);
        if (optionSelectFather === 0) {
            setMessage('Seleccione la Máquina de la Izquierda')
            setActiveMessage(true);
        }
        if (optionSelectChild === 0) {
            setMessage('Seleccione la Máquina de la Derecha')
            setActiveMessage(true);
        }

        if (optionSelectFather !== 0 && optionSelectChild !== 0) {
            dependenceJson = await createDependence(optionSelectFather, optionSelectChild);
            if (dependenceJson === 'Created-OK') {
                var listAux = []
                listChildrenFromFather.map(value => {
                    listAux.push(value);
                })
                listAux.push(optionSelectChild);
                setListChildrenFromFather(listAux);

                var newList = listMachinesChild.filter(el => el.id !== optionSelectChild.id);

                // Actualizamos el select - Excluimos los hijos de los hijos
                childrenJson = await getChildrenFromFather(optionSelectFather);
                if (childrenJson !== 'Not Exist Machine' && childrenJson !== 'Not Exist Children') {
                    childrenJson.childrens.map((hijo) => {
                        newList = newList.filter((item) => {
                            return item.label !== hijo
                        });
                    });
                }

                setListMachinesChild(newList);
                setOptionSelectChild(0);
            } else {
                setMessage('Error creando la Dependencia')
                setActiveMessage(true);
            }
        }

    }

    // <<-- | E L I M I N A R - U N A - D E P E N D E N C I A  |-->
    const dltDependence = (hostChild) => () => {
        confirmAlert({
            title: 'Borrar Dependencia',
            message: 'Esta seguro de borrar la dependencia del host: ' + hostChild.name_host,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        // <<- 1). Eliminamos el host de la Base de datos ->>
                        deleteDependence(optionSelectFather, hostChild);
                        // <<- 2). Eliminamos el Host de la lista (listHost) ->>
                        var newList = listChildrenFromFather.filter(el => el.id !== hostChild.id);
                        setListChildrenFromFather(newList);
                        // <<- 3). Actualizamos el Estado (hosts) del componente Padre (ContainerHosts) ->>
                        //props.setHosts(listHost);
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<-- | R E C A R G A R - A R B O L - D E - D E P E N D E N C I A  |-->
    const reloadTreeDependence = (hostChild) => async () => {
        if (hostChild !== 0) {
            var treeDependenceJson;
            treeDependenceJson = await getTreeDependence(hostChild);
            setTreeDependence(treeDependenceJson);
        }
    }

    const customList = (items) => (
        <Card sx={{maxWidth: 500}}>
            <List
                sx={{
                    width: 430,
                    height: 300,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.name_host}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            //onClick={handleToggle(value)}
                            secondaryAction={
                                <Tooltip title="Eliminar Dependencia">
                                    <IconButton
                                        aria-label="delete-machine-dependence"
                                        color="primary"
                                        onClick={dltDependence(value)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemAvatar>
                                <LaptopMacIcon fontSize="large" color="primary"/>
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={`${value.name_host.toUpperCase()}`}/>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <>
            <Grid
                container
                spacing={1}
                direction="column"
                alignItems="center"
                justify="center"
                marginTop={5}
                //justifyContent="center"
            >
                <Title title={'DEPENDENCIAS'}/>
                <Item>
                    <Grid container spacing={4}>
                        <Grid item xs={5} marginBottom={5} marginLeft={8}>
                            <Grid marginBottom={2}>
                                <Chip label="Izquierda" color="primary" variant="outlined"/>
                            </Grid>
                            <Select
                                placeholder={'M. Fisicas/Virtuales'}
                                labelId="id-select-label-1"
                                id="id_Select_Fisi_Virtu_Father"
                                value={optionSelect_F_V_Father}
                                options={optionsOfSelect}
                                onChange={changeSelectFisiVirtuFather}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Grid marginBottom={2}>
                                <Chip label="Derecha" color="primary" variant="outlined"/>
                            </Grid>
                            <Select
                                placeholder={'M. Fisicas/Virtuales'}
                                labelId="id-select-label-2"
                                id="id_Select_Fisi_Virtu_Child"
                                value={optionSelect_F_V_Child}
                                options={optionsOfSelect}
                                onChange={changeSelectFisiVirtuChild}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        La Maquina de la Izquierda depende de que se apague la maquina de la Derecha
                    </Grid>
                    <Grid container spacing={5}>
                        <Grid item xs={5} marginBottom={2} marginLeft={8}>
                            <Select
                                placeholder={'Máquina'}
                                labelId="id-select-label-11"
                                id="id_Select_Machines_Father"
                                value={optionSelectFather}
                                options={listMachinesFather}
                                onChange={changeSelectFather}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Select
                                placeholder={'Máquina'}
                                isDisabled={isDisableSelect}
                                labelId="id-select-label-22"
                                id="id_Select_Machines_Child"
                                value={optionSelectChild}
                                options={listMachinesChild}
                                onChange={changeSelectChild}
                            />
                        </Grid>
                    </Grid>
                    <Button onClick={saveChanges}>
                        Alta
                    </Button>
                    {
                        activeMessage &&
                        <Alert severity="warning">
                            {message}
                        </Alert>
                    }
                </Item>
            </Grid>
            <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={4} marginTop={2} marginBottom={5} marginLeft={35}>
                    <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                        Máquina: {nameMachineFather}
                    </Typography>
                    {customList(listChildrenFromFather)}
                </Grid>
                <Grid item xs={4} marginTop={2} marginBottom={5} marginLeft={10}>
                    <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                        Arbol de dependencias: {nameMachineFather}
                        <Tooltip title="Recargar arbol de Dependencia">
                            <IconButton
                                aria-label="reload-tree-dependence"
                                color="primary"
                                onClick={reloadTreeDependence(optionSelectFather)}>
                                <SyncIcon/>
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <TreeView
                        aria-label="rich object"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon/>}
                        sx={{height: 290, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
                    >
                        {renderTree(treeDependence)}
                    </TreeView>
                </Grid>
            </Grid>

        </>
    );
}

export default Dependence