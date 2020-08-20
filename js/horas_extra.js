//cargado de salario desde json externo
var minSalary
var transport
$.get('/app/config-general/api/salary_min.json', (data, status) => {
  minSalary = data.minSalary
  transport = data.transport
})

// formatear a numero
$('#salary-hours-extra').number(true, 2, ',', '.')
$('#v_the').number(true, 2, ',', '.')

/**
 * aqui empiza la logica para calcular el salario
 * Se trae de otro script el valor del salario minimo
 * Todo inicia cuando Se hace click en boton de calcular
*/

$('#submit-salary-hours-extra').click(function () {
  // se trae el valor del salario ingresado
  let salary = $('#salary-hours-extra').val()
  let flagForm = true
  // verificado que el salario ingresado sea mayor al salario minimo
  if (parseFloat(salary) < minSalary) {
    $('#salary-hours-extra').each(function () {
      this.setCustomValidity('El valor debe ser superior o igual a $ ' + $.number(minSalary, 2, ',', '.'))
      flagForm = false
      return false;
    })
  } else {
    $('#salary-hours-extra').each(function () {
      this.setCustomValidity('')
      flagForm = true
      return true;
    })
  }
  if (flagForm) {
    $('#form-salary-hours-extra').submit()
  }
})
$('#form-salary-hours-extra').submit(function (e) {
  let salary = parseFloat($('#salary-hours-extra').val())
  clearInputs()
  e.preventDefault()
  var ho = salary / 240;
  var hn = ho * 1.35;
  var hen = ho * 1.75;
  var hed = ho * 1.25;
  var hod = ho * 1.75;
  var hedd = ho * 2;
  var hend = ho * 2.5;
  var rn = ho * 0.35;
  var hnd = ho * 2.1;

  $('#v_ho').html('$ ' + $.number(ho, 2, ',', '.'))
  $('#v_hn').html('$ ' + $.number(hn, 2, ',', '.'))
  $('#v_hen').html('$ ' + $.number(hen, 2, ',', '.'))
  $('#v_hed').html('$ ' + $.number(hed, 2, ',', '.'))
  $('#v_hod').html('$ ' + $.number(hod, 2, ',', '.'))
  $('#v_hedd').html('$ ' + $.number(hedd, 2, ',', '.'))
  $('#v_hend').html('$ ' + $.number(hend, 2, ',', '.'))
  $('#v_rn').html('$ ' + $.number(rn, 2, ',', '.'))
  $('#v_hnd').html('$ ' + $.number(hnd, 2, ',', '.'))

  $('#result-calculator-he').fadeIn("slow")

  $('#i_ho').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_ho').html('$ ' + $.number($(this).val() * ho, 2, ',', '.'))
    } else {
      $('#vt_ho').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hn').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hn').html('$ ' + $.number($(this).val() * hn, 2, ',', '.'))
    } else {
      $('#vt_hn').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hen').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hen').html('$ ' + $.number($(this).val() * hen, 2, ',', '.'))
    } else {
      $('#vt_hen').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hed').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hed').html('$ ' + $.number($(this).val() * hed, 2, ',', '.'))
    } else {
      $('#vt_hed').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hod').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hod').html('$ ' + $.number($(this).val() * hod, 2, ',', '.'))
    } else {
      $('#vt_hod').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hedd').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hedd').html('$ ' + $.number($(this).val() * hedd, 2, ',', '.'))
    } else {
      $('#vt_hedd').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hend').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hend').html('$ ' + $.number($(this).val() * hend, 2, ',', '.'))
    } else {
      $('#vt_hend').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_rn').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_rn').html('$ ' + $.number($(this).val() * rn, 2, ',', '.'))
    } else {
      $('#vt_rn').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hnd').keyup(function () {
    if ($(this).val() >= 1) {
      $('#vt_hnd').html('$ ' + $.number($(this).val() * hnd, 2, ',', '.'))
    } else {
      $('#vt_hnd').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })

  // evento con change 
  $('#i_ho').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_ho').html('$ ' + $.number($(this).val() * ho, 2, ',', '.'))
    } else {
      $('#vt_ho').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hn').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hn').html('$ ' + $.number($(this).val() * hn, 2, ',', '.'))
    } else {
      $('#vt_hn').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hen').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hen').html('$ ' + $.number($(this).val() * hen, 2, ',', '.'))
    } else {
      $('#vt_hen').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hed').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hed').html('$ ' + $.number($(this).val() * hed, 2, ',', '.'))
    } else {
      $('#vt_hed').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hod').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hod').html('$ ' + $.number($(this).val() * hod, 2, ',', '.'))
    } else {
      $('#vt_hod').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hedd').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hedd').html('$ ' + $.number($(this).val() * hedd, 2, ',', '.'))
    } else {
      $('#vt_hedd').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hend').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hend').html('$ ' + $.number($(this).val() * hend, 2, ',', '.'))
    } else {
      $('#vt_hend').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_rn').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_rn').html('$ ' + $.number($(this).val() * rn, 2, ',', '.'))
    } else {
      $('#vt_rn').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })
  $('#i_hnd').change(function () {
    if ($(this).val() >= 1) {
      $('#vt_hnd').html('$ ' + $.number($(this).val() * hnd, 2, ',', '.'))
    } else {
      $('#vt_hnd').html('$ ' + $.number(0, 2, ',', '.'))
    }
    calculateTotalHE()
  })


  function calculateTotalHE() {
    let sum = 0
    sum += $('#i_ho').val() * ho
    sum += $('#i_hn').val() * hn
    sum += $('#i_hen').val() * hen
    sum += $('#i_hed').val() * hed
    sum += $('#i_hod').val() * hod
    sum += $('#i_hedd').val() * hedd
    sum += $('#i_hend').val() * hend
    sum += $('#i_rn').val() * rn
    sum += $('#i_hnd').val() * hnd

    $('#v_the').html('$ ' + $.number(sum, 2, ',', '.'))
  }
  function clearInputs() {
    $('#i_ho').val('')
    $('#i_hn').val('')
    $('#i_hen').val('')
    $('#i_hed').val('')
    $('#i_hod').val('')
    $('#i_hedd').val('')
    $('#i_hend').val('')
    $('#i_rn').val('')
    $('#i_hnd').val('')

    $('#vt_ho').html('$ 0.00')
    $('#vt_hn').html('$ 0.00')
    $('#vt_hen').html('$ 0.00')
    $('#vt_hed').html('$ 0.00')
    $('#vt_hod').html('$ 0.00')
    $('#vt_hedd').html('$ 0.00')
    $('#vt_hend').html('$ 0.00')
    $('#vt_rn').html('$ 0.00')
    $('#vt_hnd').html('$ 0.00')
    $('#v_the').html('$ 0.00')
  }
})


