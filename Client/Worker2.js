const { parentPort } = require('worker_threads');
const PROTO_PATH = "../Server/Proto/products.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{});
const Servicio = grpc.loadPackageDefinition(packageDefinition).ProductService;
const product = new Servicio("localhost:3050",grpc.credentials.createInsecure());


parentPort.on('message', (message) => {
  switch (message[0]) {
    case "obtenerProductos":
      product.getProducts({}, (err, results) => {
        if (!err) {
          parentPort.postMessage(results);
            }
            });
      break;
    case "NuevoProducto":
      const id = message[1];
const descripcion = message[2]
    const data_product = {
        id: id,
        descripcion: descripcion 
    }  
    console.log(data_product.id);
    console.log(data_product.descripcion);
    console.log(data_product);
//Crear Producto
    product.createProduct(data_product, function (err, response) {
        if(err){
            console.log('error:' + err);
        }else{
          parentPort.postMessage('se creo el producto worker2');}
        product.getProducts({}, (err, results) => {
            if (!err) {
                console.log(results.Products);
                }
                });
    }) 
      break;
      case "EditarProducto":
const idviejo = message[1];
const Ndescripcion = message[2];
const idnuevo = message[3];


const data_product2 = {
    idnuevo: idnuevo,
    idviejo: idviejo,
    Ndescripcion: Ndescripcion 
}

product.updateProduct(data_product2, function (err,response){
    if (err) {
        console.log('error' + err)
    } else {
        console.log("producto Editado")
        product.getProducts({}, (err, results) => {
            if (!err) {
                console.log(results.Products);
                parentPort.postMessage('se edito el producto worker2');
                }
                });
    }

})
        break;
        case"BorrarProducto":
        const id2 = message[1];
    const idnumero = parseInt(id2);
    console.log(typeof(idnumero));
    const data_product3 = {
        id: idnumero
    }
    product.deleteProduct(data_product3, function (err, response) {
        if(err){ 
            console.log('error:' + err); 
        }else{
          parentPort.postMessage('se Borro el producto worker2');}
    })
    parentPort.postMessage('se Borro el producto worker2');
        break;
  }
});