/* 
* @Author: Alexis Holguin
* @github: MoraHol
* logica para trabajar con excel
* importacion de datos 
* exportacion de datos
*/





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

$('#fileExpensesDescription').change(function () {
  var reader = new FileReader()
  let file = this.files[0]
  let fileInput = this
  $(this).siblings('label').text(file.name)
  reader.onloadend = function () {
    loadedFileUploadGE(reader, fileInput)
  }
  if (file) {
    reader.readAsArrayBuffer(file)
  }
})

function loadedFileUploadGE(reader, fileInput) {
  loadingSpinner()
  // parseo de informacion de excel 
  let data = new Uint8Array(reader.result)
  let workbook = XLSX.read(data, { type: 'array' })

  // cargado de datos en JSON
  let expenses = XLSX.utils.sheet_to_json(workbook.Sheets['Gastos'])


  // cargado de errores del formato
  let errorsExpenses = verifyErrorsExpenses(expenses)


  // validacion de la informacion
  if (errorsExpenses.length == 0 && workbook.Sheets['Gastos'] != undefined) {
    $.confirm({
      title: 'EQUOTE',
      type: 'green',
      content: 'Los datos han sido procesados y estan listo para ser cargados',
      buttons: {
        Cargar: function () {
          uploadExpenses(expenses)
          clearFile(fileInput)
        },
        Cancelar: function () {
          $.alert('Cancelado');
          clearFile(fileInput)
        }
      }
    });
  } else {
    $.dialog({
      title: 'Peligro',
      type: 'red',
      icon: 'fas fa-warning',
      content: 'Este Archivo no cumple los formatos indicados <br>' + bugsToString(errorsExpenses)
    })
    clearFile(fileInput)
  }
  completeSpinner()
}

/**
 * Validara que se cumpla el formato y dara una lista de errores en el formato
 * @param {*} jsonObj Este objeto contiene los gastos generales generados en el excel
 * @returns un arreglo de errores con tipo y fila del error
 */
function verifyErrorsExpenses(jsonObj) {
  let errors = []
  for (let index = 0; index < jsonObj.length; index++) {
    let expense = jsonObj[index]
    if (expense.Cuenta != undefined) {
      let parentAccount = expense.Cuenta.toString().substring(0, 2)
      console.log(parentAccount != '53')
      if (parentAccount != '51' && parentAccount != '52' && parentAccount != '53'
        && parentAccount != '71' && parentAccount != '72' && parentAccount != '73'
        && parentAccount != '74') {
        errors.push({ type: 'Este número de cuenta no pertenece a ninguna familia', row: (expense.__rowNum__ + 1) })
      }
    } else {
      errors.push({ type: 'El número de cuenta no puede estar vacia', row: (expense.__rowNum__ + 1) })
    }
    if (expense.Descripcion == undefined) {
      errors.push({ type: 'La Descripción de la cuenta no puede ser vacio', row: (expense.__rowNum__ + 1) })
    }
    if (expense.Monto == undefined) {
      errors.push({ type: 'El monto no puede ser vacio', row: (expense.__rowNum__ + 1) })
    } else if (isNaN(parseFloat(expense.Monto))) {
      errors.push({ type: 'El monto debe ser un número', row: (expense.__rowNum__ + 1) })
    }

  }
  return errors
}

/**
 * Suben los gastos generales de los productos
 * Traidas del archivo excel cargado
 * @param {*} productsProcess Todos los Gastos Generales que se van a subir del archivo excel
 */
