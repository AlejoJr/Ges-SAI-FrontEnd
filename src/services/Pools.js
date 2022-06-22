import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = process.env.REACT_APP_API_URL

/***
 * Obtener todos los Pools
 * @returns {Promise<Pools>}
 */
async function getPools() {
    var endpoint = `${baseUrl}/pools/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}


/***
 * Obtener el Pool por Id
 * @param idPool
 * @returns {Promise<Pool>}
 */
async function getPool(idPool) {
    var endpoint = `${baseUrl}/pools/${idPool}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Eliminar el Pool por Id
 * @param idPool
 * @returns {Promise<Pool>}
 */
async function deletePool(idPool) {
    var endpoint = `${baseUrl}/pools/${idPool}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

/***
 * Actualizar el Pool por Id
 * @param pool
 * @returns {Promise<Pool>}
 */
async function updatePool(pool) {
    var endpoint = `${baseUrl}/pools/${pool.id}/`;

    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(pool)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el Pool -> ', error));


    return responseJson
}

/***
 * Crear un nuevo Pool
 * @param pool
 * @returns {Promise<Pool>}
 */
async function createPool(pool) {
    var endpoint = `${baseUrl}/pools/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(pool)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                if (response.status === 226) {
                    return "Im Used"
                } else if (response.status === 204) {
                    return "Connection refused"
                } else {
                    return response.json();
                }
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error creando el Pool -> ', error));


    return responseJson
}

/***
 * Sincronizar el pool
 * @param pool
 * @returns {Promise<syncronizePool>}
 */
async function syncronizePool(pool) {
    var endpoint = `${baseUrl}/sync-pool/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(pool)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                if (response.status === 204) {
                    return "Connection refused"
                } else {
                    return response.json();
                }
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error sincronizando  Pool: ', error));

    return responseJson
}


export {getPools, createPool, getPool, updatePool, deletePool, syncronizePool }