import React from "react";
import {Link} from "react-router-dom"

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TransferList from "./TransferList";
import {Title} from "../../components/utils/Title";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: 50
}));

class ContainerVms extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            vms: [],
        }
    }

    render() {
        return (
            <>
                <Grid container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justify="center"
                      marginTop={5}
                      style={{minHeight: '100vh'}}>
                    <Title title={'VIRTUAL MACHINES'}/>
                    <Item><TransferList/></Item>
                    <Link to={"/"}>Home</Link>
                </Grid>
            </>
        )
    }
}

export default ContainerVms