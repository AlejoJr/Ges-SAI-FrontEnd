import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = process.env.REACT_APP_API_URL

/***
 * Obtener todos los Grupos
 * @returns {Promise<Grupos>}
 */
async function getGroups() {
    var endpoint = `${baseUrl}/groups/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Obtener el Grupo por Id
 * @param idGroup
 * @returns {Promise<Group>}
 */
async function getGroup(idGroup) {
    var endpoint = `${baseUrl}/groups/${idGroup}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Eliminar el Grupo por Id
 * @param idGroup
 * @returns {Promise<Group>}
 */
async function deleteGroup(idGroup) {
    var endpoint = `${baseUrl}/groups/${idGroup}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

/***
 * Actualizar el Grupo por Id
 * @param group
 * @returns {Promise<Group>}
 */
async function updateGroup(group) {
    var endpoint = `${baseUrl}/groups/${group.id}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(group)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el Grupo -> ', error));


    return responseJson
}

/***
 * Crear un nuevo Grupo
 * @param group
 * @returns {Promise<Host>}
 */
async function createGroup(group) {
    var endpoint = `${baseUrl}/groups/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(group)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error creando el Grupo -> ', error));


    return responseJson
}

export {getGroups, createGroup, getGroup, updateGroup, deleteGroup}