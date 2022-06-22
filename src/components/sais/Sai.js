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

import {Title} from "../utils/Title";
import {GetIdUser, Message, Loading} from "../utils/LittleComponents";
import {createSai, updateSai, getSai, tryConnectionSai} from "../../services/Sais";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));

/***
 * Componente formulario para (Crear o Editar) un Sai
 * @param: idSai = Si se recibe un id mayor a 0 es un SAI para editar, de lo contrario es un SAI para crear
 ***/
function Sai() {

    const {register, handleSubmit, formState: {errors}, setValue} = useForm();

    const {idSai} = useParams();
    const [machineNotFound, setMachineNotFound] = useState(false);
    const [connectionRefused, setConnectionRefused] = useState(false);
    const [isError, setIsError] = useState(false);
    const [saiExists, setSaiExists] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [id, setId] = useState(0);
    const [name_sai, setNameSai] = useState('');
    const [userConnection, setUserConection] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [privKey, setPrivKey] = useState('');
    const [ip, setIp] = useState('');
    const [mac, setMac] = useState('');
    const [url, setUrl] = useState('');
    const [protocol, setProtocol] = useState('SNMP');
    const [code_oid, setCodeOid] = useState('');
    const [value_off, setValueOff] = useState('');
    const [value_on, setValueOn] = useState('');
    const [admin, setAdmin] = useState('');

    let navigate = useNavigate();

    useEffect(function () {
        getSai_Api();
    }, [])

    // <<-- | O B T E N E R - U N - S A I  |-->
    const getSai_Api = async () => {

        if (parseInt(idSai) > 0) {

            const saiJson = await getSai(`${idSai}`);

            setId(saiJson.id);
            setNameSai(saiJson.name_sai);
            setUserConection(saiJson.userConnection);
            setAuthKey(saiJson.authKey);
            setPrivKey(saiJson.privKey);
            setIp(saiJson.ip);
            setMac(saiJson.mac);
            setUrl(saiJson.url);
            setProtocol(saiJson.protocol);
            setCodeOid(saiJson.code_oid);
            setValueOff(saiJson.value_off);
            setValueOn(saiJson.value_on);
            setAdmin(saiJson.administrator);

            //Establece los valores a los fields del formulario
            setValue("name_sai", saiJson.name_sai);
            setValue("userConnection",saiJson.userConnection);
            setValue("authKey",saiJson.authKey);
            setValue("privKey",saiJson.privKey);
            setValue("ip",saiJson.ip);
            setValue("mac",saiJson.mac);
            setValue("url",saiJson.url);
            setValue("protocol",saiJson.protocol);
            setValue("code_oid",saiJson.code_oid);
            setValue("value_off",saiJson.value_off);
            setValue("value_on",saiJson.value_on);
        }else{
            setValue("ip"," ");
            setValue("mac"," ");
            setValue("protocol",'SNMP');
        }

    }


    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        //e.preventDefault()
        setLoading(true);
        setMachineNotFound(false);
        setConnectionRefused(false);
        var id = idSai > 0 ? idSai : 0;
        var admon = admin === '' ? GetIdUser() : admin;

        var modelSai = {
            "id": id,
            name_sai,
            userConnection,
            authKey,
            privKey,
            ip,
            mac,
            url,
            protocol,
            "state": "not started",
            "administrator": admon,
            code_oid,
            value_off,
            value_on
        }

        if (idSai > 0) {
            saiApi(modelSai, "update");
        } else {
            saiApi(modelSai, "create")
        }

    }

    const saiApi = async (data, method) => {
        var saiJson;

        saiJson = await tryConnectionSai(data);

        if (saiJson['Connection'] === 'OK') {
            data['ip'] = saiJson['ip']
            data['mac'] = saiJson['mac']

            if (method === "update") {
                saiJson = await updateSai(data);
            } else {
                saiJson = await createSai(data);
            }

            if (saiJson === "Created-OK" || saiJson === "Updated-OK") {
                navigate("/sais")
            } else if (saiJson === 'Im Used') {
                setSaiExists(true);
                setLoading(false);
            } else if (saiJson === undefined) {
                console.log('Error Sai ->, ', saiJson);
                setIsError(true);
                setLoading(false);
            }
        } else if (saiJson['Connection'] === 'NOT-FOUND') {
            setMachineNotFound(true);
            setLoading(false);

        } else {
            console.log(saiJson)
            setConnectionRefused(true);
            setLoading(false);
        }
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                marginTop={5}
            >
                <Title title={'SAI'}/>
                <Item>
                    <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                        {
                            isLoading && <Loading></Loading>
                        }
                        {
                            isLoading && <p>Probando conexión con el Sai</p>
                        }
                        <Grid
                            container
                            justifyContent={"center"}>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_name"
                                    name="name"
                                    label="Nombre DNS"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={name_sai}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.name_sai ? true : false}
                                    {...register("name_sai", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setNameSai(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2} hidden={parseInt(idSai) === 0 ? true : false}>
                                <TextField
                                    id="id_ip"
                                    name="ip"
                                    label="Ip"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={ip}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.ip ? true : false}
                                    {...register("ip", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setIp(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2} hidden={parseInt(idSai) === 0 ? true : false}>
                                <TextField
                                    id="id_mac"
                                    name="mac"
                                    label="Mac"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={mac}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.mac ? true : false}
                                    {...register("mac", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setMac(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_url"
                                    name="url"
                                    label="Url"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
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
                                    id="id_userConection"
                                    name="userConnection"
                                    label="Usuario de conexión"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={userConnection}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.userConnection ? true : false}
                                    {...register("userConnection", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setUserConection(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_authKey"
                                    name="authkey"
                                    label="Clave de Autorización"
                                    size="small"
                                    type={"password"}
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={authKey}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.authKey ? true : false}
                                    {...register("authKey", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setAuthKey(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_privKey"
                                    name="privKey"
                                    label="Clave Privada"
                                    size="small"
                                    type={"password"}
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={privKey}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.privKey ? true : false}
                                    {...register("privKey", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setPrivKey(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_codeOid"
                                    name="code_oid"
                                    label="Codigo MIB"
                                    size="small"
                                    disabled={parseInt(idSai) > 0 ? true : false}
                                    value={code_oid}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.code_oid ? true : false}
                                    {...register("code_oid", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setCodeOid(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_valueOff"
                                    name="valueOff"
                                    label="Tiempo de apagado - (minutos)"
                                    size="small"
                                    value={value_off}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.value_off ? true : false}
                                    {...register("value_off", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setValueOff(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_valueOn"
                                    name="valueOn"
                                    label="Tiempo de encendido - (minutos)"
                                    size="small"
                                    value={value_on}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.value_on ? true : false}
                                    {...register("value_on", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setValueOn(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_protocol"
                                    name="protocol"
                                    label="Protocolo"
                                    size="small"
                                    disabled={true}
                                    value={protocol}
                                    variant="outlined"
                                    className="form-control"
                                    error={errors.protocol ? true : false}
                                    {...register("protocol", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setProtocol(e.currentTarget.value)}
                                />
                            </Grid>

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
                                                navigate(`/sais/`)
                                            }}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>


                            <Grid item xs={8} marginTop={2} marginBottom={2}>
                                {machineNotFound &&
                                <Alert severity="warning">
                                    El nombre DNS para la Máquina: <strong>{name_sai}</strong> no existe!
                                    <br/>
                                    Compruebe que los datos introducidos sean correctos.
                                </Alert>
                                }
                            </Grid>

                            <Grid item xs={8} marginTop={2} marginBottom={2}>
                                {connectionRefused &&
                                <Alert severity="error">
                                    No se ha podido establecer conexión con el SAI: <strong>{name_sai}</strong>
                                    <br/>
                                    Compruebe que los datos introducidos sean correctos.
                                </Alert>
                                }
                                {isError &&
                                <Alert severity="error">
                                    Ha ocurrido un Error.
                                </Alert>
                                }
                                {saiExists &&
                                <Alert severity="warning">
                                    El Sai: <strong>{name_sai}</strong> ya se encuentra dado de alta.
                                </Alert>
                                }
                            </Grid>


                        </Grid>
                    </form>

                </Item>
            </Grid>
        </>
    );

}

export default Sai;