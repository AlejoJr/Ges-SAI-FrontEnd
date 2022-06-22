import {GetToken} from "../components/utils/LittleComponents";
import fileDownload from 'js-file-download'
import axios from "axios";


const baseUrl = process.env.REACT_APP_API_URL


/***
 * Obtener todos los Hosts
 * @returns {Promise<Hosts>}
 */
async function getHosts() {
    var endpoint = `${baseUrl}/hosts/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}


/***
 * Obtener el Host por Id
 * @param idHost
 * @returns {Promise<Host>}
 */
async function getHost(idHost) {
    var endpoint = `${baseUrl}/hosts/${idHost}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    //const headers = {'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa('alejojr:d1n4m1kjr'),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Eliminar el Host por Id
 * @param idHost
 * @returns {Promise<Host>}
 */
async function deleteHost(idHost) {
    var endpoint = `${baseUrl}/hosts/${idHost}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

/***
 * Actualizar el Host por Id
 * @param host
 * @returns {Promise<Host>}
 */
async function updateHost(host) {
    var endpoint = `${baseUrl}/hosts/${host.id}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(host)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el Host -> ', error));


    return responseJson
}

/***
 * Crear un nuevo Host
 * @param host
 * @returns {Promise<Host>}
 */
async function createHost(host) {
    var endpoint = `${baseUrl}/hosts/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(host)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                if (response.status === 226) {
                    return "Im Used"
                } else {
                    return response.json();
                }
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error creando el Host -> ', error));


    return responseJson
}

/***
 * Obtener el Host por nombre (BD Externa - Nombre de máquina DNS)
 * @returns {Promise<Hosts>}
 */
async function existHostByName_bdExternal(nameMachine) {
    var endpoint = `${baseUrl}/host/exists-machine/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'name': nameMachine})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo el Host por nombre -> ', error));

    return responseJson
}

/***
 * Obtener los Hosts de un grupo
 * @returns {Promise<Hosts>}
 */
async function hostsByGroup(idGroup) {
    var endpoint = `${baseUrl}/group/hosts/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'idGroup': idGroup})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los hosts del grupo por id -> ', error));

    return responseJson
}

/***
 * Obtener el Hosts Master por Id de usuario
 * @param idUser
 * @returns {Promise<HostsMaster>}
 */
async function getHostsMaster(idUser) {
    var endpoint = `${baseUrl}/hosts-master/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'idUser': idUser})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los Hosts Master asociados al usuario -> ', error));

    return responseJson
}


/***
 * Obtener todos los Hosts Padres por Id de usuario en session
 * @param idUser
 * @returns {Promise<HostsFathers>}
 */
async function getAllFathers(idUser) {
    var endpoint = `${baseUrl}/all-host-fathers/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'idUser': idUser})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los Hosts Padres asociados al usuario -> ', error));

    return responseJson
}

/***
 * Obtener todos los Hosts que estan en un grupo
 * @returns {Promise<Host>}
 */
async function getAllHostsInAGroup() {
    var endpoint = `${baseUrl}/machinesInGroup/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    //const headers = {'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa('alejojr:d1n4m1kjr'),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Obtener el Host por nombre (BD Local)
 * @returns {Promise<Hosts>}
 */
async function existHostByName_bdLocal(nameHost) {
    var endpoint = `${baseUrl}/existsMachineByNameHost/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({'nameHost': nameHost})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo el Host por nombre -> ', error));

    return responseJson
}

/***
 * Crear la dependencia de maquinas
 * @returns {Promise<Hosts>}
 */
async function createDependence(hostFather, hostChild) {
    var endpoint = `${baseUrl}/createDependence/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({hostFather, hostChild})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error creando la dependencia -> ', error));

    return responseJson
}

/***
 * Obtener Los Hijos de un Padre (dependencias)
 * @param hostFather
 * @returns {Promise<HostChilds>}
 */
async function getChildrenFromFather(hostFather) {
    var endpoint = `${baseUrl}/hosts-children/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({hostFather})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los Hosts Hijos del Padre -> ', error));

    return responseJson
}

/***
 * Obtener Los Padres de un Host (dependencias)
 * @param hostChild
 * @returns {Promise<HostFathers>}
 */
async function getParentsFromParent(hostChild) {
    var endpoint = `${baseUrl}/hosts-fathers/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({hostChild})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo los Hosts Padres del Hijo -> ', error));

    return responseJson
}

/***
 * Elimina las dependencias existentes entre maquina host(padre) y host(hijo).
 * @returns {Promise<Hosts>}
 */
async function deleteDependence(hostFather, hostChild) {
    var endpoint = `${baseUrl}/deleteDependence/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({hostFather, hostChild})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error eliminando la dependencia -> ', error));

    return responseJson
}


/***
 * Obtener El arbol de dependencias de un padre
 * @param hostFather
 * @returns {Promise<HostChilds>}
 */
async function getTreeDependence(hostFather) {
    var endpoint = `${baseUrl}/treeDependences/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify({hostFather})
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error obteniendo el arbol de dependencias del Padre -> ', error));

    return responseJson
}

/***
 * Descargar archivo public key
 * @returns {Promise<FilePublicKey>}
 */
async function downloadFile(url, filename) {

    axios.get(url, {
        responseType: 'blob',
    })
        .then((res) => {
            fileDownload(res.data, filename)
        })

}

export {
    getHosts,
    createHost,
    getHost,
    updateHost,
    deleteHost,
    existHostByName_bdExternal,
    existHostByName_bdLocal,
    hostsByGroup,
    getHostsMaster,
    getAllFathers,
    getAllHostsInAGroup,
    createDependence,
    getChildrenFromFather,
    getParentsFromParent,
    deleteDependence,
    getTreeDependence,
    downloadFile
}