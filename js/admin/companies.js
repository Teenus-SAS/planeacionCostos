/* 
* @Author: Teenus SAS
* @github: Teenus-SAS
* 
* funcionalidad de empresas
*/

// inicializacion de datatable de empresas
var $tableCompanies = $('#table-companies').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  ajax: {
    url: 'api/get_companies.php?dataTable=true',
    dataSrc: 'data'
  },
  columns: [
    {
      data: 'tradename'
    },
    {
      data: 'phone'
    },
    {
      data: 'startLicense'
    },
    {
      data: 'licenseExpiration'
    },
    {
      data: 'licensedProducts'
    }, {
      data: 'id',
      render: (data, type, row) => {
        return `<a href="javascript:updateLicense(${data})" title="Actualizar licenciamiento"><i class="nc-icon nc-refresh-69"></i></a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="view_users.php?id=${data}" title="Ver usuarios"><i class="nc-icon nc-single-02"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="javascript:viewDetails(${data})" title="Ver Información"><i class="nc-icon nc-zoom-split"></i></a>`
      }
    },
  ],
  responsive: true
})
$tableCompanies.width('100%')


function viewDetails(idCompany) {
  // busqueda de empresa seleccionada
  let company = $tableCompanies.api().rows().data().filter(data => data.id == idCompany)[0]
  company.creator = company.creator != '' ? JSON.parse(company.creator) : ""
  $.alert({
    title: `${company.tradename}`,
    content: `<table cellpadding="5">
    <tr>
      <td>NIT:</td>
      <td>${company.nit}</td>
    </tr>
    <tr>
      <td>Nombre Comercial:</td>
      <td>${company.tradename}</td>
    </tr>
    <tr>
      <td>Razon Comercial:</td>
      <td>${company.bussinesReason}</td>
    </tr>
    <tr>
      <td>Telefono:</td>
      <td>${company.phone}</td>
    </tr>
    <tr>
      <td>Dirección:</td>
      <td>${company.address}</td>
    </tr>
    <tr>
      <td>País:</td>
      <td>${company.country}</td>
    </tr>
    <tr>
      <td>Departamento:</td>
      <td>${company.department}</td>
    </tr>
    <tr>
      <td>Ciudad:</td>
      <td>${company.city}</td>
    </tr>
    <tr>
      <td>Nombre Registrado:</td>
      <td>${company.creator.name}</td>
    </tr>
    <tr>
      <td>Celular Registrado:</td>
      <td>${company.creator.cellphone}</td>
    </tr>
    <tr>
      <td>Cargo:</td>
      <td>${company.creator.position}</td>
    </tr>
  
  </table>`,
  });
}

function updateLicense(idCompany) {
  // busqueda de empresa seleccionada
  let company = $tableCompanies.api().rows().data().filter(data => data.id == idCompany)[0]
  $.confirm({
    title: 'Actualizar Licenciamiento',
    content: '' +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      '<label>Productos Licenciados</label>' +
      '<input type="number" placeholder="Productos a licenciar" class="products form-control" required value="' + company.licensedProducts + '" />' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Inicio Licenciamiento</label>' +
      '<input type="date" placeholder="Licenciamiento" class="start-license form-control" required value="' + company.startLicense + '" />' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Fin de licenciamiento</label>' +
      '<input type="date" placeholder="Licenciamiento" class="license form-control" required value="' + company.licenseExpiration + '" />' +
      '</div>' +
      '</form>',
    buttons: {
      formSubmit: {
        text: 'Actualizar',
        btnClass: 'btn-blue',
        action: function () {
          var products = this.$content.find('.products').val();
          var license = this.$content.find('.license').val();
          var startLicense = this.$content.find('.start-license').val();
          if (!products) {
            $.alert('Ingresa el número de productos licenciados');
            return false;
          }
          if (!license) {
            $.alert('Ingresa la fecha de caducidad de licencia');
            return false;
          }
          if (!startLicense) {
            $.alert('Ingresa la fecha de inicio de licencia');
            return false;
          }
          $.post('api/update_license.php', {
            idCompany,
            products,
            license,
            startLicense
          }, (data, status) => {
            if (status == 'success') {
              if (data.status) {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: `Informacion <b>Actualizada</b>`
                }, {
                  type: 'primary',
                  timer: 8000
                })
              } else {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: `No se ha podido <b>Actualizar</b> la Informacion `
                }, {
                  type: 'primary',
                  timer: 8000
                })
              }
            }
            $tableCompanies.api().ajax.reload()
          })
        }
      },
      cancelar: function () {
        //close
      },
    },
    onContentReady: function () {
      // bind to events
      var jc = this;
      jc.$content.find('.products').focus()
      this.$content.find('form').on('submit', function (e) {

        // if the user submits the form by pressing enter in the field.
        e.preventDefault();
        jc.$$formSubmit.trigger('click'); // reference the button and click it
      });
    }
  });
}