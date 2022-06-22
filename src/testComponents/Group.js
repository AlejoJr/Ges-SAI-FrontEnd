import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
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
    getAllHostsInAGroup,
    existHostByName_bdLocal
} from "../../services/Hosts";
import {createGroup, deleteGroup, getGroups, updateGroup} from "../../services/Groups";
import {GetIdUser, Loading, Message} from "../utils/LittleComponents";
import {Title} from "../utils/Title";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {getVirtualMachines} from "../../services/VirtualMachines";


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

    const {idPool} = useParams();
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

    const [valueRadioGroup, setValueRadioGroup] = useState('newGroup');
    const [disableSelectExistsGroup, setDisableSelectExistsGroup] = useState(false);
    const [disableSelectNewGroup, setDisableSelectNewGroup] = useState(false);
    const [groups, setGroups] = useState([]);
    const [groupSelect, setGroupSelect] = useState('');
    const [deActivateListLeft, setDeactivateListLeft] = useState(true);
    const [hostsGroupCurrent, setHostsGroupCurrent] = useState([]);


    let navigate = useNavigate();

    useEffect(function () {
        if (idGroup > 0) {
            getHosts_left_api();
            getHosts_right_api();
        } else {
            getHosts_left_api();
        }
    }, [])

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

    //<--| O B T E N E R - H O S T S - S I N - G R U P O |-->>
    const getHosts_left_api = async () => {

        //Se obtienen los grupos existentes para llenar el select
        const groupsJson = await getGroups();
        //Ordenamos por orden alfabetico a-z
        var resultGroups = groupsJson.results.sort(function (a, b) {
            if (a.name_group == b.name_group) {
                return 0;
            }
            if (a.name_group < b.name_group) {
                return -1;
            }
            return 1;
        })
        setGroups(resultGroups);

        //Obtener maquinas virtuales o maquinas fisicas
        if (idPool !== undefined) { //<-- Get Virtual Machines
            var lstVmsFound = [];
            var lstVms = [];
            const listHostsInGroup = await getAllHostsInAGroup();
            const vmsJson = await getVirtualMachines(idPool);

            if (listHostsInGroup !== 'Without-Machines') {
                vmsJson.results.map((vm) => {
                    var nameHost = vm.name_host;
                    listHostsInGroup.hosts.map((value) => {
                        if (nameHost === value.name_host) {
                            lstVmsFound.push(vm);
                        }
                    });
                });

                //array con las maquinas que no se encontraron en un grupo
                let difference = arrayDifference(vmsJson.results, lstVmsFound);
                difference.map(value => {
                    lstVms.push(value)
                });

                setLeft(lstVms);
            } else {
                setLeft(vmsJson.results)
            }
            /**/
        } else {//<-- Get Physical Machines
            const hostsJson = await getHosts();

            //Ordenamos por orden alfabetico a-z
            var resultHost = hostsJson.results.sort(function (a, b) {
                if (a.name_host == b.name_host) {
                    return 0;
                }
                if (a.name_host < b.name_host) {
                    return -1;
                }
                return 1;
            })

            //Excluimos las maquinas host master (Hipervisor)
            var arrayHosts = resultHost.filter(el => el.type_host !== 'HM');

            //Filtramos solo los host que no estan en ningun grupo
            var listHost = arrayHosts.filter(el => el.group === null);


            setLeft(listHost);
        }

        setIsFetch(false);
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
            right.map((value, index) => {
                value = validateFields(value)

                value.groupId = idGroup;
                value.order = index + 1;

                responseUpdate = updateHost(value);
            });

            //<-- Update : Lista sin grupo -->
            left.map((value, index) => {
                value = validateFields(value)

                value.groupId = null;
                value.order = 0;

                responseUpdate = updateHost(value);
            });

            await new Promise(r => setTimeout(r, 200));
            navigate('/hosts');
        }
    }

    const create_Group = async () => {
        var responseCreate = '';
        if (valueRadioGroup === 'exitsGroup') {
            var index = 0;
            for (var hostRight of right) {
                if (idPool !== undefined) {
                    // <<- Desde las maquinas virtuales (pool) ->> //
                    if (hostRight.hasOwnProperty('type_host')) {
                        hostRight = validateFields(hostRight);
                        hostRight.groupId = groupSelect.id;
                        hostRight.order = index + 1;
                        responseCreate = updateHost(hostRight);
                    } else {
                        var machineVirtual = serializerHost_MV(hostRight, index, groupSelect.id);
                        const hostVm = await existHostByName_bdLocal(machineVirtual.name_host);
                        if (hostVm !== 'Not Exists Machine') {
                            var vmHost = validateFields(hostVm.host[0]);
                            vmHost.groupId = groupSelect.id;
                            vmHost.order = index + 1;
                            responseCreate = updateHost(vmHost);
                        } else {
                            responseCreate = createHost(machineVirtual);
                        }
                    }

                } else {
                    // <<- Desde las maquinas fisicas ->> //
                    hostRight = validateFields(hostRight);
                    hostRight.groupId = groupSelect.id;
                    hostRight.order = index + 1;
                    responseCreate = updateHost(hostRight);
                }
                index = index + 1;
            }
        } else {
            var group = {"name_group": nameTextField, "user": GetIdUser()}
            responseCreate = await createGroup(group);
            if (responseCreate.message === 'Created-OK') {
                const idGroup = responseCreate.idGroup;
                right.map((value, index) => {
                    if (idPool !== undefined) { //<-- Damos de alta a las maquinas virtuales en la BD
                        var machineVirtual = serializerHost_MV(value, index, idGroup);
                        responseCreate = createHost(machineVirtual);
                    } else { // <-- Actualizamos las maquinas
                        value.groupId = idGroup;
                        value.order = index + 1;
                        value = validateFields(value)
                        responseCreate = updateHost(value);
                    }
                });
            }
        }
        await new Promise(r => setTimeout(r, 200));
        navigate('/hosts');
    }

    const delete_Group = (idGroup) => () => {
        confirmAlert({
            title: 'Grupo vacío',
            message: 'No puede tener grupos vacíos, desea eliminar el grupo: ' + nameTextField,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {

                        // <<- 1). Recorremos la lista izquierda y actualizamos a los host sin grupo ->>
                        left.map((value, index) => {
                            if (value.hasOwnProperty('group_id')) {
                                delete value.group_id;
                            }
                            if (value.hasOwnProperty('user_id')) {
                                delete value.user_id;
                                value.user = GetIdUser();
                            }

                            value.groupId = null;
                            value.order = 0;

                            updateHost(value);
                        });
                        // <<- 2). Eliminamos el grupo ->>
                        deleteGroup(idGroup);

                        setTimeout(() => {
                            navigate('/hosts');
                        }, 300);

                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    // <<--| F I N |-->>

    function validateFields(value) {
        if (value.hasOwnProperty('group')) {
            value.groupId = value.group !== null ? value.group : null;
            delete value.group;
        }
        if (value.hasOwnProperty('group_id')) {
            value.groupId = value.group_id !== null ? value.group_id : null;
            delete value.group_id;
        }
        if (value.hasOwnProperty('pool')) {
            value.poolId = value.pool !== null ? value.pool.id : null;
            delete value.pool;
        }
        if (value.hasOwnProperty('pool_id')) {
            value.poolId = value.pool_id !== null ? value.pool_id : null;
            delete value.pool_id;
        }
        if (value.hasOwnProperty('user_id')) {
            delete value.user_id;
            value.user = GetIdUser();
        }
        if (value.hasOwnProperty('power_state')) {
            delete value.power_state;
        }
        if (value.hasOwnProperty('ref')) {
            delete value.ref;
        }

        return value
    }

    function serializerHost_MV(value, index, idGroup) {

        var host_virtual_machine = {
            "name_host": value.name_host,
            "ip": null,
            "mac": null,
            "so": null,
            "groupId": idGroup,
            "order": index + 1,
            "description": null,
            "poolId": idPool,
            "user": GetIdUser(),
            "type_host": "MV"
        }

        return host_virtual_machine
    }

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
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        setIsActiveMessageInfo(true);//--> Activa el mensaje de (ordenar los items)
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    // <<--| F I N |-->>


    // <<--| C U S T O M I Z A R - L I S T A - (I Z Q U I E R D A) |-->>
    const customListLeft = (title, items) => (
        <Card>
            <CardHeader
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0 || deActivateListLeft}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
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
                            disabled={deActivateListLeft}
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
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
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

                                        <ListItemText id={labelId} primary={`${value.name_host.toUpperCase()}`}/>

                                    </ListItemIcon>
                                </ListItem>
                            </ReOrderableItem>

                        );
                    })}
                </ReOrderableList>
            </List>
        </Card>
    );

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD) |-->>
    const handleChangeTextField = (e) => {
        setNameTextField(e.currentTarget.value);
        if (e.currentTarget.value === '') {
            setDisableSelectExistsGroup(false);
            setDeactivateListLeft(true);
            setChecked([]); //<-- quita los seleccionados anteriormente para evitar errores
        } else {
            setDisableSelectExistsGroup(true);
            setDeactivateListLeft(false);
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (RADIOGROUP) |-->>
    const handleChangeRadioGroup = (event) => {
        setValueRadioGroup(event.target.value);
        if (event.target.value === 'exitsGroup') {
            setNameTextField(' ');
        }
        if (right.length > 0) {
            right.map(value => {
                left.push(value)
            })
            setRight([]);
        }
    };

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT) |-->>
    const handleChangeSelect = async (event) => {
        var group = event.target.value;
        setGroupSelect(group);

        if (group !== '') {
            setDisableSelectNewGroup(true);
            setDeactivateListLeft(false);
            const response = await hostsByGroup(group.id);

            //Ordenamos por (order) ya preestablecido
            var listHosts = response.hosts.sort(function (a, b) {
                return (a.order - b.order)
            })

            //Al cambiar de grupo, retornamos los hosts nuevamente a la lista izquierda
            let difference = arrayDifference(right, hostsGroupCurrent);
            difference.map(value => {
                left.push(value)
            })

            setRight(listHosts);
            setHostsGroupCurrent(listHosts);//--> Guardamos los hosts del grupo actual
        } else {
            //Si no selecciona ningun grupo, retornamos los hosts nuevamente a la lista izquierda
            let difference = arrayDifference(right, hostsGroupCurrent);
            difference.map(value => {
                left.push(value)
            })

            setDisableSelectNewGroup(false);
            setDeactivateListLeft(true);
            setRight([]);
            setChecked([]); //<-- quita los seleccionados anteriormente para evitar errores
        }
    };

    //Funcion que saca la diferencia de dos arrays
    const arrayDifference = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
    }

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
                            <Grid marginTop={13}>
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

                            <RadioGroup
                                row
                                value={valueRadioGroup}
                                onChange={handleChangeRadioGroup}
                            >
                                <FormControlLabel
                                    value="newGroup"
                                    control={<Radio/>}
                                    label="Nuevo Grupo"
                                    labelPlacement="end"
                                    disabled={disableSelectNewGroup}
                                />
                                <FormControlLabel
                                    value="exitsGroup"
                                    control={<Radio/>}
                                    label="Grupo Existente"
                                    labelPlacement="end"
                                    disabled={disableSelectExistsGroup}
                                />
                            </RadioGroup>
                            <FormControl
                                fullWidth
                                variant="standard"
                                sx={{m: 0, minWidth: 100}}>
                                <TextField
                                    id="id_nameHostTextField"
                                    name="nameHostTextField"
                                    label="Nombre de Grupo"
                                    size="small"
                                    value={nameTextField}
                                    autoFocus
                                    error={isEmptyTextfield}
                                    variant="standard"
                                    className="form-control"
                                    hidden={valueRadioGroup === 'exitsGroup'}
                                    onChange={handleChangeTextField}
                                />
                                <InputLabel id="id-group-label"
                                            hidden={valueRadioGroup === 'newGroup'}>Grupo</InputLabel>
                                <Select
                                    hidden={valueRadioGroup === 'newGroup'}
                                    labelId="id-group-label"
                                    id="id_Group"
                                    value={groupSelect}
                                    size="small"
                                    onChange={handleChangeSelect}
                                    //autoFocus
                                    //error={errors.so ? true : false}
                                    //{...register("so", {required: true})}//se declara antes del onChange
                                >
                                    <MenuItem value="">
                                        <em>---</em>
                                    </MenuItem>
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group}>{group.name_group}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
    )
        ;
}

export default Group