import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

function SelectableList(vms) {
    const [checked, setChecked] = React.useState([]);
    console.log('ok',vms)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
            {[0,1,2,3,4,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (

                    <ListItem
                        key={value}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(value)}
                                inputProps={{'aria-labelledby': labelId}}
                                checked={checked.indexOf(value) !== -1}
                            />
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <LaptopMacIcon fontSize="large" color="primary"/>
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={`Line item ${value + 1}`}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default SelectableList