function uploadExpenses(expenses) {
  loadingSpinner()
  // estructura de subida
  let structure =
  {
    total: 0,
    "51":
    {
      value: 0,
      accounts: [
      ]
    },
    "52":
    {
      value: 0,
      accounts: []
    },
    "53":
    {
      value: 0,
      accounts: []
    },
    "73":
    {
      value: 0,
      accounts: []
    },
    "74":
    {
      value: 0,
      accounts: []
    },
  }
  // procesado de datos cambiando a id's  
  let sum51 = 0, sum52 = 0, sum53 = 0, sum73 = 0, sum74 = 0
  expenses.forEach(expense => {
    let parentAccount = expense.Cuenta.toString().substring(0, 2)
    switch (parentAccount) {
      case "51":
        structure["51"].accounts.push({
          account: expense.Cuenta.toString(),
          description: expense.Descripcion,
          amount: expense.Monto,
        })
        sum51 += expense.Monto
        break;
      case "52":
        structure["52"].accounts.push({
          account: expense.Cuenta.toString(),
          description: expense.Descripcion,
          amount: expense.Monto,
        })
        sum52 += expense.Monto
        break;
      case "53":
        structure["53"].accounts.push({
          account: expense.Cuenta.toString(),
          description: expense.Descripcion,
          amount: expense.Monto,
        })
        sum53 += expense.Monto
        break;
      case "73":
        structure["73"].accounts.push({
          account: expense.Cuenta.toString(),
          description: expense.Descripcion,
          amount: expense.Monto,
        })
        sum73 += expense.Monto
        break;
      case "74":
        structure["74"].accounts.push({
          account: expense.Cuenta.toString(),
          description: expense.Descripcion,
          amount: expense.Monto,
        })
        sum74 += expense.Monto
        break;
      default:
        break;
    }
  })
  structure["51"].value = sum51
  structure["52"].value = sum52
  structure["53"].value = sum53
  structure["73"].value = sum73
  structure["74"].value = sum74
  structure.total = sum51 + sum52 + sum53 + sum73 + sum74
  $.post('api/modify_expenses_description.php', {
    expensesDescription: JSON.stringify(structure),
    totalExpenses: structure.total
  }).always(xhr => {
    if (xhr.status == 200) {
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Informacion <b>Subida</b>`
      }, {
        type: 'success',
        timer: 8000
      })
    }
    loadMonthExpenses()
    loadExpensesGE()
    $tableGastosMensuales.api().ajax.reload()
  })
  completeSpinner()
}


function bugsToString(bugs) {
  let string = ''
  bugs.forEach(bug => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`
  })
  return string
}

$('#download-description-expenses').click(generateFileExpensesGE)


function generateFileExpensesGE() {
  loadingSpinner()
  // creacion del libro de excel
  var wb = XLSX.utils.book_new()
  // configuración de del libro
  wb.Props = {
    Title: "Gastos",
    Subject: "EQUOTE",
    Author: "EQUOTE",
    CreatedDate: new Date()
  }
  // agregado de los nombres de las hojas del libro
  wb.SheetNames.push('Gastos')
  // creacion de variables para cargar la información de los materiales
  let ws_data = []
  $.get('api/get_expenses_description.php', (data, status) => {
    // cargado de de productos con referencias
    console.log(data)
    if ( data != null) {
      data["51"].accounts.forEach((account) => {
        ws_data.push({
          Cuenta: account.account,
          Descripcion: account.description,
          "Monto": account.amount
        })
      })
      data["52"].accounts.forEach((account) => {
        ws_data.push({
          Cuenta: account.account,
          Descripcion: account.description,
          "Monto": account.amount
        })
      })
      data["53"].accounts.forEach((account) => {
        ws_data.push({
          Cuenta: account.account,
          Descripcion: account.description,
          "Monto": account.amount
        })
      })
      data["73"].accounts.forEach((account) => {
        ws_data.push({
          Cuenta: account.account,
          Descripcion: account.description,
          "Monto": account.amount
        })
      })
      data["74"].accounts.forEach((account) => {
        ws_data.push({
          Cuenta: account.account,
          Descripcion: account.description,
          "Monto": account.amount
        })
      })
    }

    // se verifican que hayan datos
    if (ws_data.length <= 0) {
      saveAs('/formatos/formato-gastos-especificos.xlsx', 'formato-gastos-especificos.xlsx')
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data)
      // asignacion de hojas de excel
      wb.Sheets["Gastos"] = ws

      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

      var wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Gastos.xlsx')
    }
    completeSpinner()
  })
}