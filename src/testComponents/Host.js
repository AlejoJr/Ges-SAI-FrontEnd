import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from 'react-hook-form';

import {getHost, createHost, updateHost} from "../services/Hosts";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import {Message} from "./LittleComponents";
import {Title} from "./Title";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '35%',
    marginTop: 50
}));

function Host() {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {idHost} = useParams();

    const [id, setId] = useState(0);
    const [ip, setIp] = useState('');
    const [name_host, setNameHost] = useState('');
    const [mac, setMac] = useState('');
    const [so, setSo] = useState('');
    const [group, setGroup] = useState(0);
    const [order, setOrder] = useState(0);
    const [description, setDescription] = useState('');
    const [pool, setPool] = useState('');
    const [user, setUser] = useState('');

    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);


    let navigate = useNavigate();

    useEffect(function () {
        getHost_Api();
    }, [])


    const onSubmit = (data) => {
        //e.preventDefault()
        if (parseInt(data.id) > 0) {
            hostApi(data, "update");
        } else {
            hostApi(data, "create")
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

    //Obtener los ContainerHosts de la API
    const getHost_Api = async () => {

        if (parseInt(idHost) > 0) {

            const hostJson = await getHost(`${idHost}`);

            setId(hostJson.id);
            setNameHost(hostJson.name_host);
            setIp(hostJson.ip);
            setMac(hostJson.mac);
            setSo(hostJson.so);
            setOrder(hostJson.order);
            setDescription(hostJson.description);
            setPool(hostJson.pool);
            setUser(hostJson.user);
        }

        setIsReady(true);
    }

    /* const guardarDatos = (e) => {
        e.preventDefault()
        console.log('guardados,', e)
    }

   const cambioEnInput = (event) => {
        console.log(event.target.value)
    }*/

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
                <Title title={'HOST'}/>
                <Item>
                    {
                        //Validamos que esten listos los datos para mostrar el form
                        isReady &&

                        <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                            <div className="col-md-auto">
                                <TextField
                                    hidden={true}
                                    id="id"
                                    name="id"
                                    label="Id"
                                    value={id}
                                    variant="outlined"
                                    type="number"
                                    className="form-control mb-4"
                                    {...register("id", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setId(e.currentTarget.value)}
                                />
                            </div>
                            <div className="col-md-auto">
                                <TextField
                                    id="namePool"
                                    name="name_host"
                                    label="Nombre"
                                    value={name_host}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.name_host ? true : false}
                                    {...register("name_host", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setNameHost(e.currentTarget.value)}
                                />
                                {errors.name_host &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Nombre del Host'}/>}
                            </div>
                            <div className="col-md-10">
                                <TextField
                                    id="ipHost"
                                    name="ip"
                                    label="Ip"
                                    value={ip}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.ip ? true : false}
                                    {...register("ip", {
                                        required: true,
                                        pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
                                    })}//se declara antes del onChange
                                    onChange={(e) => setIp(e.currentTarget.value)}
                                />
                                {errors.ip &&
                                <Message isActive={true} severity={'error'}
                                         message={'Escriba una IP valida para el Host'}/>}
                            </div>
                            <div className="col-md-10">
                                <TextField
                                    id="macHost"
                                    name="mac"
                                    label="Mac"
                                    value={mac}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.mac ? true : false}
                                    {...register("mac", {
                                        required: true,
                                        //pattern: /http(s?)(:\/\/)((www.)?)(([^.]+)\.)?([a-zA-z0-9\-_]+)(.*)(\/[^\s]*)?/
                                    })}//se declara antes del onChange
                                    onChange={(e) => setMac(e.currentTarget.value)}
                                />
                                {errors.mac &&
                                <Message isActive={true} severity={'error'}
                                         message={'Escriba una MAC valida para el Host'}/>}
                            </div>
                            <div className="col-md-auto">
                                <TextField
                                    id="so"
                                    name="so"
                                    label="Sistema Operativo"
                                    value={so}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.so ? true : false}
                                    {...register("so", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setSo(e.currentTarget.value)}
                                />
                                {errors.so &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Estado del Host'}/>}
                            </div>
                            <div className="col-md-auto">
                                <TextField
                                    hidden={true}
                                    id="group"
                                    name="group"
                                    label="Grupo"
                                    value={group}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.group ? true : false}
                                    {...register("group", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setGroup(e.currentTarget.value)}
                                />
                                {errors.power_state &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Grupo del Host'}/>}
                            </div>

                            <div className="col-md-auto">
                                <TextField
                                    hidden={true}
                                    id="order"
                                    name="order"
                                    label="Orden"
                                    value={order}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.order ? true : false}
                                    {...register("order", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setOrder(e.currentTarget.value)}
                                />
                                {errors.order &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Orden del Host'}/>}
                            </div>

                            <div className="col-md-auto">
                                <TextField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    value={description}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.ref ? true : false}
                                    {...register("description", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setDescription(e.currentTarget.value)}
                                />
                                {errors.description &&
                                <Message isActive={true} severity={'error'}
                                         message={'Escriba la descripción del Host'}/>}
                            </div>

                            <div className="col-md-auto">
                                <TextField
                                    id="pool"
                                    name="pool"
                                    label="Pool"
                                    value={pool}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.ref ? true : false}
                                    {...register("pool", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setPool(e.currentTarget.value)}
                                />
                                {errors.pool &&
                                <Message isActive={true} severity={'error'} message={'Asigne un Pool al  Host'}/>}
                            </div>

                            <div className="col-md-auto">
                                <TextField
                                    id="user"
                                    name="user"
                                    label="User"
                                    value={user}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.ref ? true : false}
                                    {...register("user", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setUser(e.currentTarget.value)}
                                />
                                {errors.user &&
                                <Message isActive={true} severity={'error'} message={'Asigne un Usuario al  Host'}/>}
                            </div>

                            <Stack spacing={-15} direction="row">
                                <div className="col">
                                    <Button variant="outlined" startIcon={<CheckIcon/>} type="submit">
                                        Guardar
                                    </Button>
                                    {isError &&
                                    <Message isActive={true} severity={'error'}
                                             message={'Ocurrio un error actualizando el Host'}/>}
                                </div>
                                <div className="col">
                                    <Button variant="outlined" endIcon={<CancelIcon/>}
                                            onClick={() => navigate("/hosts")}>
                                        Cancelar
                                    </Button>
                                </div>
                            </Stack>

                        </form>
                    }
                </Item>
            </Grid>
        </>
    );

}

export default Host;