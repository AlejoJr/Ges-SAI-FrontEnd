import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useForm} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from "@mui/material/InputLabel";

import {Title} from "../utils/Title";
import {Loading, GetIdUser} from "../utils/LittleComponents";
import {getPool, createPool, updatePool} from "../../services/Pools";
import {getSais} from "../../services/Sais";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 20;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


/***
 * Componente formulario para (Crear o Editar) un Pool
 * @param: idPool = Si se recibe un id mayor a 0 es un POOL para editar, de lo contrario es un POOL para crear
 ***/
function Pool() {

    const {register, handleSubmit, formState: {errors}, setValue} = useForm();

    const {idPool} = useParams();
    const [connectionRefused, setConnectionRefused] = useState(false);
    const [isError, setIsError] = useState(false);
    const [poolExists, setPoolExists] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [id, setId] = useState(0);
    const [name_pool, setNamePool] = useState('');
    const [ip, setIp] = useState('');
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('X');
    const [admin, setAdmin] = useState('');

    const [saisSelected, setSaisSelected] = useState([]);
    const [sais, setSais] = useState([]);

    let navigate = useNavigate();


    useEffect(function () {
        getPool_Api();
    }, []);

    // <<-- | O B T E N E R - U N - P O O L  |-->
    const getPool_Api = async () => {

        //Se obtienen los SAIS existentes para llenar el select
        const saisJson = await getSais();

        var listSais = [];
        saisJson.results.map((value) => {
            var objSai = {'id': value['id'], 'name_sai': value['name_sai']};
            listSais.push(objSai);
        });

        if (listSais.length > 0) {
            //Ordenamos por orden alfabetico a-z
            var resultSais = listSais.sort(function (a, b) {
                if (a.name_sai === b.name_sai) {
                    return 0;
                }
                if (a.name_sai < b.name_sai) {
                    return -1;
                }
                return 1;
            });

            setSais(resultSais);
        }

        if (parseInt(idPool) > 0) {

            const poolJson = await getPool(`${idPool}`);

            setId(poolJson.id);
            setNamePool(poolJson.name_pool);
            setIp(poolJson.ip);
            setUrl(poolJson.url);
            setUsername(poolJson.username);
            setPassword(poolJson.password);
            setType(poolJson.type);
            setAdmin(poolJson.user);

            //Sais del Pool
            var arraySais = [];
            if (listSais.length > 0) {
                poolJson.sais.map((value) => {
                    listSais.map((sai) => {
                        if (sai['id'] === value) {
                            arraySais.push(sai['name_sai']);
                        }
                    });
                });
                setSaisSelected(arraySais);
            }

            //Establece los valores a los fields del formulario
            setValue("name_pool", poolJson.name_pool);
            setValue("ip", poolJson.ip);
            setValue("url", poolJson.url);
            setValue("username", poolJson.username);
            setValue("password", poolJson.password);
            setValue("type", poolJson.type);
            setValue("sai", arraySais);


        }

    }

    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        //e.preventDefault()
        setLoading(true);
        setConnectionRefused(false);
        var id = idPool > 0 ? idPool : 0;
        var admon = admin === '' ? GetIdUser() : admin;
        var idsSais = getIdsSais();

        var modelPool = {
            "id": id,
            name_pool,
            ip,
            url,
            username,
            password,
            type,
            "user": admon,
            "sais": idsSais
        }

        if (idPool > 0) {
            poolApi(modelPool, "update");
        } else {
            poolApi(modelPool, "create")
        }

    }

    function getIdsSais() {
        var listIds = []
        saisSelected.map((nameSai) => {
            sais.map((sai) => {
                if (sai['name_sai'] === nameSai) {
                    listIds.push(sai['id']);
                }
            });
        });
        return listIds;
    }

    const poolApi = async (data, method) => {
        var poolJson;

        if (method === "update") {
            poolJson = await updatePool(data);
        } else {
            poolJson = await createPool(data);
        }

        if (poolJson === "Created-OK" || poolJson === "Updated-OK") {
            setOpenDialog(true);
        } else if (poolJson === 'Im Used') {
            setPoolExists(true);
            setLoading(false);
        } else if (poolJson === 'Connection refused') {
            setConnectionRefused(true);
            setLoading(false);
        } else if (poolJson === undefined) {
            console.log('Error Pool ->, ', poolJson);
            setIsError(true);
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        setSaisSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClose = () => {
        setOpenDialog(false);
        navigate("/pools");
    };


    return (
        <>
            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                marginTop={5}
            >
                <Title title={'POOL'}/>
                <Item>
                    <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                        {
                            isLoading && <Loading></Loading>
                        }
                        {
                            isLoading && <p>Probando conexión con el Pool</p>
                        }
                        <Grid
                            container
                            justifyContent={"center"}>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_name"
                                    name="name"
                                    label="Nombre"
                                    size="small"
                                    value={name_pool}
                                    variant="outlined"
                                    className="form-control"
                                    error={parseInt(idPool) > 0 ? false : errors.name_pool ? true : false}
                                    {...register("name_pool", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setNamePool(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_ip"
                                    name="ip"
                                    label="Ip"
                                    size="small"
                                    disabled={parseInt(idPool) > 0 ? true : false}
                                    value={ip}
                                    variant="outlined"
                                    className="form-control"
                                    error={parseInt(idPool) > 0 ? false : errors.ip ? true : false}
                                    {...register("ip", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setIp(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_url"
                                    name="url"
                                    label="Url"
                                    size="small"
                                    disabled={parseInt(idPool) > 0 ? true : false}
                                    value={url}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.url ? true : false}
                                    {...register("url", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setUrl(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_Username"
                                    name="username"
                                    label="Username"
                                    size="small"
                                    disabled={parseInt(idPool) > 0 ? true : false}
                                    value={username}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.username ? true : false}
                                    {...register("username", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setUsername(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_Password"
                                    name="password"
                                    label="Contraseña"
                                    size="small"
                                    type={"password"}
                                    disabled={parseInt(idPool) > 0 ? true : false}
                                    value={password}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.password ? true : false}
                                    {...register("password", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <FormControl fullWidth variant="outlined" sx={{m: 0, minWidth: 100}}>
                                    <InputLabel id="id-type-label">Tipo de Hipervisor</InputLabel>
                                    <Select
                                        labelId="id-type-label"
                                        id="id_type"
                                        value={type}
                                        size="small"
                                        disabled={parseInt(idPool) > 0 ? true : false}
                                        //error={errors.type ? true : false}
                                        {...register("type", {required: true})}//se declara antes del onChange
                                        onChange={(e) => setType(e.target.value)}
                                        input={<OutlinedInput label="Tipo de Hipervisor"/>}
                                    >
                                        <MenuItem value={'X'}>Xen</MenuItem>
                                        {/*<MenuItem value={'O'}>Ovirt</MenuItem>*/}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <FormControl sx={{m: 0, width: 425}}>
                                    <InputLabel id="demo-multiple-checkbox-label">SAI</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        size="small"
                                        value={saisSelected}
                                        error={errors.sai ? true : false}
                                        {...register("sai", {required: true})}//se declara antes del onChange
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Sai"/>}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {sais.map((sai) => (
                                            <MenuItem key={sai.id} value={sai.name_sai}>
                                                <Checkbox checked={saisSelected.indexOf(sai.name_sai) > -1}/>
                                                <ListItemText primary={sai.name_sai}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid container
                                  spacing={1}
                                  marginTop={1}
                                  marginBottom={1}>
                                {
                                    <Grid item xs={6}>
                                        <Button size="small" startIcon={<CheckIcon/>} type="submit">
                                            Guardar
                                        </Button>
                                    </Grid>
                                }
                                <Grid item xs={6}>
                                    <Button size="small" startIcon={<ClearIcon/>}
                                            onClick={() => {
                                                navigate(`/pools/`)
                                            }}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={8} marginTop={2} marginBottom={2}>
                                {connectionRefused &&
                                <Alert severity="error">
                                    No se ha podido establecer conexión con el Pool:
                                    <br/>
                                    <strong>{name_pool}</strong>
                                    <br/>
                                    Compruebe que los datos introducidos sean correctos.
                                </Alert>
                                }
                                {isError &&
                                <Alert severity="error">
                                    Ha ocurrido un Error
                                </Alert>
                                }
                                {poolExists &&
                                <Alert severity="warning">
                                    El Pool con Ip: <strong>{ip}</strong> - Url: <strong>{url}</strong>
                                    <br/>
                                    ya se encuentra dado de Alta
                                </Alert>
                                }
                            </Grid>


                        </Grid>
                    </form>

                </Item>
            </Grid>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Operación realizada correctamente !"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        RECUERDE ! Si el Host Master cambia, tendra que crear un nuevo Pool.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>
    );

}

export default Pool;