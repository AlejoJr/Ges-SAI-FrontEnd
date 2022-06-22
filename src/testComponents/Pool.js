import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from 'react-hook-form'

import {getPool, createPool, updatePool} from "../services/Pools";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import {Message} from "../components/utils/LittleComponents";
import {Title} from "../components/utils/Title";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '35%',
    marginTop: 50
}));

function Pool() {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {idPool} = useParams();

    const [id, setId] = useState(0);
    const [ip, setIp] = useState('');
    const [name_pool, setNamePool] = useState('');
    const [type, setType] = useState('');
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');

    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);

    let navigate = useNavigate();

    useEffect(function () {
        getPool_Api();
    }, [])


    const onSubmit = (data) => {
        //e.preventDefault()
        if (parseInt(data.id) > 0){
           poolApi(data, "update");
        }else{
            poolApi(data, "create")
        }
    }

    const poolApi = async (data, method) => {
        var poolJson;

        if (method === "update"){
            poolJson = await updatePool(data);
        }else{
             poolJson = await createPool(data);
        }

        if (poolJson === "Created-OK"  || poolJson === "Updated-OK") {
            navigate("/pools")
        } else if (poolJson === undefined) {
            console.log('Error Pool ->, ', poolJson);
            setIsError(true);
        }
    }

    //Obtener los Pools de la API
    const getPool_Api = async () => {

        if (parseInt(idPool) > 0) {

            const poolJson = await getPool(`${idPool}`);

            setId(poolJson.id);
            setNamePool(poolJson.name_pool);
            setIp(poolJson.ip);
            setType(poolJson.type);
            setUrl(poolJson.url);
            setUsername(poolJson.username);
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
                <Title title={'POOL'}/>
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
                                    name="namePool"
                                    label="Nombre"
                                    value={name_pool}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.namePool ? true : false}
                                    {...register("name_pool", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setNamePool(e.currentTarget.value)}
                                />
                                {errors.namePool &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Nombre del Pool'}/>}
                            </div>
                            <div className="col-md-10">
                                <TextField
                                    id="ipPool"
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
                                         message={'Escriba una IP valida para el Pool'}/>}
                            </div>
                            <div className="col-md-10">
                                <TextField
                                    id="urlPool"
                                    name="url"
                                    label="Url"
                                    value={url}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.url ? true : false}
                                    {...register("url", {
                                        required: true,
                                        pattern: /http(s?)(:\/\/)((www.)?)(([^.]+)\.)?([a-zA-z0-9\-_]+)(.*)(\/[^\s]*)?/
                                    })}//se declara antes del onChange
                                    onChange={(e) => setUrl(e.currentTarget.value)}
                                />
                                {errors.url &&
                                <Message isActive={true} severity={'error'}
                                         message={'Escriba una URL valida para el Pool'}/>}
                            </div>
                            <div className="col-md-8">
                                <TextField
                                    id="usernamePool"
                                    name="username"
                                    label="Username"
                                    value={username}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.username ? true : false}
                                    {...register("username", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setUsername(e.currentTarget.value)}
                                />
                                {errors.username &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Username del Pool'}/>}
                            </div>
                            <div className="col-md-4">
                                <TextField
                                    id="typePool"
                                    name="type"
                                    label="Tipo"
                                    value={type}
                                    variant="outlined"
                                    className="form-control mb-4"
                                    error={errors.type ? true : false}
                                    {...register("type", {required: true})}//se declara antes del onChange
                                    onChange={(e) => setType(e.currentTarget.value)}
                                />
                                {errors.type &&
                                <Message isActive={true} severity={'error'} message={'Escriba el Tipo de Pool'}/>}
                            </div>

                            <Stack spacing={-15} direction="row">
                                <div className="col">
                                    <Button variant="outlined" startIcon={<CheckIcon/>} type="submit">
                                        Guardar
                                    </Button>
                                    {isError &&
                                    <Message isActive={true} severity={'error'}
                                             message={'Ocurrio un error actualizando el Pool'}/>}
                                </div>
                                <div className="col">
                                    <Button variant="outlined" endIcon={<CancelIcon/>}
                                            onClick={() => navigate("/pools")}>
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

export default Pool;