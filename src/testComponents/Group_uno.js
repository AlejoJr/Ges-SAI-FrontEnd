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

import {updateHost, getHosts, hostsByGroup, deleteHost} from "../../services/Hosts";
import {createGroup, deleteGroup, updateGroup} from "../../services/Groups_uno";
import {GetIdUser, Loading, Message} from "../utils/LittleComponents";
import {Title} from "../utils/Title";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";


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
function Group_uno() {

    const {idGroup} = useParams();
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [isFetch, setIsFetch] = useState(true);
    const [isActiveMessageInfo, setIsActiveMessageInfo] = useState(false);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const [nameTextField, setNameTextField] = useState('');
    const [groupSelect, setGroupSelect] = useState('');
    const [isEmptyTextfield, setIsEmptyTextfield] = useState(false);
    const [isActiveMessageError, setIsActiveMessageError] = useState(false);

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

        //Filtramos solo los host que no estan en ningun grupo
        var listHost = resultHost.filter(el => el.group === null);

        setLeft(listHost);
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
                if (value.hasOwnProperty('group_id')) {
                    delete value.group_id;
                }
                if (value.hasOwnProperty('user_id')) {
                    delete value.user_id;
                    value.user = GetIdUser();
                }
                value.groupId = idGroup;
                value.order = index + 1;

                responseUpdate = updateHost(value);
            });

            //<-- Update : Lista sin grupo -->
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

                responseUpdate = updateHost(value);
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
            right.map((value, index) => {
                value.groupId = idGroup;
                value.order = index + 1;
                responseCreate = updateHost(value);
            });
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
    const handleChange = (e) => {
        setNameTextField(e.currentTarget.value)
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
                            <Grid marginTop={7}>
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
                            <TextField
                                id="id_nameHostTextField"
                                name="nameHostTextField"
                                label="Nombre de Grupo"
                                size="small"
                                value={nameTextField}
                                error={isEmptyTextfield}
                                variant="standard"
                                className="form-control"
                                onChange={handleChange}
                            />
                            <div>
                                <FormControl fullWidth variant="standard" sx={{m: 0, minWidth: 100}}>
                                    <InputLabel id="id-group-label">Grupo</InputLabel>
                                    <Select
                                        labelId="id-group-label"
                                        id="id_Group"
                                        value={groupSelect}
                                        size="small"
                                        onChange={handleChange}
                                        //autoFocus
                                        //error={errors.so ? true : false}
                                        //{...register("so", {required: true})}//se declara antes del onChange
                                    >
                                        <MenuItem value={'W'}>Windows</MenuItem>
                                        <MenuItem value={'L'}>Linux</MenuItem>
                                        <MenuItem value={'M'}>Mac</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
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

export default Group_uno