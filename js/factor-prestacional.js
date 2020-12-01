/* 
@Author: Alexis Holguin
@github: MoraHol
logica factor prestacional
*/

$.validator.addMethod("decimalInput", function (value) {
  return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value);
  }, "Máximo dos decimales");


  $('#form-factor-prestacional').validate({

    rules: {
      'SalesCommission': {
        required: true,
        decimalInput: true,
      },
      'workHours': {
        required: true,
        decimalInput: true
      }
    },
    messages: {
      'SalesCommission': {
        required: 'requerido',
        decimalInput: 'dos decimales'
      },
      'workHours': {
        required:'required',
        decimalInput: 'max dos',
      }
    },
    errorPlacement: function (error, element) {  
      error.insertAfter(element.closest('div.form-group'));
    }, 
    submitHandler: function (form) {
        loadingSpinner()
     /*    e.preventDefault() */
        $.post('api/update_factor_prestacional.php', $(form).serialize())
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
      }
  });