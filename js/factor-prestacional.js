/* 
@Author: Alexis Holguin
@github: MoraHol
logica factor prestacional
*/
$('#form-factor-prestacional').submit(function (e) {
  loadingSpinner()
  e.preventDefault()
  $.post('api/update_factor_prestacional.php', $(this).serialize())
    .always(function (xhr) {
      completeSpinner()
      switch (xhr.status) {
        case 200:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Informacion <b>Actualizada</b>`
          }, {
            type: 'primary',
            timer: 8000
          })
          break
        case 400:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Por favor <b>Completa</b> todos los campos`
          }, {
            type: 'warning',
            timer: 8000
          })
          break
        case 500:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Ha ocurrido un <b>error</b> al momento de actulizar los datos`
          }, {
            type: 'danger',
            timer: 8000
          })
          break
      }
    })
})