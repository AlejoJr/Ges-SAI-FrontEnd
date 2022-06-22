import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from 'react-hook-form';

import {getHost, createHost, updateHost, existHostByName_bdExternal} from "../../services/Hosts";

import CardActions from "@mui/material/CardActions";
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";


import {Title} from "../../components/utils/Title";
import {Loading, GetIdUser} from "../../components/utils/LittleComponents";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));

/***
 * Componente formulario para (Crear o Editar) un Pool
 * @param: idPool = Si se recibe un id mayor a 0 es un pool para editar, de lo contrario es un host para crear
 ***/
function Pool() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {idPool} = useParams();
    const {idGroup} = useParams();
    const [existMachine, setExistMachine] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);

    const [nameTextField, setNameTextField] = useState('');

    const [id, setId] = useState(0);
    const [name_pool, setNamePool] = useState('');
    const [ip, setIp] = useState('');
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [type, setType] = useState(0);


    const [so, setSo] = useState('');
    const [group, setGroup] = useState(null);

    const [pool, setPool] = useState('');
    const [user, setUser] = useState('');

    let navigate = useNavigate();

    useEffect(function () {
        if (idPool > 0) {
            setExistMachine(true);
        }
        getHost_Api();
    }, [])

    // <<-- | O B T E N E R - U N - H O S T  |-->
    const getHost_Api = async () => {

        if (parseInt(idPool) > 0) {

            const hostJson = await getHost(`${idPool}`);

            setId(hostJson.id);
            setNamePool(hostJson.name_pool);
            setIp(hostJson.ip);
            setUrl(hostJson.url);
            setSo(hostJson.so);
            setGroup(hostJson.group);
            setType(hostJson.type);
            setUsername(hostJson.username);
            setPool(hostJson.pool);
            setUser(hostJson.user);
        }

        setIsReady(true);
    }

    // <<-- | B U S C A R - M A Q U I N A - (BD EXTERNA ) |-->
    const searchByName = (nameMachine) => async () => {
        setLoading(true);
        const machine = await existHostByName_bdExternal(nameMachine.nameTextField);
        setIsSearch(true);

        if (machine != 'not found machine') {
            setExistMachine(true);
            setIsSearch(false);
            setLoading(false);

            setNamePool(machine.name_pool);
            setIp(machine.ip);
            setUrl(machine.url);
        } else {
            setExistMachine(false);
            setIsSearch(true);
            setLoading(false);
        }

    }

    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        //e.preventDefault()
        var id = idPool > 0 ? idPool : 0;
        var groupId = idGroup !== undefined ? idGroup : null;
        var modelHost = {
            "id": id,
            name_pool,
            ip,
            url,
            so,
            "groupId": groupId,
            "type": type,
            username,
            "pool": null,
            "user": GetIdUser()
        }

        if (idPool > 0) {
            hostApi(modelHost, "update");
        } else {
            hostApi(modelHost, "create")
        }
    }

    const hostApi = async (data, method) => {
        var hostJson;

        if (method === "update") {
            hostJson = await updateHost(data);
        } else {
            hostJson = await createHost(data);
        }

        if (hostJson === "Created-OK" || hostJson === "Updated-OK") {
            navigate("/hosts")
        } else if (hostJson === undefined) {
            console.log('Error Host ->, ', hostJson);
            setIsError(true);
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD) |-->>
    const handleChange = (e) => {
        setNameTextField(e.currentTarget.value)
        setIsSearch(false)
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
                <Title title={'POOL'}/>
                <Item>
                    <Grid marginTop={4} marginBottom={1}>
                        <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                            <Card sx={{minWidth: 275}}>
                                <Grid container
                                      spacing={1}>
                                    <Grid>
                                        <TextField
                                            hidden={true}
                                            id="id"
                                            name="id"
                                            label="Id"
                                            value={id}
                                            variant="outlined"
                                            type="number"
                                            className="form-control mb-4"
                                            onChange={(e) => setId(e.currentTarget.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_nameHost"
                                            name="nameHost"
                                            label="Nombre de Maquina"
                                            size="small"
                                            value={name_pool}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_ip"
                                            name="ip"
                                            label="Ip"
                                            size="small"
                                            value={ip}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={2}>
                                        <TextField
                                            disabled
                                            id="id_mac"
                                            name="url"
                                            label="url"
                                            size="small"
                                            value={url}
                                            variant="outlined"
                                            className="form-control"
                                        />
                                    </Grid>
                                    <Grid item xs={6} marginTop={1}>
                                        <FormControl fullWidth variant="standard" sx={{m: 0, minWidth: 100}}>
                                            <InputLabel id="id-So-label">Sistema Operativo</InputLabel>
                                            <Select
                                                labelId="id-So-label"
                                                id="id_so"
                                                value={so}
                                                size="small"
                                                autoFocus
                                                error={errors.so ? true : false}
                                                {...register("so", {required: true})}//se declara antes del onChange
                                                onChange={(e) => setSo(e.target.value)}
                                            >
                                                <MenuItem value={'W'}>Windows</MenuItem>
                                                <MenuItem value={'L'}>Linux</MenuItem>
                                                <MenuItem value={'M'}>url</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} marginTop={2}>
                                        <TextField
                                            id="id_description"
                                            name="username"
                                            label="Descripción"
                                            size="small"
                                            multiline
                                            maxRows={2}
                                            value={username}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <CardActions>
                                    <Grid container
                                          spacing={1}
                                          marginTop={1}
                                          marginBottom={1}>
                                        <Grid item xs={6}>
                                            <Button size="small" startIcon={<CheckIcon/>} type="submit">
                                                Guardar
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button size="small" startIcon={<ClearIcon/>}
                                                    onClick={() => {
                                                        navigate(`/hosts/`)
                                                    }}>
                                                Cancelar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </form>
                    </Grid>

                    {!existMachine && isSearch &&
                    <Alert severity="warning">
                        <strong>Sin resultados - </strong>
                        La siguiente máquina no se ha encontrado en el sistema
                        <br/>
                        <strong>{nameTextField}</strong>
                    </Alert>
                    }
                </Item>
            </Grid>
        </>
    );

}

export default Pool;