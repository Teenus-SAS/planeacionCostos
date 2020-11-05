/* 
* @Author: Alexis Holguin
* @github: MoraHol
* logica para trabajar con excel
* importacion de datos 
* exportacion de datos
*/

var productsJSONInprocess
var machinesJSON
var processesJSON

function loadProductsInProcess() {
  loadingSpinner()
  // cargado de productos de base de datos
  $.get('api/get_products.php?process', (data, status, xhr) => {
    completeSpinner()
    productsJSONInprocess = data
  })
}
loadProductsInProcess()

/* // cargado de maquinas de base de datos
$.get('/app/config-general/api/get_machines.php', (data, status, xhr) => {
  machinesJSON = data
})
// cargado de procesos de base de datos
$.get('/app/config-general/api/get_processes.php', (data, status, xhr) => {
  processesJSON = data
}) */


/**
 * Genera un archivo excel con todos los datos de productos
 * Con procesos Asignados y sus repectivas maquinas
 */

function generateFileProductProcesses() {
  if (productsJSONInprocess != undefined) {
    loadingSpinner()
    // creacion del libro de excel
    var wb = XLSX.utils.book_new()
    // configuración de del libro
    wb.Props = {
      Title: "Productos X Procesos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date()
    }
    // agregado de los nombres de las hojas del libro
    wb.SheetNames.push('Productos x Procesos')
    // creacion de variables para cargar la información de los productos
    let ws_data = []
    // cargado de de productos con referencias
    productsJSONInprocess.forEach((product) => {
      if (product.processes != undefined) {
        product.processes.forEach(process => {
          ws_data.push({
            Referencia: product.ref,
            Producto: product.name,
            Proceso: process.process.name,
            Maquina: process.machine == null ? "" : process.machine.name,
            "Unidades/Hora": 60 / process.timeProcess
          })
        })
      }
    })
    // parseo de objetos a las hojas de excel
    if (ws_data.length <= 0) {
      /* saveAs('/formatos/Procesos_de_Productos.xlsx', 'Procesos_de_Productos.xlsx') */
      productsJSONInprocess.forEach((product) => {
        ws_data.push({
          Referencia: product.ref,
          Producto: product.name,
          Proceso: '',
          Maquina: '',
          "Unidades/Hora": ''
        })
      })
    }
    var ws = XLSX.utils.json_to_sheet(ws_data)
    // asignacion de hojas de excel
    wb.Sheets["Productos x Procesos"] = ws

    var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

    var wbout = XLSX.write(wb, wopts)
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Procesos de Productos.xlsx')

    completeSpinner()
  } else {
    loadingSpinner()
    setTimeout(generateFileProductProcesses, 2000)
  }

}

// evento al hacer click en el boton para descargar el archivo
$("#download-products-processes").click(function () {
  generateFileProductProcesses()
})



/**
 * Se genera la carga de archivo excel
 * Con esto se validara la informacion 
 * Si esta es valida?
 * SI: Se enviara al servidor para ser almacenada
 * NO: Generara notificaciones 
 *        - El tipo de Error  
 *        - Y la fila en donde ocurrio
 */


// variables para cargar los errores en el archivo excel
var errors

$('#fileProductsProcesses').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  let inputFile = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {

    loadedFilePP(reader, inputFile)

  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})


