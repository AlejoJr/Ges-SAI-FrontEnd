import React, { useState } from "react";
import { ReOrderableItem, ReOrderableList } from "react-reorderable-list";
import { Box } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      border: "1px solid gray",
   },
}));
function ReordenableUniqueList () {
   const classes = useStyles();
   const [listJR, setList] = useState([
      { id: 1, name: "This" },
      { id: 2, name: "list" },
      { id: 2, name: "is restricted" },
      { id: 2, name: "to itself" },
   ]);
   return (
      <Box display="flex" gridGap="10px">
         <ReOrderableList
            //The unique identifier for this list. Should be unique from other lists and list groups.
            name="list2"
            //your list data
            list={listJR}
            //the list update callback
            onListUpdate={(newList) => setList(newList)}
            component={List}
            componentProps={{
               className: classes.root,
            }}>
            {listJR.map((data, index) => (
               <ReOrderableItem key={`item-${index}`} component={ListItem}>
                  <ListItemText primary={data.name} />
               </ReOrderableItem>
            ))}
         </ReOrderableList>
      </Box>
   );
}

export default ReordenableUniqueList