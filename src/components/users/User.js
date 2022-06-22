import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useForm} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";

import {Title} from "../utils/Title";
import {Message} from "../utils/LittleComponents";
import {createUser, updateUser, getUser} from "../../services/Users";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));

/***
 * Componente formulario para (Crear o Editar) un Usuario
 * @param: idUser = Si se recibe un id mayor a 0 es un usuario para editar, de lo contrario es un usuario para crear
 ***/
function User() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {idUser} = useParams();
    const [existsUser, setExistsUser] = useState(false);
    const [isError, setIsError] = useState(false);

    const [id, setId] = useState(0);
    const [first_name, setFirst_name] = useState('');
    const [username, setNameUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [is_superuser, setIsTechnical] = useState(false);

    const [isEmptyName, setIsEmptyName] = useState(false);
    const [isEmptyUsername, setIsEmptyUsername] = useState(false);
    const [isEmptyPassword, setIsEmptyPassword] = useState(false);
    const [isEmptyEmail, setIsEmptyEmail] = useState(false);



    let navigate = useNavigate();

    useEffect(function () {
        getUser_Api();
    }, [])

    // <<-- | O B T E N E R - U N - U S U A R I O  |-->
    const getUser_Api = async () => {

        if (parseInt(idUser) > 0) {

            const userJson = await getUser(`${idUser}`);

            setId(userJson.id);
            setFirst_name(userJson.first_name);
            setNameUser(userJson.username);
            setEmail(userJson.email);
            setPassword(userJson.password);
            setIsTechnical(userJson.is_superuser);

        }

    }


    //<<--| G U A R D A R - L O S - D A T O S |-->>
    const onSubmit = (data) => {
        //e.preventDefault()

        var id = idUser > 0 ? idUser : 0;

        if (username.trim() === '') {
            setIsEmptyUsername(true);
        } else if (password.trim() === '') {
            setIsEmptyPassword(true);
        } else if (first_name.trim() === '') {
            setIsEmptyName(true);
        } else if (email.trim() === '') {
            setIsEmptyEmail(true);
        }  else {

            var modelUser = {
                "id": id,
                first_name,
                username,
                email,
                password,
                is_superuser
            }

            if (idUser > 0) {
                userApi(modelUser, "update");
            } else {
                userApi(modelUser, "create")
            }
        }

    }

    const userApi = async (data, method) => {
        var userJson;

        if (method === "update") {
            userJson = await updateUser(data);
        } else {
            userJson = await createUser(data);
        }

        if (userJson === "Created-OK" || userJson === "Updated-OK") {
            navigate("/users")
        } else if (userJson === 'Im Used') {
            setExistsUser(true);
        } else if (userJson === undefined) {
            console.log('Error User ->, ', userJson);
            setIsError(true);
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
                <Title title={'USUARIO'}/>
                <Item>
                    <form className="row-cols-1" onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            justifyContent={"center"}>
                            <Grid item xs={6} marginTop={2}>
                                <FormControlLabel
                                    value="top"
                                    control={<Checkbox checked={is_superuser}
                                                       onChange={(e) => setIsTechnical(e.target.checked)}
                                                       inputProps={{'aria-label': 'controlled'}}/>}
                                    label="Es Técnico"
                                    labelPlacement="top"
                                />
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_nameUser"
                                    name="nameUser"
                                    label="Login"
                                    size="small"
                                    disabled={idUser > 0 ? true : false}
                                    value={username}
                                    variant="outlined"
                                    className="form-control"
                                    error={isEmptyUsername}
                                    onChange={(e) => setNameUser(e.currentTarget.value)}
                                />
                                {isEmptyUsername &&
                                <Message isActive={true} severity={'error'}
                                         message={'Debe ingresar un valor en el campo Login'}/>}
                            </Grid>
                             <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_name"
                                    name="name"
                                    label="Nombre"
                                    size="small"
                                    value={first_name}
                                    variant="outlined"
                                    className="form-control"
                                    error={isEmptyName}
                                    onChange={(e) => setFirst_name(e.currentTarget.value)}
                                />
                                {isEmptyName &&
                                <Message isActive={true} severity={'error'}
                                         message={'Debe ingresar un valor en el campo Nombre'}/>}
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_email"
                                    name="email"
                                    label="Email"
                                    size="small"
                                    type={"email"}
                                    value={email}
                                    variant="outlined"
                                    className="form-control"
                                    error={isEmptyEmail}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                />
                                {isEmptyEmail &&
                                <Message isActive={true} severity={'error'}
                                         message={'Debe ingresar un valor en el campo Email'}/>}
                            </Grid>
                            <Grid item xs={8} marginTop={2}>
                                <TextField
                                    id="id_password"
                                    name="password"
                                    label="Contraseña"
                                    size="small"
                                    type={"password"}
                                    value={password}
                                    variant="outlined"
                                    className="form-control"
                                    error={isEmptyPassword}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />
                                {isEmptyPassword &&
                                <Message isActive={true} severity={'error'}
                                         message={'Debe ingresar un valor en el campo Contraseña'}/>}
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
                                                navigate(`/users/`)
                                            }}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} marginTop={2} marginBottom={2}>
                                {existsUser &&
                                <Alert severity="warning">
                                    El usuario <strong>{username}</strong> ya existe
                                </Alert>
                                }
                            </Grid>
                            <Grid item xs={6} marginTop={2} marginBottom={2}>
                                {isError &&
                                <Alert severity="error">
                                    Ha ocurrido un error
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

export default User;