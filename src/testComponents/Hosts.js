import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {DataGrid, useGridApiContext, useGridState, GridActionsCellItem} from '@mui/x-data-grid';
import Grid from "@mui/material/Grid";

import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {getHosts, deleteHost} from "../services/Hosts";
import Title from "./Title";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";


function CustomPagination() {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);

    return (
        <Pagination
            variant="outlined"
            color="primary"
            count={state.pagination.pageCount}
            page={state.pagination.page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

/*const handleCellClick = (param, event) => {
  event.stopPropagation();
};

const handleRowClick = (param, event) => {
  event.stopPropagation();
};*/

function Hosts() {

    let navigate = useNavigate();
    const [hosts, setHosts] = useState([]);

    useEffect(function () {
        getHosts_Api();
    }, [])

    //Obtener los ContainerHosts de la API
    const getHosts_Api = async () => {
        const hostsJson = await getHosts();
        setHosts(hostsJson.results);
    }

    const hostDelete = (host) => () => {
        confirmAlert({
            title: 'Borrar Host',
            message: 'Esta seguro de borrar el Host: ' + host.name_pool,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        setHosts((prevRows) => prevRows.filter((row) => row.id !== host.id));
                        deleteHost(host.id)
                    })
                },
                {
                    label: 'No',
                    //onClick: () => alert('Click No')
                }
            ]
        });
    }

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'center',
            width: 30
        },
        {
            field: 'name_host',
            headerName: 'HOST',
            headerAlign: 'center',
            width: 100,
            editable: false,
        },
        {
            field: 'ip',
            headerName: 'IP',
            headerAlign: 'center',
            width: 100,
            editable: false,
        },
        {
            field: 'mac',
            headerName: 'MAC',
            headerAlign: 'center',
            type: 'text',
            width: 100,
            editable: false,
        },
        {
            field: 'mail_user',
            headerName: 'MAIL',
            headerAlign: 'center',
            //description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 100,
            /*valueGetter: (params) =>
              `${params.row.firstName || ''} ${params.row.lastName || ''}`,*/
        },
        {
            field: 'power_state',
            headerName: 'ESTADO',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'type',
            headerName: 'TIPO',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'so',
            headerName: 'SO',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'order',
            headerName: 'ORDEN',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'ref',
            headerName: 'REF',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'description',
            headerName: 'DESC',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'pool',
            headerName: 'POOL',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'user',
            headerName: 'USUARIO',
            headerAlign: 'center',
            type: 'text',
            width: 100,
        },
        {
            field: 'actions',
            type: 'actions',
            headerAlign: 'center',
            sortable: false,
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color={"primary"}/>}
                    label="Toggle Admin"
                    onClick={() => {
                        navigate(`/hosts/${params.row.id}`)
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color={"primary"}/>}
                    label="Delete"
                    onClick={hostDelete(params.row)}
                />,
            ],
            /* renderCell: (cellValues) => {
                 return (
                     <Link to={`${cellValues.row.id}`}>
                         <IconButton
                             color="primary"
                             onClick={(event) => {
                                 handleClick(event, cellValues);
                             }}>
                             <EditIcon/>
                         </IconButton>
                     </Link>
                 );
             }*/
        },
        {
            field: "TestRoute",
            hide: true,
            renderCell: (cellValues) => {
                return <Link to={"send"}>Link de demostracion</Link>;
            }
        }

    ];

    return (
        <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              marginTop={5}
              style={{minHeight: '100vh'}}>
            <Title title={'HOSTS'}/>
            <div style={{height: 480, width: '90%', marginTop: 50}}>
                <DataGrid
                    rows={hosts}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableColumnFilter
                    density={"comfortable"}
                    disableColumnMenu={true}
                    disableSelectionOnClick={true}
                    components={{
                        Pagination: CustomPagination,
                    }}
                    sx={{
                        boxShadow: 2,
                        border: 2,
                        borderColor: 'primary.light',
                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                    }}
                    //initialState={{pinnedColumns: {left: ['name_pool'], right: ['actions']}}}
                    //checkboxSelection
                    //disableSelectionOnClick
                    //onCellClick={handleCellClick}
                    //onRowClick={handleRowClick}
                />
            </div>
            <div style={{marginTop: 50, marginBottom: 50}}>
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button onClick={() => {
                        navigate(`/host/${0}`)
                    }}>Alta Maquina</Button>
                    <Button>Nuevo Grupo</Button>
                    <Button>Borrar Grupo</Button>
                </ButtonGroup>
            </div>
            <Fab color="primary" aria-label="add"
                 onClick={() => {
                     navigate(`/host/${0}`)
                 }}>
                <AddIcon/>
            </Fab>
        </Grid>
    );

}

export default Hosts