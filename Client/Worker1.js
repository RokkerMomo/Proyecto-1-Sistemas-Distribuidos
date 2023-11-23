const { parentPort } = require('worker_threads');
const PROTO_PATH = "../Server/Proto/products.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var startTime, endTime;


parentPort.on('message', (message) => {
  startTime = new Date();
  var packageDefinition = protoLoader.loadSync(PROTO_PATH,{});
const Servicio = grpc.loadPackageDefinition(packageDefinition).ProductService;
const product = new Servicio(message[4],grpc.credentials.createInsecure());
  switch (message[0]) {
    case "obtenerProductos":
      product.getProducts({}, (err, results) => {
        if (!err) {
          endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms

  // get seconds 
  var seconds = Math.round(timeDiff);
  results.tiempo= seconds
  if (message[4] == "localhost:3000") {
    var url = "url1"
  }else{
    if (message[4] == "localhost:3050") {
      var url = "url2"
    }else{
      var url = "url3"
    }
  }
  results.url= url;
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
//Crear Producto
    product.createProduct(data_product, function (err, response) {
        if(err){
            console.log('error:' + err);
        }else{
          parentPort.postMessage('se creo el producto worker1');}
        product.getProducts({}, (err, results) => {
            if (!err) {
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
        product.getProducts({}, (err, results) => {
            if (!err) {
                parentPort.postMessage('se edito el producto worker1');
                }
                });
    }

})
        break;
        case"BorrarProducto":
        const id2 = message[1];
    const idnumero = parseInt(id2);
    const data_product3 = {
        id: idnumero
    }
    product.deleteProduct(data_product3, function (err, response) {
        if(err){ 
        }else{
          parentPort.postMessage('se Borro el producto worker1');}
    })
    parentPort.postMessage('se Borro el producto worker1');
        break;
  }
});