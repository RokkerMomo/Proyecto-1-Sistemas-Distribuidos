//Librerias
const client = require('./db.js');
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

//Direccion del archivo proto
const PROTO_PATH ="./Proto/products.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

//agregar los servicios al servidor
server.addService(grpcObject.ProductService.service,{
    getProducts:getProducts,
    createProduct:createProduct,
    deleteProduct:deleteProduct,
    updateProduct:updateProduct,
    getProduct:getProduct,


});
//inicia el servidor
server.bindAsync("127.0.0.1:3000", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("GRPServer running at http://127.0.0.1:3000");
    server.start();
  }
);
//se conecta a la base de datos
client.connect();


//Funcion Obtener productos
async function getProducts (_,callback)  {
    try {
        // hace una peticion a la base de datos y guarda los resultados en una variable row
        const {rows} = await client.query(`SELECT * FROM public."Productos"`);
        if (rows.length !== 0) {
            console.log(rows); 
            //se la pasa al callback
            callback(null, {Products: rows });       
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            })
        }
} catch (error) {
    console.log(error);
    callback(error)
}
}



//Funcion Crear Productos
function createProduct (call, callback) {
    console.log(call.request);
    const {id, descripcion} = call.request;
    console.log(id);
    console.log(typeof(descripcion));
try{
    client.query(`INSERT INTO public."Productos"(id, descripcion) VALUES ($1, $2);`, [id, descripcion], (error, results) => {
          if (error) {
            console.log('error: '+ error);
            // return reject(error);
            callback(null,{message:`Producto no insertado ${error}`})
        }else{
            console.log("RESULTS", results);
            callback(null,{message:'Producto insertado'})}
        }
      );
    } catch (error) {
      console.log("error: ", error);
    }
} 


//Funcion Borrar Producto
async function deleteProduct (call, callback) {
    const id = call.request.id;

    try {
        client.query(`DELETE FROM public."Productos"WHERE id= $1;`, [id]);
        console.log(`producto borrado con exito`)

    }catch(error){
        console.log(error);
    }
}

//Funcion Editar producto
function updateProduct(call,callback){
    const idnuevo = call.request.idnuevo;
    const idviejo = call.request.idviejo;
    const Ndescripcion = call.request.Ndescripcion;

    try{
        client.query(`UPDATE public."Productos" SET id = $1 , descripcion= $2 WHERE id= $3;`,[idnuevo,Ndescripcion,idviejo], (error, results) => {
              if (error) {
                console.log('error: '+ error);
                // return reject(error);
                callback(null,{message:`Producto no insertado ${error}`})
            }else{
                console.log("RESULTS", results);
                callback(null,{message:'Producto Editado'})}
            }
          );
        } catch (error) {
          console.log("error: ", error);
        }

}

//Funcion Obtener un solo producto
async function getProduct(call,callback){
    const id = call.request.id;
    console.log(id);
    try{
        const producto = await client.query(`SELECT id, descripcion FROM public."Productos" WHERE id = $1;`,[id], (error, results) => {
              if (error) {
                console.log('error: '+ error);
                // return reject(error);
                callback(null,{message:`Producto no encontrado ${error}`})
            }else{
                console.log("RESULTS", results);
                callback(null,results.rows[0])}
            }
          );
        }catch (error) {
            console.log("error: ", error);
          }
}
 

//