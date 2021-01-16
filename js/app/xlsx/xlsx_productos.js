/* 
* @Author: Teenus SAS
* @github: Teenus-SAS
* logica para trabajar con excel
* importacion de datos 
* exportacion de datos
*/

var productsJSON
var materialsJSON

loadProductsInMaterials()
// cargado de productos de base de datos
function loadProductsInMaterials() {
  loadingSpinner()
  $.get('api/get_products.php?materials', (data, status, xhr) => {
    productsJSON = data
    completeSpinner()
  })
}


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
/* Productos */
$('#fileProducts').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  var inputFileProducts = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {
    loadedFileProducts(reader, inputFileProducts)
  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})

/* Productos vs Materias primas */
$('#fileProductsMaterials').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  var inputFileProducts = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {
    loadedFileProductsMaterials(reader, inputFileProducts)
  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})


function loadedFileProducts(reader, inputFileProducts) {
  if (productsJSON != undefined) {
    $('#spinnerAjax').removeClass('fade')
    // parseo de informacion de excel 
    let data = new Uint8Array(reader.result)
    let workbook = XLSX.read(data, { type: 'array' })

    // cargado de datos en JSON
    let products = XLSX.utils.sheet_to_json(workbook.Sheets['Productos'])
    //let rawMaterials = XLSX.utils.sheet_to_json(workbook.Sheets['Materia Prima'])
    // cargado de errores del formato
    let errorsProducts = verifyErrorsProducts(products)
    //let errosRawMaterials = verifyErrorsRawMaterials(rawMaterials, products)


    // validacion de los productos
    if (errorsProducts.length == 0 /* && errosRawMaterials.length == 0 */ && workbook.Sheets['Productos'] != undefined /* && workbook.Sheets['Materia Prima'] != undefined */) {
      $.confirm({
        title: 'Tezlik',
        type: 'green',
        content: 'Los datos han sido procesados y estan listos para ser cargados',
        buttons: {
          Cargar: function () {
            uploadProducts(products/* , rawMaterials */)
            clearFile(inputFileProducts)
          },
          Cancelar: function () {
            $.alert('Cancelado');
            clearFile(inputFileProducts)
          }
        }
      })
    } else {
      $.dialog({
        title: 'Alerta',
        type: 'red',
        icon: 'fas fa-warning',
        content: 'Este Archivo no cumple los formatos indicados <br>' + bugsToString(errorsProducts) + bugsToString(errosRawMaterials),
      });
      clearFile(inputFileProducts)
    }
    $('#spinnerAjax').addClass('fade')
  } else {
    $('#spinnerAjax').removeClass('fade')
    setTimeout(loadedFileProducts(reader, inputFileProducts), 2000)
  }

}


function loadedFileProductsMaterials(reader, inputFileProducts) {
  if (productsJSON != undefined) {
    $('#spinnerAjax').removeClass('fade')
    // parseo de informacion de excel 
    let data = new Uint8Array(reader.result)
    let workbook = XLSX.read(data, { type: 'array' })

    // cargado de datos en JSON
    //let products = XLSX.utils.sheet_to_json(workbook.Sheets['Productos'])
    let rawMaterials = XLSX.utils.sheet_to_json(workbook.Sheets['Materia Prima'])
    // cargado de errores del formato
    //let errorsProducts = verifyErrorsProducts(products)
    let errosRawMaterials = verifyErrorsRawMaterials(rawMaterials/* , products */)


    // validacion de los productos
    if (/* errorsProducts.length == 0 && */ errosRawMaterials.length == 0 /* && workbook.Sheets['Productos'] != undefined  */ && workbook.Sheets['Materia Prima'] != undefined) {
      $.confirm({
        title: 'Tezlik',
        type: 'green',
        content: 'Los datos han sido procesados y estan listo para ser cargados',
        buttons: {
          Cargar: function () {
            uploadProductsMaterials(/* products,  */rawMaterials)
            clearFile(inputFileProducts)
          },
          Cancelar: function () {
            $.alert('Cancelado');
            clearFile(inputFileProducts)
          }
        }
      })
    } else {
      $.dialog({
        title: 'Alerta',
        type: 'red',
        icon: 'fas fa-warning',
        content: 'Este Archivo no cumple los formatos indicados <br>' + bugsToString(errorsProducts) + bugsToString(errosRawMaterials),
      });
      clearFile(inputFileProducts)
    }
    $('#spinnerAjax').addClass('fade')
  } else {
    $('#spinnerAjax').removeClass('fade')
    setTimeout(loadedFileProductsMaterials(reader, inputFileProducts), 2000)
  }

}


