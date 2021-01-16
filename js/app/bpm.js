/**
 * @author Alexis Holguin
 * @date 21/10/2019
 * @github Teenus SAS
 * @company Teenus
 */


//cargar imagen de bpm
$.get('api/get_bpm.php', (data, status) => {
  if (status == 'success') {
    if (data.bpm == null || data.bpm == '') {
      $('#img-proccess').attr('src', '/img/img.jpg')
    } else {
      $('#img-proccess').attr('src', data.bpm)
    }
  }
})

// subir imagen de bpm 
$('#input-file-img-bpm').change(function () {
  let file = this.files[0]
  console.log(file)
  var reader = new FileReader();
  reader.onload = function (e) {
    let src = e.target.result
    console.log(e)

    let formData = new FormData()
    formData.append('bpm', file)
    $.ajax({
      url: 'api/upload_bpm.php',
      type: 'POST',
      contentType: false,
      data: formData,
      processData: false,
      cache: false,
      success: (data, status, xhr) => {
        if (data.ok) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `BPM <b>Actualizado</b>`
          }, {
            type: 'primary',
            timer: 8000
          })
          $('#img-proccess').attr('src', src)
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: data.msg
          }, {
            type: 'danger',
            timer: 8000
          })
        }
      }
    })
  }
  if (file.type.substring(0, 5) == 'image'){
    reader.readAsDataURL(file);
  }else{
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Por favor sube un archivo en formato de <b>Imagen</b>`
    }, {
      type: 'danger',
      timer: 8000
    })
  }
})