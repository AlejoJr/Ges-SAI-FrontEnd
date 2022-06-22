import React, {useState} from "react";

import PropTypes from "prop-types";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from "@mui/material/Alert";
import TextField from '@mui/material/TextField';

import {LoginUser} from "../services/Users";
import {Loading} from "./utils/LittleComponents";


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://www.upv.es/es/">
                DSIC
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function SignIn(props) {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errorLogin, setErrorLogin] = useState(false);
    const [activeLogin, setActiveLogin] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        setActiveLogin(true);
        const userToken = await LoginUser(username, password);

        if (userToken.hasOwnProperty('No Authenticate')) {
            setErrorLogin(true);
            setActiveLogin(false);
        } else {
            setActiveLogin(false);
            props.setToken(userToken);
            props.setIsTechnical(userToken);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ges-SAI
                </Typography>
                <br/>
                {
                    activeLogin && <Loading ></Loading>
                }
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        onChange={(e) => setUserName(e.currentTarget.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                    {/*<FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Iniciar sesión
                    </Button>
                    {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                </Box>

                {
                    errorLogin &&
                    <Alert severity="error">
                        <strong>Datos incorrectos</strong>
                        <br/>
                        El usuario no se pudo autenticar, compruebe que el usuario y contraseña sean correctos.
                    </Alert>
                }
            </Box>
            <Copyright sx={{mt: 8, mb: 4}}/>
        </Container>
    );
}

SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default SignIn