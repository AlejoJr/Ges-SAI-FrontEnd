import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import InputAdornment from "@mui/material/InputAdornment";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import SearchIcon from '@mui/icons-material/Search';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import {ReOrderableItem, ReOrderableList} from "react-reorderable-list";

import {confirmAlert} from "react-confirm-alert";
import {
    updateHost,
    getHosts,
    hostsByGroup,
    deleteHost,
    createHost,
    existHostByName_bdLocal
} from "../../services/Hosts";
import {createGroup, deleteGroup, updateGroup} from "../../services/Groups";
import {Loading, Message, ValidateFields, SerializerHost_MV, GetIdUser} from "../utils/LittleComponents";
import {Title} from "../utils/Title";
import InputLabel from '@mui/material/InputLabel';
import {getPools} from "../../services/Pools";
import getVirtualMachines from "../../services/VirtualMachines";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: 50,
    marginBottom: 10
}));


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}


/***
 * Componente con dos listas seleccionables que permite pasar del lado izquierdo maquinas al lado derecho
 * para asociarlas a un grupo
 ***/
function Group() {

    const {idGroup} = useParams();
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [isFetch, setIsFetch] = useState(true);
    const [isActiveMessageInfo, setIsActiveMessageInfo] = useState(false);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const [nameTextField, setNameTextField] = useState('');

    const [isEmptyTextfield, setIsEmptyTextfield] = useState(false);
    const [isActiveMessageError, setIsActiveMessageError] = useState(false);

    const [optionSelect, setOptionSelect] = useState(0);
    const [optionsOfSelect, setOptionsOfSelect] = useState([]);
    const [listAllMachines, setListAllMachines] = useState([]);

    const [nameSearch, setNameSearch] = useState('');

    let navigate = useNavigate();

    useEffect(function () {
        if (idGroup > 0) {
            getHosts_left_api();
            getHosts_right_api();
        } else {
            getHosts_left_api();
        }
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

        resultPools.unshift({"id": 0, "name_pool": 'Máquinas Fisicas'})//<-- Añadimos esta opcion inicial para las maquinas fisicas
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

        //<<- Filtramos solo los host - (Maquinas Fisicas) que NO pertenecen a un grupo->>
        var lstHostPhysical = resultHost.filter(el => el.group === null).filter(el => el.type_host === 'MF');

        //<<- Filtramos solo los host - (Maquinas Virtuales) que SI pertenecen a un grupo ->>
        var lstHostInGroup = resultHost.filter(el => el.group !== null).filter(el => el.type_host === 'MV');

        //<<- La primer posición de la lista la llenamos con las maquinas fisicas (MF) ->>
        lstHostPhysical.forEach(host => {
            listAllMachines[0].hosts.push(host)
        });

        //<<- Llenamos las siguientes posiciones con las maquinas (MV) correspondientes a cada Pool ->>
        var lstVmsFound = [];
        for (const obj of resultPools) {
            if (obj.id !== 0) {
                var virtualMachines = await getVirtualMachines(obj.id);
                virtualMachines.results.forEach(host => {
                    var nameHost = host.name_host;
                    lstHostInGroup.map((value) => {
                        if (nameHost === value.name_host) {
                            lstVmsFound.push(host);
                        }
                    });
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

        //setMachinesPhysical(lstHostPhysical);
        setLeft(lstHostPhysical);
        setIsFetch(false);

    }

    //Funcion que saca la diferencia de dos arrays
    const arrayDifference = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) === -1);
    }


    //<--| O B T E N E R - H O S T S - D E L - G R U P O |-->>
    const getHosts_right_api = async () => {
        const response = await hostsByGroup(idGroup);

        //Ordenamos por (order) ya preestablecido
        var listHosts = response.hosts.sort(function (a, b) {
            return (a.order - b.order)
        })

        setRight(listHosts);
        setNameTextField(response.nameGroup);
    }

    // <<--| G U A R D A R - C A M B I O S  |-->>
    const saveChanges = async () => {

        if (nameTextField !== '') {
            setIsEmptyTextfield(false);

            if (right.length <= 1) {
                setIsActiveMessageError(true);
            } else {
                if (idGroup > 0) {
                    update_Group();
                } else {
                    create_Group();
                }
            }
        } else {
            setIsEmptyTextfield(true);
        }
    }

    // <<--| C R U D -- G R U P O  |-->>

    const update_Group = async () => {
        var group = {"id": idGroup, "name_group": nameTextField, "user": GetIdUser()}
        var responseUpdate = await updateGroup(group);
        if (responseUpdate === 'Updated-OK') {

            //<-- Update : lista con grupo -->
            var index = 0;
            for (var value of right) {
                if (value.hasOwnProperty('ref')) {
                    value = SerializerHost_MV(value, index, idGroup);
                    const hostVm = await existHostByName_bdLocal(value.name_host);
                    if (hostVm !== 'Not Exists Machine') {
                        var vmHost = ValidateFields(hostVm.host[0]);
                        vmHost.groupId = idGroup;
                        vmHost.order = index + 1;
                        responseUpdate = updateHost(vmHost);
                    } else {
                        responseUpdate = createHost(value);
                    }
                } else {
                    value = ValidateFields(value);
                    value.groupId = idGroup;
                    value.order = index + 1;
                    responseUpdate = updateHost(value);
                }
                index = index + 1;
            }

            //<-- Update : Lista sin grupo -->
            listAllMachines.map(obj => {
                obj.hosts.map((host) => {
                    if (host.hasOwnProperty('group_id')) {
                        if (host.type_host === 'MV') {
                            responseUpdate = deleteHost(host.id)
                        } else {
                            host = ValidateFields(host);
                            host.groupId = null;
                            host.order = null;
                            responseUpdate = updateHost(host);
                        }
                    }
                });
            });

            await new Promise(r => setTimeout(r, 200));
            navigate('/hosts');
        }
    }

    const create_Group = async () => {
        var group = {"name_group": nameTextField, "user": GetIdUser()}
        var responseCreate = await createGroup(group);
        if (responseCreate.message === 'Created-OK') {
            const idGroup = responseCreate.idGroup;
            var index = 0;
            for (var value of right) {
                value = ValidateFields(value);
                if (value.type_host === 'MV') {
                    value = SerializerHost_MV(value, index, idGroup);
                    const hostVm = await existHostByName_bdLocal(value.name_host);
                    if (hostVm !== 'Not Exists Machine') {
                        var vmHost = ValidateFields(hostVm.host[0]);
                        vmHost.groupId = idGroup;
                        vmHost.order = index + 1;
                        responseCreate = updateHost(vmHost);
                    } else {
                        responseCreate = createHost(value);
                    }
                } else {
                    value.groupId = idGroup;
                    value.order = index + 1;
                    responseCreate = updateHost(value);
                }
                index = index + 1;
            }
            await new Promise(r => setTimeout(r, 200));
            navigate('/hosts');
        }
    }

    const delete_Group = (idGroup) => () => {
        confirmAlert({
            title: 'Grupo vacío',
            message: 'No puede tener grupos vacíos, desea eliminar el grupo: ' + nameTextField,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(async () => {
                            var responseHost = '';

                            // <<- 1). Recorremos la lista y actualizamos a las MF y a las VM las eliminamos ->>
                            for (var obj of listAllMachines) {
                                for (var host of obj.hosts) {
                                    if (host.hasOwnProperty('group_id')) {
                                        if (host.type_host === 'MF') {
                                            host = ValidateFields(host);
                                            host.groupId = null;
                                            host.poolId = null;
                                            host.order = null;
                                            responseHost = await updateHost(host);
                                        }
                                        if (host.type_host === 'MV') {
                                            responseHost = await deleteHost(host.id)

                                        }
                                    }
                                }
                            }


                            // <<- 2). Eliminamos el grupo ->>
                            deleteGroup(idGroup);

                            setTimeout(() => {
                                navigate('/hosts');
                            }, 300);

                        }
                    )
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<--| F I N |-->>

    // <<--| F U N C I O N E S - D E - L A S - L I S T A S |-->>
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            setIsActiveMessageInfo(false);//--> Desactiva el mensaje de (ordenar los items)
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        // <<- Revisa todos los checkeados y los Elimina de (listAllMachines) -->
        leftChecked.map((value) => {
            listAllMachines.map(obj => {
                var posFound = 0;
                var exists = false;
                obj.hosts.map((objHost, index) => {
                    if (objHost.name_host === value.name_host) {
                        posFound = index;
                        exists = true;
                    }
                });
                if (exists) {
                    obj.hosts.splice(posFound, 1);
                }

            });
            //setLeft(value.hosts)
        });

        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        setIsActiveMessageInfo(true);//--> Activa el mensaje de (ordenar los items)
    };

    const handleCheckedLeft = () => {
        // <<- Revisa todos los checkeados y los Agrega a  (listAllMachines) -->
        rightChecked.map((value) => {
            if (value.type_host === 'MF') {
                listAllMachines.map(obj => {
                    if (obj.idPool === 0) {
                        obj.hosts.push(value);
                        if (parseInt(optionSelect) === 0) {
                            setLeft(obj.hosts);
                        }
                    }
                });
            } else {
                listAllMachines.map(obj => {
                    if (obj.idPool === value.pool_id) {
                        obj.hosts.push(value);
                        if (parseInt(optionSelect) === value.pool_id) {
                            setLeft(obj.hosts);
                        }
                    }
                });
            }
        });

        //setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    // <<--| F I N |-->>


    // <<--| C U S T O M I Z A R - L I S T A - (I Z Q U I E R D A) |-->>
    const customListLeft = (title, items) => (
        <Card>
            <CardHeader
                sx={{px: 0, py: 1}}
                avatar={
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="top"
                            control={<Checkbox onClick={handleToggleAll(items)}
                                               checked={numberOfChecked(items) === items.length && items.length !== 0}
                                               indeterminate={
                                                   numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                                               }
                                               disabled={items.length === 0}
                                               inputProps={{
                                                   'aria-label': 'all items selected',
                                               }}
                            />}
                            label="Todas"
                            labelPlacement="top"
                        />
                    </FormGroup>

                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} Máquinas`}
            />
            <Divider/>
            <List
                sx={{
                    width: 400,
                    height: 500,
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
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name_host.toUpperCase()}`}/>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    // <<--| C U S T O M I Z A R - L I S T A - (D E R E C H A) |-->>
    const customListRight = (title, items) => (
        <Card>
            <CardHeader
                sx={{px: 0, py: 1}}
                avatar={
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="top"
                            control={<Checkbox
                                onClick={handleToggleAll(items)}
                                checked={numberOfChecked(items) === items.length && items.length !== 0}
                                indeterminate={
                                    numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                                }
                                disabled={items.length === 0}
                                inputProps={{
                                    'aria-label': 'all items selected',
                                }}
                            />}
                            label="Todas"
                            labelPlacement="top"
                        />
                    </FormGroup>
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} Máquinas`}
            />
            <Divider/>
            <List
                sx={{
                    width: 400,
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                <ReOrderableList
                    name="listRight"
                    //lista right
                    list={right}
                    onListUpdate={(newList) => setRight(newList)}
                    component={List}>
                    {right.map((value) => {
                        const labelId = `transfer-list-all-item-${value.name_host}-label`;

                        return (
                            <ReOrderableItem
                                key={`item-${value.id}`}
                            >
                                <ListItem
                                    key={value.id}
                                    role="listitem"
                                    button
                                    onClick={handleToggle(value)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />

                                        {
                                            parseInt(idGroup) === 0
                                            &&
                                            <ListItemText id={labelId}
                                                          primary={`${value.name_host.toUpperCase()}`}
                                                          secondary={value.hasOwnProperty('pool_id') ?
                                                              <Typography variant={"overline"}
                                                                          marginLeft={3}>-{value.pool_name}</Typography> :
                                                              <Typography variant={"overline"} marginLeft={3}>-Máquina
                                                                  Física</Typography>}
                                            />
                                        }
                                        {
                                            parseInt(idGroup) > 0
                                            &&
                                            <ListItemText id={labelId}
                                                          primary={`${value.name_host.toUpperCase()}`}
                                                          secondary={<Typography variant={"overline"}
                                                                                 marginLeft={3}>-{resolveNamePool(value)}</Typography>}
                                            />
                                        }

                                    </ListItemIcon>
                                </ListItem>
                            </ReOrderableItem>

                        );
                    })}
                </ReOrderableList>
            </List>
        </Card>
    );

    const resolveNamePool = (value) => {
        var namePool = ""

        if (value.pool_id > 0) {
            optionsOfSelect.map((pool) => {
                if (pool.id === value.pool_id) {
                    namePool = pool.name_pool
                }
            });
        } else {
            namePool = "Máquina Física"
        }
        return namePool
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD) |-->>
    const handleChange = (e) => {
        setNameTextField(e.currentTarget.value)
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT) |-->>
    const handleChangeSelect = async (event) => {
        var option = event.target.value;
        setOptionSelect(option);

        listAllMachines.map(value => {
            if (value.idPool === option) {

                value.hosts.sort(function (a, b) {
                    if (a.name_host === b.name_host) {
                        return 0;
                    }
                    if (a.name_host < b.name_host) {
                        return -1;
                    }
                    return 1;
                })
                setLeft(value.hosts);
            }
        });

    };

    const filter = (e) => {
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = left.filter((machine) => {
                return machine.name_host.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setLeft(results);
        } else {
            listAllMachines.map(value => {
                if (value.idPool === optionSelect) {
                    setLeft(value.hosts);
                }
            });
        }
        setNameSearch(keyword);
    };

    return (
        <>
            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justify="center"
                marginTop={5}
                //justifyContent="center"
            >
                <Title title={'GRUPO'}/>
                <Item>
                    {
                        isFetch && <Loading></Loading>
                    }
                    <Grid container spacing={5} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Grid marginBottom={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={nameSearch}
                                    label="Buscar"
                                    size="small"
                                    variant="standard"
                                    onChange={filter}/>
                            </Grid>

                            <FormControl
                                fullWidth
                                variant="standard"
                                sx={{m: 0, minWidth: 100}}>
                                <InputLabel id="id-select-label">Máquinas</InputLabel>
                                <Select
                                    labelId="id-select-label"
                                    id="id_Group"
                                    value={optionSelect}
                                    size="small"
                                    onChange={handleChangeSelect}
                                    //autoFocus
                                    //error={errors.so ? true : false}
                                    //{...register("so", {required: true})}//se declara antes del onChange
                                >
                                    {optionsOfSelect.map((obj) => (
                                        <MenuItem key={obj.id} value={obj.id}>{obj.name_pool}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Grid marginTop={2}>
                                {customListLeft('Seleccionar', left)}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                                <Button
                                    sx={{my: 5}}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    sx={{my: 5}}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid marginTop={9.6}>
                                <TextField
                                    id="id_nameHostTextField"
                                    name="nameHostTextField"
                                    label="Nombre de Grupo"
                                    autoFocus
                                    size="small"
                                    value={nameTextField}
                                    error={isEmptyTextfield}
                                    variant="standard"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid marginTop={2}>
                                {customListRight('Seleccionadas', right)}
                            </Grid>
                        </Grid>

                    </Grid>

                    {
                        isActiveMessageInfo && <Message isActive={isActiveMessageInfo}
                                                        severity={'info'}
                                                        message={'Ordene arrastrando las maquinas seleccionadas a la posición deseada, para su posterior apagado !'}/>
                    }
                    {
                        isActiveMessageError && <Message isActive={isActiveMessageError}
                                                         severity={'warning'}
                                                         message={'El grupo debe contener mas de una Máquina !!'}/>
                    }
                </Item>
                <div style={{marginTop: 10, marginBottom: 20}}>
                    <ButtonGroup variant="text" aria-label="text button group">

                        {// <<-- Boton para eliminar un grupo si esta vacío -->
                            idGroup > 0 && !right.length > 0 &&
                            <Button onClick={delete_Group(idGroup)}>
                                Guardar
                            </Button>
                        }

                        {// <<-- Boton para guardar cambios
                            idGroup >= 0 && right.length > 0 &&
                            <Button onClick={saveChanges}>
                                Guardar
                            </Button>
                        }
                        <Button onClick={() => {
                            navigate(`/hosts`)
                        }}>
                            Cancelar
                        </Button>
                    </ButtonGroup>
                </div>
            </Grid>
        </>
    );
}

export default Group