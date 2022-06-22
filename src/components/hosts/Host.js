import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from 'react-hook-form';

import CardActions from "@mui/material/CardActions";
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";
import Link from '@mui/material/Link';
import SearchIcon from "@mui/icons-material/Search";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {Title} from "../utils/Title";
import {Loading, GetIdUser, Message} from "../utils/LittleComponents";
import {getHost, createHost, updateHost, existHostByName_bdExternal, downloadFile} from "../../services/Hosts";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import {getSais} from "../../services/Sais";
import FormControlLabel from "@mui/material/FormControlLabel";


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
 * Componente formulario para (Buscar o Editar) un Host
 * @param: idHost = Si se recibe un id mayor a 0 es un host para editar, de lo contrario es un host para crear
 ***/
function Host() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {idHost} = useParams();
    const {idGroup} = useParams();
    const [existMachine, setExistMachine] = useState(false);
    const [existHost, setExistHost] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);
    const [activeMessage, setActiveMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [is_machineStorage, setIsMachineStorage] = useState(false);
    const [open, setOpen] = useState(false);

    const [nameTextField, setNameTextField] = useState('');

    const [id, setId] = useState(0);
    const [name_host, setNameHost] = useState('');
    const [ip, setIp] = useState('');
    const [mac, setMac] = useState('');
    const [so, setSo] = useState('');
    const [group, setGroup] = useState(null);
    const [order, setOrder] = useState(null);
    const [description, setDescription] = useState('');
    const [domain, setDomain] = useState('');
    const [pool, setPool] = useState('');
    const [user, setUser] = useState('');
    const [type_host, setType_host] = useState('');
    const [saisSelected, setSaisSelected] = useState([]);
    const [sais, setSais] = useState([]);
    const [host_host, setHostHost] = useState([]);

    let navigate = useNavigate();

    useEffect(function () {
        if (idHost > 0) {
            setExistMachine(true);
        }
        getHost_Api();
    }, [])

    // <<-- | O B T E N E R - U N - H O S T  |-->
    const getHost_Api = async () => {

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


        if (parseInt(idHost) > 0) {

            const hostJson = await getHost(`${idHost}`);

            setId(hostJson.id);
            setNameHost(hostJson.name_host);
            setIp(hostJson.ip === null ? '' : hostJson.ip);
            setMac(hostJson.mac === null ? '' : hostJson.mac);
            setSo(hostJson.so === null ? '' : hostJson.so);
            setGroup(hostJson.group);
            setOrder(hostJson.order);
            setDescription(hostJson.description === null ? '' : hostJson.description);
            setPool(hostJson.pool === null ? null : hostJson.pool.id);
            setUser(hostJson.user);
            setType_host(hostJson.type_host);
            setHostHost(hostJson.host_host);

            if (hostJson.type_host === 'SM') {
                setIsMachineStorage(true)
            }

            //Sais del Host
            var arraySais = [];
            if (listSais.length > 0) {
                hostJson.sais.map((value) => {
                    listSais.map((sai) => {
                        if (sai['id'] === value) {
                            arraySais.push(sai['name_sai']);
                        }
                    });
                });
                setSaisSelected(arraySais);
            }
        }

        setIsReady(true);
    }

    // <<-- | B U S C A R - M A Q U I N A - (BD EXTERNA ) |-->
    const searchByName = (nameMachine) => async () => {
        setExistHost(false);
        setLoading(true);
        const machine = await existHostByName_bdExternal(nameMachine.nameTextField);
        setIsSearch(true);

        if (machine != 'not found machine') {
            setExistMachine(true);
            setIsSearch(false);
            setLoading(false);

            setNameHost(machine.name_host);
            setIp(machine.ip);
            setMac(machine.mac);
        } else {
            setExistMachine(false);
            setIsSearch(true);
            setLoading(false);
        }

    }

    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        console.log(data)
        //e.preventDefault()
        var id = idHost > 0 ? idHost : 0;
        var ip_host = ip === '' ? null : ip;
        var mac_host = mac === '' ? null : mac;
        var so_host = so === '' ? null : so;
        var pool_host = pool === null ? null : pool;
        var typeHost = type_host !== '' ? type_host : "MF";
        typeHost = is_machineStorage === true ? "SM" : typeHost;
        var groupId = idGroup !== undefined ? idGroup : null;
        var idsSais = getIdsSais();

        var modelHost = {
            "id": id,
            name_host,
            "ip": ip_host,
            "mac": mac_host,
            "so": so_host,
            "groupId": groupId,
            "order": order,
            description,
            "poolId": pool_host,
            "user": GetIdUser(),
            "type_host": typeHost,
            "sais": idsSais,
            "host_host": host_host
        }
        if (domain.length > 0) {
            if (idHost > 0) {
                hostApi(modelHost, "update");
            } else {
                hostApi(modelHost, "create");
            }
        } else {
            setMessage('Debe escribir un Dominio para la Máquina');
            setActiveMessage(true);
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

    const hostApi = async (data, method) => {
        var hostJson;

        if (method === "update") {
            hostJson = await updateHost(data);
        } else {
            hostJson = await createHost(data);
        }

        if (hostJson === "Created-OK" || hostJson === "Updated-OK") {
            navigate("/hosts")
        } else if (hostJson === 'Im Used') {
            setExistHost(true);
        } else if (hostJson === undefined) {
            console.log('Error Host ->, ', hostJson);
            setIsError(true);
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD) |-->>
    const handleChangeTextField = (e) => {
        setNameTextField(e.currentTarget.value)
        setIsSearch(false)
    }
    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (SELECT-SAIS) |-->>
    const handleChangeSelect = (event) => {
        const {
            target: {value},
        } = event;
        setSaisSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (TEXTFIELD-DOMAIN) |-->>
    const handlerFocusOut = (e) => {
        setActiveMessage(false);
        var onlyNameHost = name_host.split(".");

        if (domain !== '') {
            setNameHost(onlyNameHost[0] + '.' + domain);
        } else {
            setNameHost(onlyNameHost[0]);
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (CHECKBOX) |-->>
    const handleChangeCheckBox = (event) => {
        setIsMachineStorage(event.target.checked)
        if (event.target.checked) {
            setExistMachine(true);
        } else {
            setExistMachine(false);
            setNameTextField('');
        }
    }

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (DIALOG) |-->>
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDowndLoadFile = () => {
        downloadFile('http://localhost:8000/download/id_rsa.pub', 'id_rsa');
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
                marginBottom={8}
                //justifyContent="center"
            >
                <Title title={'MÁQUINA'}/>
                <Item>
                    {
                        idHost == 0 &&
                        <FormControlLabel
                            value="top"
                            control={<Checkbox checked={is_machineStorage}
                                               onChange={handleChangeCheckBox}
                                               inputProps={{'aria-label': 'controlled'}}/>}
                            label="Es Almacenamiento"
                            labelPlacement="top"
                        />
                    }
                    {
                        idHost == 0 && !is_machineStorage &&
                        <Grid container
                              spacing={1}
                              marginTop={1}
                              marginBottom={1}>
                            <Grid item xs={6} marginLeft={10}>
                                <TextField
                                    id="id_nameHostTextField"
                                    name="nameHostTextField"
                                    label="Nombre de Maquina"
                                    size="small"
                                    value={nameTextField}
                                    variant="outlined"
                                    className="form-control"
                                    onChange={handleChangeTextField}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="outlined" size="medium" startIcon={<SearchIcon/>}
                                        onClick={searchByName({nameTextField})}>
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {
                        isLoading && <Loading></Loading>
                    }
                    <Divider/>
                    {existMachine &&
                    <Grid marginTop={2} marginBottom={1}>
                        <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                            <Card sx={{minWidth: 275}}>
                                <Grid container
                                      spacing={1}
                                      justifyContent={"center"}>
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
                                    <Grid item xs={8} marginTop={2}>
                                        <TextField
                                            disabled={is_machineStorage === true ? false : true}
                                            id="id_nameHost"
                                            name="nameHost"
                                            label="Nombre de Maquina"
                                            size="small"
                                            value={name_host}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setNameHost(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <TextField
                                            id="id_Domain"
                                            name="domain"
                                            label="Dominio"
                                            size="small"
                                            value={domain}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setDomain(e.currentTarget.value)}
                                            onBlur={handlerFocusOut}
                                        />
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <TextField
                                            disabled={is_machineStorage === true ? false : true}
                                            id="id_ip"
                                            name="ip"
                                            label="Ip"
                                            size="small"
                                            value={ip}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setIp(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <TextField
                                            disabled={is_machineStorage === true ? false : true}
                                            id="id_mac"
                                            name="mac"
                                            label="Mac"
                                            size="small"
                                            value={mac}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setMac(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <FormControl fullWidth variant="outlined" sx={{m: 0, minWidth: 100}}>
                                            <InputLabel id="id-So-label">Sistema Operativo</InputLabel>
                                            <Select
                                                labelId="id-So-label"
                                                id="id_so"
                                                value={so}
                                                size="small"
                                                autoFocus={so.length > 0 ? true : false}
                                                error={errors.so ? true : false}
                                                {...register("so", {required: true})}//se declara antes del onChange
                                                onChange={(e) => setSo(e.target.value)}
                                                input={<OutlinedInput label="Sistema Operativo"/>}
                                            >
                                                <MenuItem value={'W'}>Windows</MenuItem>
                                                <MenuItem value={'L'}>Linux</MenuItem>
                                                <MenuItem value={'M'}>Mac</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <FormControl sx={{m: 0, width: 425}}>
                                            <InputLabel id="demo-multiple-checkbox-label">SAI</InputLabel>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                //multiple
                                                size="small"
                                                value={saisSelected}
                                                autoFocus={saisSelected.length > 0 ? true : false}
                                                error={errors.sai ? true : false}
                                                {...register("sai", {required: true})}//se declara antes del onChange
                                                onChange={handleChangeSelect}
                                                input={<OutlinedInput label="Sai"/>}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                            >
                                                {sais.map((sai) => (
                                                    <MenuItem key={sai.id} value={sai.name_sai}>
                                                        <Checkbox checked={saisSelected.indexOf(sai.name_sai) > -1}
                                                        />
                                                        <ListItemText primary={sai.name_sai}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} marginTop={2}>
                                        <TextField
                                            id="id_description"
                                            name="description"
                                            label="Descripción"
                                            size="small"
                                            multiline
                                            rows={3}
                                            value={description}
                                            variant="outlined"
                                            className="form-control"
                                            onChange={(e) => setDescription(e.target.value)}
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
                    }
                    {existHost &&
                    <Alert severity="warning">
                        La máquina: <strong>{name_host}</strong> ya se encuentra dada de alta en el sistema
                    </Alert>}
                    {!existMachine && isSearch &&
                    <Alert severity="warning">
                        <strong>Sin resultados - </strong>
                        La siguiente máquina no se ha encontrado en el sistema
                        <br/>
                        <strong>{nameTextField}</strong>
                    </Alert>
                    }
                    {
                        activeMessage &&
                        <Alert severity="warning">
                            {message}
                        </Alert>
                    }

                    <Button variant="text" onClick={handleClickOpen} startIcon={<PriorityHighIcon/>}>
                        Instrucciones Importantes
                    </Button>
                    <Dialog
                        maxWidth={"md"}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Integrar máquina al sistema de automatización de apagado y encendido"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography  component={'span'} variant="body2" display="block" gutterBottom>
                                    Para que la máquina que desea dar de alta sea reconocida por el sistema al
                                    momento de su apagado o encendido haga lo siguiente dependiendo del sistema
                                    operativo.
                                </Typography>
                                <Typography component={'span'} variant="overline" display="block" gutterBottom>
                                    <strong>Linux:</strong>
                                </Typography>
                                <Typography  component={'span'} variant="body2" display="block" gutterBottom>
                                    Descargue el <Link href="" onClick={handleDowndLoadFile}>Archivo</Link> de clave publica y copielo en la siguiente ruta de la máquina
                                    /root/.ssh/authorized_keys
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Luego de esto abra el archivo que se encuentra en la ruta /etc/ssh/sshd_config
                                    y edite las siguientes lineas.
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> PermitRootLogin yes
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> PasswordAuthentication yes
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Habilite el usuario root con los siguientes comandos:
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> sudo -i
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> sudo passwd root
                                </Typography>
                                <Typography component={'span'} variant="overline" display="block" gutterBottom>
                                    <strong>Windows:</strong>
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Cree un usuario root y que este pertenezca al grupo de administradores
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Descargue el <Link href="" onClick={handleDowndLoadFile}>Archivo</Link> de clave publica y copielo en la siguiente ruta de la máquina
                                    C:/Users/root/.ssh/authorized_keys
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Luego de esto abra el archivo que se encuentra en la ruta
                                    C:/ProgramData/ssh/sshd_config y edite las siguientes lineas.
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> PubkeyAuthentication yes
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> PasswordAuthentication no
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    Comente las siguientes líneas que se encuentran al final del archivo
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> #Match Group administrators
                                </Typography>
                                <Typography component={'span'} variant="caption" display="block" gutterBottom>
                                    <strong> -</strong> #AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
                                </Typography>
                                <Typography component={'span'} variant="body2" display="block" gutterBottom>
                                    No olvide reiniciar el servicio sshd después de guardar los cambios en sshd_config.
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDowndLoadFile} autoFocus>
                                Descargar Archivo
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Item>
            </Grid>
        </>
    );

}

export default Host;