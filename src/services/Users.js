import {GetToken} from "../components/utils/LittleComponents";

const baseUrl = process.env.REACT_APP_API_URL

/***
 * Login de un usuario en la aplicacion
 * @param username
 * @param password
 * @returns {Promise<Token>}
 */
async function LoginUser(username, password) {
    var endpoint = `${baseUrl}/login`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    };

    const response = await fetch(endpoint, requestOptions)
    const responseJson = await response.json()

    return responseJson
}



/***
 * Obtener todos los Users
 * @returns {Promise<Users>}
 */
async function getUsers() {
    var endpoint = `${baseUrl}/users/`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
    //.then(response => response.json())
    //.then(virtualmachines => this.setState({vms: virtualmachines.results, isFetch: false}))
}


/***
 * Obtener el User por Id
 * @param idUser
 * @returns {Promise<Host>}
 */
async function getUser(idUser) {
    var endpoint = `${baseUrl}/users/${idUser}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {headers})
    const responseJson = await response.json()

    return responseJson
}

/***
 * Crear un nuevo User
 * @param user
 * @returns {Promise<User>}
 */
async function createUser(user) {
    var endpoint = `${baseUrl}/users/`;

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(user)
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
        .catch(error => console.log('Error creando el Usuario -> ', error));


    return responseJson
}

/***
 * Actualizar el User por Id
 * @param user
 * @returns {Promise<User>}
 */
async function updateUser(user) {
    var endpoint = `${baseUrl}/users/${user.id}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),},
        body: JSON.stringify(user)
    };

    const responseJson = fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Error actualizando el User -> ', error));


    return responseJson
}


/***
 * Eliminar el User por Id
 * @param idUser
 * @returns {Promise<User>}
 */
async function deleteUser(idUser) {
    var endpoint = `${baseUrl}/users/${idUser}`;
    const headers = {'Content-Type': 'application/json', 'Authorization': 'Token ' + GetToken(),}
    const response = await fetch(endpoint, {method: 'delete', headers})
    const responseJson = await response.json()
    return responseJson
}

export {LoginUser, getUsers, getUser, createUser, updateUser, deleteUser}