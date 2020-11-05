$('#fileRawMaterial').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  let fileInput = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {
    let data = new Uint8Array(reader.result)
    let workbook = XLSX.read(data, { type: 'array' })
    let workSheet = workbook.Sheets['Materiales']
    let materials = XLSX.utils.sheet_to_json(workSheet)
    let errors = verifyErrorsRawMaterials(materials)
    if (errors.length == 0 && workSheet != undefined) {
      $.confirm({
        title: 'Tezlik',
        content: 'Los datos han sido procesados y estan listo para ser cargados',
        type: 'green',
        buttons: {
          Cargar: function () {
            uploadMaterials(materials)
            clearFile(fileInput)
          },
          Cancelar: function () {
            $.alert('Cancelado');
            clearFile(fileInput)
          }
        }
      })
      clearFormMaterials()
      $('#form-materia-prima')[0].reset()
    } else {
      $.alert({
        title: 'Peligro',
        content: 'Este Archivo no cumple los formatos indicados <br>' + bugsToString(errors),
        type: 'red',
      })
      clearFormMaterials()
      $('#form-materia-prima')[0].reset()
      clearFile(fileInput)
    }
  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})

/**
 * Verifica los errores del archvio excel subido
 * @param {*} jsonObj Objeto representativo a los datos del archivo
 */
function verifyErrorsRawMaterials(jsonObj) {
  let errors = []
  for (let index = 0; index < jsonObj.length; index++) {
    let material = jsonObj[index]
    if (material["Materia Prima"] == undefined) {
      errors.push({ type: 'La Materia Prima no puede ser vacia', row: (productExpenses.__rowNum__ + 1) })
    }
    if (material.Costo == undefined) {
      errors.push({ type: 'El Costo no puede ser vacia', row: (productExpenses.__rowNum__ + 1) })
    } else if (isNaN(parseFloat(material.Costo))) {
      errors.push({ type: 'El Costo debe ser un valor numérico', row: (productExpenses.__rowNum__ + 1) })
    }
    if (material.Unidad == undefined) {
      errors.push({ type: 'La unidad no puede ser vacia', row: (productExpenses.__rowNum__ + 1) })
    } else if (isNaN(parseFloat(material.Costo))) {
      errors.push({ type: 'La unidad debe ser un valor numérico', row: (productExpenses.__rowNum__ + 1) })
    }
  }
  return errors
}

function uploadMaterials(materials) {
  loadingSpinner()
  // cambio de nombre en la variable
  materials.forEach(material => {
    material.Descripcion = material["Materia Prima"].trim()
  })
  $.post('api/upload_materials.php', { materials: JSON.stringify(materials) }, (data, status) => {
    if (status == 'success') {
      let countSuccess = 0
      for (let index = 0; index < data.length; index++) {
        if (data[index]) {
          countSuccess++;
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Algo ha salido mal con el material ${materials[index].Descripcion}`
          }, {
            type: 'danger',
            timer: 8000
          })
        }
      }
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Se han cargado ${countSuccess} materiales`
      }, {
        type: 'success',
        timer: 8000
      })
      completeSpinner()
      $tableMateriaPrima.api().ajax.reload()
    }
  })
}


function generateFileRawMaterials() {
  loadingSpinner()
  // creacion del libro de excel
  var wb = XLSX.utils.book_new()
  // configuración de del libro
  wb.Props = {
    Title: "Materia Prima de Cotizador",
    Subject: "Tezlik",
    Author: "Tezlik",
    CreatedDate: new Date()
  }
  // agregado de los nombres de las hojas del libro
  wb.SheetNames.push('Materiales')
  // creacion de variables para cargar la información de los materiales
  let ws_data = []
  $.get('api/get_materials.php', (data, status) => {
    // cargado de de productos con referencias
    data.forEach((material) => {
      ws_data.push({
        "Materia Prima": material.description,
        Unidad: material.unit,
        Costo: material.cost
      })
    })
    // se verifican que hayan datos
    if (ws_data.length <= 0) {
      saveAs('/formatos/formato-materia-prima.xlsx', 'formato-materia-prima.xlsx')
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data)
      // asignacion de hojas de excel
      wb.Sheets["Materiales"] = ws

      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

      var wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Materia Prima.xlsx')
    }

    completeSpinner()
  })
}

$('#download_materia_prima').click(generateFileRawMaterials)

