$.get('api/get_tutorials.php', (data, status) => {
  $('#video_banner').html('')
  data.banner.forEach(video => {
    $('#video_banner').append(`<div class="col-12 col-md-4">
    <div class="form-group">
      <label for="my-input">Video</label>
      <input id="my-input" class="form-control" type="text" name="" value="youtube.com/watch?v=${video}">
    </div>
  </div>`)
    $('#video_config').html('')
    data["config-general"].forEach(config => {
      $('#video_config').append(`<div class="col-12 col-md-4">
    <div class="form-group">
      <label for="my-input">Video</label>
      <input id="my-input" class="form-control" type="text" name="" value="youtube.com/watch?v=${config}">
    </div>
  </div>`)
    })
    $('#product_video').html('')
    data.products.forEach(product => {
      $('#product_video').append(`<div class="col-12 col-md-4">
      <div class="form-group">
        <label for="my-input">Video</label>
        <input id="my-input" class="form-control" type="text" name="" value="youtube.com/watch?v=${product}">
      </div>
    </div>`)
    })
    $('#cost_video').html('')
    data.cost.forEach(product => {
      $('#cost_video').append(`<div class="col-12 col-md-4">
      <div class="form-group">
        <label for="my-input">Video</label>
        <input id="my-input" class="form-control" type="text" name="" value="youtube.com/watch?v=${product}">
      </div>
    </div>`)
    })
  })
})


$('.add_video').click(function () {
  $(this).parent().parent().siblings('.container_video').append(`<div class="col-12 col-md-4">
    <div class="form-group">
      <label for="my-input">Video</label>
      <input id="my-input" class="form-control" type="text" name="">
    </div>
  </div>`)
})
$('#btn_save_videos').click(function () {
  let structure = {
    "banner": [],
    "config-general": [],
    "products": [],
    "cost": []
  }
  let keys = ['banner', 'config-general', 'products', 'cost']
  let index = 0
  $('.container_video').each(function () {
    $(this).children().each(function () {
      let string = $(this).find('input').val()
      let arr = string.split('watch')
      let params = new URLSearchParams(arr[1])
      let idVideo = params.get('v')
      if (idVideo != undefined) {
        structure[keys[index]].push(idVideo)
      }
    })
    index++
  })
  $.post('api/update_tutorials.php', {
    json: JSON.stringify(structure)
  }, (data, status) => {
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Información <b>Actualizada</b>`
    }, {
      type: 'info',
      timer: 8000
    })
  })
})