/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene los materiales generados en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
function verifyErrorsRawMaterials(jsonObj, jsonProductObj) {
  let errors = []
  for (let index = 0; index < jsonObj.length; index++) {
    let rawMaterial = jsonObj[index]
    if (rawMaterial.Referencia != undefined) {
      if (productsJSON.filter((product) => product.ref == rawMaterial.Referencia)[0] == undefined
        && jsonProductObj.filter((product) => product.Referencia == rawMaterial.Referencia)[0] == undefined) {
        errors.push({ type: 'Este Producto no existe', row: (rawMaterial.__rowNum__ + 1) })
      }
    } else {
      errors.push({ type: 'La referencia del Producto no puede estar vacia', row: (rawMaterial.__rowNum__ + 1) })
    }
    if (rawMaterial.Material != undefined) {
      if (materialsJSON.filter((material) => material.description.trim() == rawMaterial.Material.toString().trim())[0] == undefined) {
        errors.push({ type: 'El material no existe', row: (rawMaterial.__rowNum__ + 1) })
      }
    } else {
      errors.push({ type: 'El material no puede estar vacio', row: (rawMaterial.__rowNum__ + 1) })
    }
    if (rawMaterial.Cantidad == undefined) {
      errors.push({ type: 'La cantidad no puede estar vacia', row: (rawMaterial.__rowNum__ + 1) })
    } else if (isNaN(parseFloat(rawMaterial.Cantidad))) {
      errors.push({ type: 'La cantidad debe ser un valor numérico', row: (rawMaterial.__rowNum__ + 1) })
    }
  }
  return errors
}


/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene los prodcutos generados en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
function verifyErrorsProducts(jsonObj) {
  let errors = []
  for (let index = 0; index < jsonObj.length; index++) {
    let product = jsonObj[index]
    if (product.Referencia == undefined) {
      errors.push({ type: 'La referencia del producto no puede estar vacia', row: (product.__rowNum__ + 1) })
    }
    if (product.Producto == undefined) {
      errors.push({ type: 'El nombre del producto no puede estar vacia', row: (product.__rowNum__ + 1) })
    }
  }
  return errors
}

/**
 * Suben los productos
 * Traidas del archivo excel cargado
 * @param {*} products Todos los productos que se van a subir del archivo excel
 * @param {*} rawMaterials Todas las materias primas de los productos que se van a subir del archivo excel
 */
function uploadProducts(products/* , rawMaterials */) {
  loadingSpinner()
  $.post('../products/api/upload_products.php', {
    //C:\Desarrollo\Tezlik\htdocs\app\products\api\upload_products.php
    products: JSON.stringify(products)
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
        message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'productos' : 'producto'}`
      }, {
        type: 'success',
        timer: 8000
      })
      $tableProductos.api().ajax.reload()
      completeSpinner()
      loadingSpinner()
      /* $.post('api/upload_raw_materials.php', {
        rawMaterials: JSON.stringify(rawMaterials)
      }, (data, status) => {
        if (status == 'success') {
          let countSuccess = 0
          for (let index = 0; index < data.length; index++) {
            if (data[index]) {
              countSuccess++
            } else {
              $.notify({
                icon: "nc-icon nc-bell-55",
                message: `Algo ha salido mal con la materia prima ${rawMaterials[index].Material} en el producto ${rawMaterials[index].Producto}`
              }, {
                type: 'danger',
                timer: 8000
              })
            }
          }
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'materias primas' : 'materia prima'}`
          }, {
            type: 'success',
            timer: 8000
          })
          completeSpinner()
          loadProductsInProcess()
          loadProductsInMaterials()
          loadProductsGG()
          loadProductsPP()
          loadProductsInXLSX()
        }
      }) */
    }
  }).always((xhr) => {
    if (xhr.status == 403) {
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: "No puede crear más productos <br> Se ha alcanzado el limite de productos licenciados, por favor, contacte a Teenus S.A.S"
      }, {
        type: 'danger',
        timer: 8000
      })
      completeSpinner()
    }
  })

}


/**
 * Suben los productos y las materias primas
 * Traidas del archivo excel cargado
 * @param {*} products Todos los productos que se van a subir del archivo excel
 * @param {*} rawMaterials Todas las materias primas de los productos que se van a subir del archivo excel
 */
