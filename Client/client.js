const PROTO_PATH ="../Server/Proto/products.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { json } = require("body-parser");
const express = require('express');

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{});
const Servicio = grpc.loadPackageDefinition(packageDefinition).ProductService;
const product = new Servicio("localhost:3000",grpc.credentials.createInsecure());

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express(json));

const router = express.Router();

 
//Endpoint Principal Obtener Productos
router.get('/',(req,res)=>{
    //Obtener Productos
product.getProducts({}, (err, results) => {
    if (!err) {
        console.log(results.Products);
        res.render('index', {productos:results.Products});
        }
        });
})

//ruta para crear producto
router.get('/nuevo',(req,res)=>{
    res.render('NuevoProducto');
})

//Ruta para ver producto
router.get('/editar/:id',(req,res)=>{
    const idviejo = req.params.id
    const data={
        id:idviejo,
    }
    product.getProduct(data,(err,results)=>{
        if(!err){
            console.log(results)
            res.render('EditarProducto',{producto:results});
        }
    }) 
     
})
//Guardar Cambios
router.post('/guardarcambios/:idviejo',(req,res)=>{
const idviejo = req.params.idviejo;
const idnuevo = req.body.id;
const Ndescripcion = req.body.descripcion;

const data_product = {
    idnuevo: idnuevo,
    idviejo: idviejo,
    Ndescripcion: Ndescripcion 
}

product.updateProduct(data_product, function (err,response){
    if (err) {
        console.log('error' + err)
    } else {
        console.log("producto Editado")
        product.getProducts({}, (err, results) => {
            if (!err) {
                console.log(results.Products);
                res.render('index', {productos:results.Products});
                }
                });
    }

})

})

//Enpoint Producto Nuevo
router.post('/guardar', (req,res)=>{
const id = req.body.id;
const descripcion = req.body.descripcion
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
        console.log("producto creado");}
        product.getProducts({}, (err, results) => {
            if (!err) {
                console.log(results.Products);
                res.render('index', {productos:results.Products});
                }
                });
    }) 
});

//Endpoint Borrar
router.get('/borrar/:id',(req,res)=>{
    const id = req.params.id;
    const idnumero = parseInt(id);
    console.log(typeof(idnumero));
    const data_product = {
        id: idnumero
    }
    
    product.deleteProduct(data_product, function (err, response) {
        if(err){ 
            console.log('error:' + err); 
        }else{
        console.log("producto Borrado");}

      
        
    })

    product.getProducts({}, (err, results) => {
        if (!err) {
            console.log(results.Products);
            res.render('index', {productos:results.Products});
            }
            });
})





app.use('/', router);
app.listen(5000,()=>{
    console.log('App Running in http://localhost:5000')
})