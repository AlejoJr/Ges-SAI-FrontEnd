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

import {getPools, deletePool} from "../services/Pools";
import {Title} from "../components/utils/Title";


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

function Pools() {

    let navigate = useNavigate();
    const [pools, setPools] = useState([]);

    useEffect(function () {
        getPools_Api();
    }, [])

    //Obtener los Pools de la API
    const getPools_Api = async () => {
        const poolsJson = await getPools();
        setPools(poolsJson.results);
    }

    const poolDelete = (pool) => () => {
        confirmAlert({
            title: 'Borrar Pool',
            message: 'Esta seguro de borrar el Pool: ' + pool.name_pool,
            buttons: [
                {
                    label: 'Si',
                    onClick: () => setTimeout(() => {
                        setPools((prevRows) => prevRows.filter((row) => row.id !== pool.id));
                        deletePool(pool.id)
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
            field: 'name_pool',
            headerName: 'POOLS',
            headerAlign: 'center',
            width: 200,
            editable: false,
        },
        {
            field: 'ip',
            headerName: 'IP',
            headerAlign: 'center',
            width: 200,
            editable: false,
        },
        {
            field: 'url',
            headerName: 'URL',
            headerAlign: 'center',
            type: 'text',
            width: 200,
            editable: false,
        },
        {
            field: 'username',
            headerName: 'USERNAME',
            headerAlign: 'center',
            //description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,
            /*valueGetter: (params) =>
              `${params.row.firstName || ''} ${params.row.lastName || ''}`,*/
        },
        {
            field: 'type',
            headerName: 'TIPO',
            headerAlign: 'center',
            type: 'text',
            width: 200,
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
                        navigate(`/pools/${params.row.id}`)
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color={"primary"}/>}
                    label="Delete"
                    onClick={poolDelete(params.row)}
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
            <Title title={'POOLS'}/>
            <div style={{height: 480, width: '90%', marginTop: 50}}>
                <DataGrid
                    rows={pools}
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
            <Fab color="primary" aria-label="add"
                 onClick={() => {
                     navigate(`/pools/${0}`)
                 }}>
                <AddIcon/>
            </Fab>
        </Grid>
    );

}

export default Pools