function uploadProductsMaterials(/* products ,*/ rawMaterials) {
  loadingSpinner()
  /* $.post('../products/api/upload_products.php', {
    products: JSON.stringify(products)
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
        message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'productos' : 'producto'}`
      }, {
        type: 'success',
        timer: 8000
      })
      $tableProductos.api().ajax.reload()
      completeSpinner()
      loadingSpinner() */
  $.post('api/upload_raw_materials.php', {
    rawMaterials: JSON.stringify(rawMaterials)
  }, (data, status) => {
    if (status == 'success') {
      let countSuccess = 0
      for (let index = 0; index < data.length; index++) {
        if (data[index]) {
          countSuccess++
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Algo ha salido mal con la materia prima ${rawMaterials[index].Material} en el producto ${rawMaterials[index].Producto}`
          }, {
            type: 'danger',
            timer: 8000
          })
        }
      }
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Se ${countSuccess > 1 ? 'han' : 'ha'} cargado ${countSuccess} ${countSuccess > 1 ? 'materias primas' : 'materia prima'}`
      }, {
        type: 'success',
        timer: 8000
      })
      completeSpinner()
      loadProductsInProcess()
      loadProductsInMaterials()
      loadProductsGG()
      loadProductsPP()
      loadProductsInXLSX()
      /* }
    }) */
    }
  }).always((xhr) => {
    if (xhr.status == 403) {
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: "No puede crear más productos <br> Se ha alcanzado el limite de productos licenciados, por favor, contacte a Teenus S.A.S"
      }, {
        type: 'danger',
        timer: 8000
      })
      completeSpinner()
    }
  })

}

function bugsToString(bugs) {
  let string = ''
  bugs.forEach(bug => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`
  })
  return string
}


/**
 * Genera un archivo excel con todos los datos de productos 
 */

$("#download-products").click(function () {
  generateFileProducts()
});

function generateFileProducts() {
  loadingSpinner()
  $.get('api/get_products.php?materials', (data, status, xhr) => {
    productsJSON = data

    // creacion del libro de excel
    var wb = XLSX.utils.book_new()
    // configuración de del libro
    wb.Props = {
      Title: "Productos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date()
    }
    // agregado de los nombres de las hojas del libro
    wb.SheetNames.push('Productos')
    //wb.SheetNames.push('Materia Prima')
    // creacion de variables para cargar la información de los productos
    let ws_data = []
    //let ws_data_2 = []
    // cargado de de productos con referencias
    productsJSON.forEach(product => {
      let productRaw = {
        Referencia: product.ref,
        Producto: product.name,
        Rentabilidad: product.rentabilidad
      }
      ws_data.push(productRaw)
      // recorrido para agregar todos los materiales de los productos
      /* product.materials.forEach((rawMaterial) => {
        ws_data_2.push({
          Referencia: product.ref,
          Producto: product.name,
          Material: rawMaterial.material.description,
          Cantidad: rawMaterial.quantity
        })
      }) */
    })
    if (ws_data.length <= 0) {
      saveAs('/formatos/formato-productos.xlsx', 'formato-productos.xlsx')
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data)
      //var ws_2 = XLSX.utils.json_to_sheet(ws_data_2)
      // asignacion de hojas de excel
      wb.Sheets["Productos"] = ws;
      //wb.Sheets["Materia Prima"] = ws_2;

      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
      var wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Productos.xlsx')
    }
    completeSpinner()
  })
}


/**
 * Genera un archivo excel con todos los datos de productos y sus materias primas
 */

$('#download-products-materials').click(function (e) {
  e.preventDefault();
  generateFileProductsMaterials()
});

function generateFileProductsMaterials() {
  loadingSpinner()
  $.get('api/get_products.php?materials', (data, status, xhr) => {
    productsJSON = data

    // creacion del libro de excel
    var wb = XLSX.utils.book_new()
    // configuración de del libro
    wb.Props = {
      Title: "Productos de Cotizador",
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date()
    }
    // agregado de los nombres de las hojas del libro
    //wb.SheetNames.push('Productos')
    wb.SheetNames.push('Productos vs Materia Prima')
    // creacion de variables para cargar la información de los productos
    //let ws_data = []
    let ws_data_2 = []
    // cargado de de productos con referencias
    productsJSON.forEach(product => {
      /* let productRaw = {
        Referencia: product.ref,
        Producto: product.name,
        Rentabilidad: product.Rentabilidad
      } */
      //ws_data.push(productRaw)
      // recorrido para agregar todos los materiales de los productos
      product.materials.forEach((rawMaterial) => {
        ws_data_2.push({
          Referencia: product.ref,
          Producto: product.name,
          Material: rawMaterial.material.description,
          Cantidad: rawMaterial.quantity
        })
      })
    })
    if (ws_data_2.length <= 0) {
      saveAs('/formatos/formato-productos.xlsx', 'formato-productos.xlsx')
    } else {
      // parseo de objetos a las hojas de excel
      //var ws = XLSX.utils.json_to_sheet(ws_data)
      var ws_2 = XLSX.utils.json_to_sheet(ws_data_2)
      // asignacion de hojas de excel
      //wb.Sheets["Productos"] = ws;
      wb.Sheets["Materia Prima"] = ws_2;

      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
      var wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Productos.xlsx')
    }
    completeSpinner()
  })
}


function clearFile(input) {
  $(input).val('')
  $(input).siblings('label').text('Seleccionar Archivo')
}
