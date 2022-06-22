import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = process.env.REACT_APP_API_URL


/***
 * Obtener todos los Sais
 * @returns {Promise<Sais>}
 */
async function getSais() {
    var endpoint = `${baseUrl}/sais/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}


/***
 * Obtener el Sai por Id
 * @param idSai
 * @returns {Promise<Sai>}
 */
async function getSai(idSai) {
    var endpoint = `${baseUrl}/sais/${idSai}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Crear un nuevo Sai
 * @param sai
 * @returns {Promise<Sai>}
 */
async function createSai(sai) {
    var endpoint = `${baseUrl}/sais/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(sai)
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
        .catch(error => console.log('Error creando el Sai -> ', error));


    return responseJson
}

/***
 * Actualizar el Sai por Id
 * @param sai
 * @returns {Promise<Sai>}
 */
async function updateSai(sai) {
    var endpoint = `${baseUrl}/sais/${sai.id}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(sai)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el Sai -> ', error));


    return responseJson
}

/***
 * Eliminar el Sai por Id
 * @param idSai
 * @returns {Promise<Sai>}
 */
async function deleteSai(idSai) {
    var endpoint = `${baseUrl}/sais/${idSai}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

/***
 * Probar la conexión con el Sai
 * @param sai
 * @returns {Promise<connectionSai>}
 */
async function tryConnectionSai(sai) {
    var endpoint = `${baseUrl}/connection-sai/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(sai)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                if (response.status === 203) {
                    return {'Connection': 'NOT-FOUND', 'Code': "Machine Not Found"}
                } else if (response.status === 204) {
                    return {'Connection': 'ERROR', 'Code': "Connection refused"}
                } else {
                    return response.json();
                }
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error probando conexión al SAI: ', error));

    return responseJson
}

/***
 * Obtener la bateria de los SAIS
 * @param sai
 * @returns {Promise<Sais>}
 */
async function getBatterySai(sai) {
    var endpoint = `${baseUrl}/battery-sai/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(sai)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                if (response.status === 203) {
                    return {'Connection': 'NOT-FOUND', 'Code': "Machine Not Found"}
                } else if (response.status === 204) {
                    return {'Connection': 'ERROR', 'Code': "Connection refused"}
                } else {
                    return response.json();
                }
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error probando conexión al SAI: ', error));

    return responseJson
}


export {getSais, getSai, createSai, updateSai, deleteSai, tryConnectionSai, getBatterySai}