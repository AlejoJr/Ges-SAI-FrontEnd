import * as React from 'react';
import {styled} from '@mui/material/styles';

const Div = styled('div')(({theme}) => ({
    ...theme.typography.subtitle1,
    //backgroundColor: 'blue',
    padding: theme.spacing(1),
    fontSize: 25,
    color: '#009688',
    fontFamily: 'copperplate',
    borderBlockStyle: 'ridge'
}));

const SubDiv = styled('div')(({theme}) => ({
    ...theme.typography.subtitle2,
    //backgroundColor: 'blue',
    padding: theme.spacing(1),
    fontSize: 25,
    color: '#3d474f',
    fontFamily: 'copperplate',
    marginTop: 20
}));

function Title({title}) {
    return <Div>{title}</Div>;
}

function SubTitle({title}) {
    return <SubDiv>{title}</SubDiv>;
}

export {Title, SubTitle}