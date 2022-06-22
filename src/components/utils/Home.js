import React from "react";
import {Link, useNavigate} from "react-router-dom";

import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";


const Home = () => {
    let navigate = useNavigate();

    navigate('/hosts');

    return (
        <>
            <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  marginTop={5}>
                <Grid marginTop={10}>
                    <Typography variant="h2" component="div" gutterBottom>
                        GES-SAI
                    </Typography>
                </Grid>
                <Grid marginTop={2}>
                    <Typography variant="body1" gutterBottom>
                        Software de administración del departamento DSIC para Sistemas de Alimentación Ininterrumpida
                        (SAI)
                    </Typography>
                </Grid>
                <br/>
                <Grid>
                    <Link to={"hosts"}>Máquinas</Link>
                </Grid>
            </Grid>
        </>
    );
}

export default Home