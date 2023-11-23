
const express = require("express");
const { Worker, isMainThread, parentPort } = require('worker_threads');
const { json } = require("body-parser");
const app = express();
var pidusage = require('pidusage')
app.use(express.urlencoded({extended: false}));
app.use(express.json());


var Criterios = {
    s1:{
      cantidad:0,
      tiempo:0,
      cpu:0,
      calidadCpu:4,
    },
    s2:{
      cantidad:0,
      tiempo:0,
      cpu:0,
      calidadCpu:3,
    },
    s3:{
      cantidad:0,
      tiempo:0,
      cpu:0,
      calidadCpu:2,
    }
}

var wk = [];

app.post("/", (req, res) => {

  url= "";

  var puntajes ={
    s1:0,
    s2:0,
    s3:0
  }

  //evalua criterios sistema 1
  var j = parseInt(Criterios.s1.cantidad);
switch (true) {
            case (j<100):
                puntajes.s1+=4
                break;
            case (j<200):
              puntajes.s1+=3
                break;
            case (j<300):
              puntajes.s1+=2
                break;
            default:
              puntajes.s1+=1
        }  
 
        var i = parseInt(Criterios.s1.cpu);
switch (true) {
            case (i<32000000):
              puntajes.s1+=4
                break;
            case (i<34000000):
              puntajes.s1+=3
                break;
            case (i<36000000):
              puntajes.s1+=2
                break;
            default:
              puntajes.s1+=1 
        }

        var k = parseInt(Criterios.s1.tiempo);
switch (true) {
            case (k<200):
              puntajes.s1+=4
                break;
            case (k<300):
              puntajes.s1+=3
                break;
            case (k<400):
              puntajes.s1+=2
                break;
            default:
              puntajes.s1+=1 
        }
        puntajes.s1+=Criterios.s1.calidadCpu;
        puntajes.s1= puntajes.s1/4;
        console.log("puntaje Servidor 1: " + puntajes.s1)


        //EVALUA CRITERIOS SISTEMA 2
        var j = parseInt(Criterios.s2.cantidad);
switch (true) {
            case (j<100):
                puntajes.s2+=4
                break;
            case (j<200):
              puntajes.s2+=3
                break;
            case (j<300):
              puntajes.s2+=2
                break;
            default:
              puntajes.s2+=1
        }

        var i = parseInt(Criterios.s2.cpu);
switch (true) {
            case (i<30):
              puntajes.s2+=4
                break;
            case (i<50):
              puntajes.s2+=3
                break;
            case (i<70):
              puntajes.s2+=2
                break;
            default:
              puntajes.s2+=1
        }

        var k = parseInt(Criterios.s2.tiempo);
switch (true) {
            case (k<200):
              puntajes.s2+=4
                break;
            case (k<300):
              puntajes.s2+=3
                break;
            case (k<400):
              puntajes.s2+=2
                break;
            default:
              puntajes.s2+=1 
        }
        puntajes.s2+=Criterios.s2.calidadCpu;
        puntajes.s2= puntajes.s2/4;
        console.log("puntaje Servidor 2: "+ puntajes.s2)

        //EVALUA CRITERIOS SISTEMA 3
        var j = parseInt(Criterios.s3.cantidad);
switch (true) {
            case (j<100):
                puntajes.s3+=4
                break;
            case (j<200):
              puntajes.s3+=3
                break;
            case (j<300):
              puntajes.s3+=2
                break;
            default:
              puntajes.s3+=1
        }

        var i = parseInt(Criterios.s3.cpu);
switch (true) {
            case (i<30):
              puntajes.s3+=4
                break;
            case (i<50):
              puntajes.s3+=3
                break;
            case (i<70):
              puntajes.s3+=2
                break;
            default:
              puntajes.s3+=1
        }

        var k = parseInt(Criterios.s3.tiempo);
switch (true) {
            case (k<200):
              puntajes.s3+=4
                break;
            case (k<300):
              puntajes.s3+=3
                break;
            case (k<400):
              puntajes.s3+=2
                break;
            default:
              puntajes.s3+=1 
        }

        puntajes.s3+=Criterios.s3.calidadCpu;
        puntajes.s3= puntajes.s3/4;
        console.log("puntaje Servidor 3: "+ puntajes.s3)

        if (puntajes.s1>=puntajes.s2 && puntajes.s1 >= puntajes.s3) {
          url= "localhost:3000"
        }else{
          if (puntajes.s2>=puntajes.s1 && puntajes.s2 >= puntajes.s3) {
            url= "localhost:3050"
          }else
          if (puntajes.s3>=puntajes.s1 && puntajes.s3 >= puntajes.s2) {
            url = "url3"
          }else{
            console.log("wtf como paso esto")
          }
        }
 
  //const worker1 = new Worker('./worker1.js');
wk[wk.length]  = new Worker('./worker1.js');
wk[wk.length-1].postMessage([req.body.request,req.body.id,req.body.descripccion,req.body.idnuevo,url]);

if (url == "localhost:3000") {
  Criterios.s1.cantidad++
}else{
  if (url == "localhost:3050") {
    Criterios.s2.cantidad++
  }else{
    Criterios.s3.cantidad++
  }
} 
  
  wk[wk.length-1].on('message', (message) => {
   res.send(message)

   if (message.url == "url1") {
    Criterios.s1.cantidad--
    Criterios.s1.tiempo= message.tiempo
    Criterios.s1.cpu = parseInt(message.stats)
  }else{
    if (message.url == "url2") {
      Criterios.s2.cantidad--
      Criterios.s2.tiempo= message.tiempo
      Criterios.s2.cpu = parseInt(message.stats)
    }else{
      Criterios.s3.cantidad--
      Criterios.s3.tiempo= message.tiempo
      Criterios.s3.cpu = parseInt(message.stats)
    }
  }
  });

  console.log(Criterios);
  //   if (proc.p1==0) {
  //     const worker1 = new Worker('./worker1.js');
  //     worker1.postMessage([req.body.request,req.body.id,req.body.descripccion,req.body.idnuevo]);
  //     proc.p1++

  //     worker1.on('message', (message) => {
  //       console.log("reste p1")
  //      res.send(message)
  //      proc.p1--
  //     });
  //   }else{
  //     if (proc.p2==0) {
  //       const worker2 = new Worker('./worker2.js');
  //     worker2.postMessage([req.body.request,req.body.id,req.body.descripccion,req.body.idnuevo]);
  //     proc.p2++

  //     worker2.on('message', (message) => {
  //       res.send(message)
  //       console.log("reste p2")
  //       proc.p2--
  //      });
  //     } 
  //     // else {
  // // const worker3 = new Worker('./worker3.js');
  //     //   proc.p3++
  //     //   paso=true
  //     // worker3.postMessage([req.body.request,req.body.id,req.body.descripccion,req.body.idnuevo]);
  //     // worker3.on('message', (message) => {
  // //   proc.p3--
  // //  res.send(message)
  // // });
  //     // }
  //   } 
   
  
  
  

 

  // console.log(Criterios)
  // pidusage(process.pid, function (err, stats) {
  //   console.log(stats)
  //   // => {
  //   //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
  //   //   memory: 357306368,    // bytes
  //   //   ppid: 312,            // PPID
  //   //   pid: 727,             // PID
  //   //   ctime: 867000,        // ms user + system time
  //   //   elapsed: 6650000,     // ms since the start of the process
  //   //   timestamp: 864000000  // ms since epoch
  //   // }
  // })
  
});

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});