import React from "react";
import PropTypes from "prop-types";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const VirtualMachine = ({vms}) => {
    const ArrayVirtualMachines = vms.map(({name, ref, uuid, power_state}) => (
        {
            value: ref,
            label: name,
            uuid: uuid,
            power_state: power_state
        }))

    console.log(ArrayVirtualMachines)

    const handleChange = (e) => {
        console.log('cambio ',e)

        //this.setState({[name]: value})
    }

    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={ArrayVirtualMachines}
            onChange={handleChange}
            //defaultValue={[vmOptions[0], vmOptions[1]]}
        />
    )
}

VirtualMachine.propTypes = {
    name: PropTypes.string,
    power_state: PropTypes.string,
    uuid: PropTypes.string
}

export default VirtualMachine