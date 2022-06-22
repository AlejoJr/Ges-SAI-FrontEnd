import React, {useState, useRef} from "react";
import {arrayMoveImmutable} from "array-move";
import {SortableContainer, SortableElement} from "react-sortable-hoc";

const SortableItem = SortableElement(({value}) => {
    return (
        <li>{value}</li>
    );
});

const SortableList = SortableContainer(({items}) => {

    //console.log(items.items)
    return (
        <ul>
            {items.items.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value}/>
            ))}
        </ul>
    );

});

function SortList(props) {
    let textInput = useRef(null);
    const [list, setList] = useState({
        items: props.listVm,
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        //console.log(list.items)
        setList(({items}) => ({
            items: arrayMoveImmutable(items, oldIndex, newIndex),
        }));
    };
    console.log('lista enviada', list)

    return (
        <div>
            <SortableList items={list} onSortEnd={onSortEnd} ref={textInput}/>
        </div>
    );
}


export default SortList