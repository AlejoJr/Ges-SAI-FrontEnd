import React, {useState, useEffect} from "react";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import {ReOrderableItem, ReOrderableList} from "react-reorderable-list";
import {Loading, Message} from "../../components/utils/LittleComponents";

import {getVirtualMachines} from "../../services/VirtualMachines";


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

function TransferList(props) {

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [isFetch, setIsFetch] = useState(true)
    const [isActiveMessage, setIsActiveMessage] = useState(false)


    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(function () {
        getVms();
    }, [])

    //Obtener las maquinas virtuales de la API
    const getVms = async () => {
        const vmsJson = await getVirtualMachines();
        setLeft(vmsJson.results);
        setIsFetch(false);
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            setIsActiveMessage(false);//--> Desactiva el mensaje de (ordenar los items)
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        setIsActiveMessage(true);//--> Activa el mensaje de (ordenar los items)
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };


    //Customizar la lista Izquierda
    const customListLeft = (title, items) => (
        <Card>
            <CardHeader
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} Virtual Machine`}
            />
            <Divider/>
            <List
                sx={{
                    width: 400,
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.name_host}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name_host}`}/>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    //Customizar la lista Derecha
    const customListRight = (title, items) => (
        <Card>
            <CardHeader
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} Virtual Machine`}
            />
            <Divider/>
            <List
                sx={{
                    width: 400,
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                <ReOrderableList
                    name="listRight"
                    //lista right
                    list={right}
                    onListUpdate={(newList) => setRight(newList)}
                    component={List}>
                    {right.map((value) => {
                        const labelId = `transfer-list-all-item-${value.name_host}-label`;

                        return (
                            <ReOrderableItem
                                key={`item-${value.id}`}
                            >
                                <ListItem
                                    key={value.id}
                                    role="listitem"
                                    button
                                    onClick={handleToggle(value)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />

                                        <ListItemText id={labelId} primary={`${value.name_host}`}/>

                                    </ListItemIcon>
                                </ListItem>
                            </ReOrderableItem>

                        );
                    })}
                </ReOrderableList>
            </List>
        </Card>
    );

    return (
        <>
                {
                    isFetch && <Loading></Loading>
                }

                <Grid container spacing={5} justifyContent="center" alignItems="center">
                    <Grid item>{customListLeft('Seleccionar', left)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{my: 5}}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{my: 5}}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customListRight('Seleccionadas', right)}</Grid>

                </Grid>

                {
                    isActiveMessage && <Message isActive={isActiveMessage}
                                                severity={'info'}
                                                message={'Ordene arrastrando las maquinas seleccionadas a la posición deseada, para su posterior apagado !'}/>
                }

        </>
    );
}

export default TransferList