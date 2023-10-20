const {Client} = require('pg');
//Datos para la coneccion de la base de datos
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:"5432",
    password:'nuevop15',
    database:'postgres'
})
//exporta los datos para usarlo en el server
module.exports = client;