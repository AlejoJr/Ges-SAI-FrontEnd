import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {downloadFile} from "../../services/Hosts";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    marginTop: 50
}));


function Instructions() {

    const [open, setOpen] = useState(false);
    let navigate = useNavigate();

    useEffect(function () {
        handleClickOpen();
    }, [])

    // <<--| M A N E J A R - E L - C A M B I O - EN - EL - (DIALOG) |-->>
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        navigate('/hosts');
    };

    const handleDowndLoadFile = () => {
        downloadFile('http://localhost:8000/download/id_rsa.pub', 'id_rsa');
    };


    return (
        <>
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
                        <Typography component={'span'} variant="body2" display="block" gutterBottom>
                            Para que la máquina que desea dar de alta sea reconocida por el sistema al
                            momento de su apagado o encendido haga lo siguiente dependiendo del sistema
                            operativo.
                        </Typography>
                        <Typography component={'span'} variant="overline" display="block" gutterBottom>
                            <strong>Linux:</strong>
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" gutterBottom>
                            Descargue el <Link href="" onClick={handleDowndLoadFile}>Archivo</Link> de clave publica y
                            copielo en la siguiente ruta de la máquina
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
                            Descargue el <Link href="" onClick={handleDowndLoadFile}>Archivo</Link> de clave publica y
                            copielo en la siguiente ruta de la máquina
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
                    <Button onClick={handleClose} autoFocus>
                        Cerrar
                    </Button>
                    <Button onClick={handleDowndLoadFile} autoFocus>
                        Descargar Archivo
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}

export default Instructions;