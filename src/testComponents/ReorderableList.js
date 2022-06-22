import React, {useState} from "react";
import {
    ReOrderableItem,
    ReOrderableList,
    ReOrderableListGroup,
} from "react-reorderable-list";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@mui/material/Card";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "auto",
        maxWidth: 400,
        maxHeight: "auto",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid gray",
    },
}));

function ReorderableList() {
    const classes = useStyles();
    const [groups, setGroup] = useState([
        {
            id: 1,
            name: "test",
            tasks: [
                {id: 1, name: "Test"},
                {id: 2, name: "Hello"},
                {id: 3, name: "World!"},
                {id: 4, name: "World2"},
                {id: 5, name: "World3"},
                {id: 6, name: "DIOS es grande"},
            ],
        },
        {
            id: 2,
            name: "test2",
            tasks: [
                {id: 1, name: "Item"},
                {id: 2, name: "Name"},
            ],
        },
    ]);
    return (

            <ReOrderableListGroup
                name="uniqueGroupName"
                group={groups}
                onListGroupUpdate={(newList) => setGroup(newList)}>
                {groups.map((list, index) => (
                    <ReOrderableList
                        key={`list-${index}`}
                        path={`${index}.tasks`}
                        component={List}
                        componentProps={{
                            className: classes.root,
                        }}>

                        {list.tasks.map((data, index) => (
                            <ReOrderableItem
                                key={`item-${index}`}
                                component={ListItem}>
                                <ListItemText primary={data.name}/>
                            </ReOrderableItem>

                        ))}
                    </ReOrderableList>
                ))}
            </ReOrderableListGroup>

    );
}

export default ReorderableList
