/* 
* @Author: Teenus SAS
* @github: Teenus-SAS
* 
* funcionalidad de parametros
*/

$('.money').number(true, 2, '.', ',')

loadParameters()

//cargado de salario desde json externo
function loadParameters() {
  $.get('/app/config-general/api/salary_min.json', (data, status) => {
    $('#input-salary-min').val(data.minSalary)
    $('#input-transport').val(data.transport)
  })
}


$('#saveParameters').click(function () {
  let json = {
    minSalary: parseFloat($('#input-salary-min').val()),
    transport: parseFloat($('#input-transport').val())
  }
  $.post('api/update_parameters.php', { json: JSON.stringify(json) }, (data, status) => {
    if(status == 'success'){
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Información <b>Actualizada</b>`
      }, {
        type: 'info',
        timer: 8000
      })
    }
    loadParameters()
  })
})