function loadedFilePP(reader, inputFile) {
  if (productsJSONInprocess != undefined) {
    loadingSpinner()
    // parseo de informacion de excel 
    let data = new Uint8Array(reader.result)
    let workbook = XLSX.read(data, { type: 'array' })

    // cargado de datos en JSON
    let ProductsProcesses = XLSX.utils.sheet_to_json(workbook.Sheets['Productos x Procesos'])

    // cambio de variable Unidades/Hora a unidades
    ProductsProcesses.forEach((productsProcess) => {
      productsProcess.unidad = productsProcess['Unidades/Hora']
    })

    // cargado de errores del formato
    let errorsProductsProcesses = verifyErrorsProductsProcesses(ProductsProcesses)


    // validacion de la informacion
    if (errorsProductsProcesses.length == 0 && workbook.Sheets['Productos x Procesos'] != undefined) {
      $.confirm({
        title: 'Tezlik',
        type: 'green',
        content: 'Los datos han sido procesados y estan listo para ser cargados',
        buttons: {
          Cargar: function () {
            uploadProductsProcess(ProductsProcesses)
            clearFile(inputFile)
          },
          Cancelar: function () {
            $.alert('Cancelado');
            clearFile(inputFile)
          }
        }
      });
    } else {
      $.dialog({
        title: 'Peligro',
        type: 'red',
        icon: 'fas fa-warning',
        content: 'Este Archivo no cumple los formatos indicados <br>' + bugsToString(errorsProductsProcesses)
      })
      clearFile(inputFile)
    }
    completeSpinner()
  } else {
    loadingSpinner()
    setTimeout(loadedFilePP(reader, inputFile), 2000)
  }

}
/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene los materiales generados en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
function verifyErrorsProductsProcesses(jsonObj) {
  let errors = []
  for (let index = 0; index < jsonObj.length; index++) {
    let productsProcess = jsonObj[index]
    if (productsProcess.Referencia != undefined) {
      if (productsJSONInprocess.filter((product) => product.ref == productsProcess.Referencia)[0] == undefined) {
        errors.push({ type: 'Este Producto no existe', row: (productsProcess.__rowNum__ + 1) })
      }
    } else {
      errors.push({ type: 'La referencia del Producto no puede ser vacia', row: (productsProcess.__rowNum__ + 1) })
    }
    if (productsProcess.Proceso != undefined) {
      if (processesJSON.filter((process) => process.name.trim().toLowerCase() == productsProcess.Proceso.toString().trim().toLowerCase())[0] == undefined) {
        errors.push({ type: 'El proceso no existe', row: (productsProcess.__rowNum__ + 1) })
      }
    } else {
      errors.push({ type: 'El proceso no puede ser vacio', row: (productsProcess.__rowNum__ + 1) })
    }
    if (productsProcess.Maquina != undefined && productsProcess.Maquina != "") {
      if (machinesJSON.filter((machine) => machine.name == productsProcess.Maquina.toString())[0] == undefined) {
        errors.push({ type: 'La maquina no existe', row: (productsProcess.__rowNum__ + 1) })
      }
    }
    /* else {
      errors.push({ type: 'La maquina no puede ser vacia', row: (productsProcess.__rowNum__ + 1) })
    } */
    if (productsProcess.unidad == undefined) {
      errors.push({ type: 'Las Unidades/Hora no puede ser vacio', row: (productsProcess.__rowNum__ + 1) })
    } else if (isNaN(parseFloat(productsProcess.unidad))) {
      errors.push({ type: 'Las Unidades/Hora debe ser un valor numérico', row: (productsProcess.__rowNum__ + 1) })
    }
  }
  return errors
}


/**
 * Suben los procesos para los productos
 * Traidas del archivo excel cargado
 * @param {*} productsProcess Todos los productos y sus procesos que se van a subir del archivo excel
 */
function uploadProductsProcess(productsProcess) {
  loadingSpinner()
  // procesado de datos cambiando a id's
  productsProcess.forEach((productProcess) => {
    productProcess.Proceso = processesJSON.filter((process) => process.name == productProcess.Proceso)[0].id
    if (productProcess.Maquina == "" || productProcess.Maquina == undefined) {
      productProcess.Maquina = "NULL"
    } else {
      productProcess.Maquina = machinesJSON.filter((machine) => machine.name == productProcess.Maquina)[0].id
    }

  })

  $.post('api/upload_products_processes.php', {
    productsProcess: JSON.stringify(productsProcess)
  }, (data, status) => {
    if (status == 'success') {
      let countSuccess = 0
      for (let index = 0; index < data.length; index++) {
        if (data[index]) {
          countSuccess++
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Algo ha salido mal con el producto ${products[index].Producto}`
          }, {
            type: 'danger',
            timer: 8000
          })
        }
      }
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'procesos' : 'proceso'}`
      }, {
        type: 'success',
        timer: 8000
      })
    }
    completeSpinner()
    loadProductsPP()
  })
}


function bugsToString(bugs) {
  let string = ''
  bugs.forEach(bug => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`
  })
  return string
}




