/* 
* @Author: Alexis Holguin
* @github: MoraHol
* 
* Funcionalidad de registro de empresas
*/


// autocompletado geograficamente

$('#country').autocomplete({
  source: function (request, response) {
    $.getJSON('/resources/paises.json', (data) => {
      response(data.filter(country => country.trim().toLowerCase().includes(request.term.trim().toLowerCase())))
    })
  },
  minLength: 2,
})

$('#country').change(function () {
  if ($(this).val().trim().toLowerCase() == 'colombia') {
    $('#department').autocomplete({
      source: function (request, response) {
        $.getJSON('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json', (data) => {
          let departments = data.filter(department => department.departamento.trim().toLowerCase().includes(request.term.trim().toLowerCase()))
          let departmentsString = []
          departments.forEach(department => {
            departmentsString.push(department.departamento)
          })
          response(departmentsString)
        })
      }
    })
    $('#department').change(function () {
      $('#city').autocomplete({
        source: function (request, response) {
          $.getJSON('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json', (data) => {
            let department = data.filter(department => department.departamento.trim().toLowerCase() == $('#department').val().trim().toLowerCase())[0]
            response(department.ciudades.filter(city => city.trim().toLowerCase().includes(request.term.trim().toLowerCase())))
          })
        }
      })
    })
  } else {
    $("#department").autocomplete("destroy");
    $("#city").autocomplete("destroy");
  }
})


$('#form-register').submit(function (e) {
  e.preventDefault()
  let stringForm = $(this).serialize()
  let creator = {
    name: $('#name_creator').val(),
    cellphone: $('#cellphone_creator').val(),
    position: $('#position_creator').val()
  }
  stringForm += `&creator=${JSON.stringify(creator)}`
  $.post('/admin/api/create_company2.php', stringForm, (data, status) => {
    if (data.status) {
      location.href = 'success_register.html'
    } else {
      if (data.errorno == 1062) {
        $.alert({
          title: 'Advertencia',
          content: 'El usuario o correo ingresados ya estan en uso',
          type: 'red'
        })
      }
    }
  })
})