import React, {useState, useEffect, useRef} from "react";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';


function SearchHost() {

    const [existMachine, setExistMachine] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const [name_host, setNameHost] = useState('');

    const [name, setName] = useState('test.dsic.upv');
    const [ip, setIp] = useState('10.10.10.10');
    const [mac, setMac] = useState('10:2m:as:23:cl2:33');
    const [so, setSo] = useState('Windows');


    //Buscar la maquina en BD
    const searchByName = (nameHost) => () => {
        setIsSearch(true)
        var ma = true;
        //Enconro la maquina
        if(ma){
            setExistMachine(true)
            setIsSearch(false)
        }else{
            setExistMachine(false)
            setIsSearch(true)
        }

    }

    //Manejar el cambio en el Textfield
    const handleChange = (e) => {
        setNameHost(e.currentTarget.value)
        setIsSearch(false)
    }

    return (
        <>
            <Grid container
                  spacing={1}
                  marginTop={1}
                  marginBottom={1}>
                <Grid item xs={6}>
                    <TextField
                        id="id_nameHost"
                        name="nameHost"
                        label="Nombre de Maquina"
                        size="small"
                        value={name_host}
                        variant="outlined"
                        className="form-control"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" size="medium" startIcon={<SearchIcon/>}
                            onClick={searchByName({name_host})}>
                        Buscar
                    </Button>
                </Grid>
            </Grid>
            <Divider/>
            {existMachine &&
            <Grid marginTop={2} marginBottom={1}>
                <Card sx={{minWidth: 275}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Nombre de Maquina
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {name}
                            </Typography>
                            Ip
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {ip}
                            </Typography>
                            Mac
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {mac}
                            </Typography>
                            S.O
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {so}
                            </Typography>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Alta Maquina</Button>
                    </CardActions>
                </Card>
            </Grid>
            }
            {!existMachine && isSearch &&
            <Alert severity="warning">
                <strong>Sin resultados - </strong>
                La siguiente maquina no se ha encontrado en el sistema
                <br/>
                <strong>{name_host}</strong>
            </Alert>
            }
        </>
    );
}

export default SearchHost