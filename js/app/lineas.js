/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de lineas
*/

let products

$.get('/app/products/api/get_products.php', (_products, status) => {
  products = _products
  loadProductsList(_products)
  $('#search-product').keyup(function () {
    let productsSought = products.filter(product => product.ref.trim().toLowerCase().includes($(this).val()) || product.name.trim().toLowerCase().includes($(this).val()))
    loadProductsList(productsSought)
    /* toggle all checkboxes in group */
    $('.all').click(function (e) {
      e.stopPropagation();
      var $this = $(this);
      if ($this.is(":checked")) {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", true);
      } else {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", false);
        $this.prop("checked", false);
      }
    });
  })
})

function loadProductsList(products) {
  $('#list1').html('<a href="#" class="list-group-item active"><span class="pull-left title">Referencia</span><input title="toggle all" type="checkbox" class="all pull-right"><span class="pull-right title mar">Seleccion De Productos</span></a>')
  products.forEach((product) => {
    $('#list1').append(`<a href="#" class="list-group-item"><span class="ref-product pull-left">${product.ref}</span>  <span class="product-name">${product.name}</span> <span class="id-product">${product.id}</span><input type="checkbox" class="pull-right"></a>`)
  })
}

let flagSelectLineas = true

loadLines()

function toggleCreateOrSelect() {
  if (!flagSelectLineas) {
    $('#lineas-create').fadeOut(400, function () {
      $('#select-lineas').fadeIn()
      flagSelectLineas = true
      $('#btn_create_or_select_lineas').html('<i class="fas fa-plus"></i>')
      $('#btn_create_or_select_lineas').prop('title', 'crear una linea')
      loadLines()
    })
  } else {
    $('#select-lineas').fadeOut(400, function () {
      $('#lineas-create').fadeIn()
      flagSelectLineas = false
      $('#btn_create_or_select_lineas').html('<i class="fas fa-caret-down"></i>')
      $('#btn_create_or_select_lineas').prop('title', 'Seleccionar una linea')
    })
  }
}

function loadLines() {
  $.get('api/get_lines.php', (data, status) => {
    $('#select-lineas').html('<option disabled selected>Seleccione una linea</option>')
    /* toggle all checkboxes in group */
    $('.all').click(function (e) {
      e.stopPropagation();
      var $this = $(this);
      if ($this.is(":checked")) {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", true);
      } else {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", false);
        $this.prop("checked", false);
      }
    });
    data.forEach(line => {
      $('#select-lineas').append(`<option value="${line.id}">${line.name}</option>`)
    })
  })
}


$('#select-lineas').change(function () {
  $.get('api/get_products_line.php', {
    id: $(this).val()
  }, (data, status) => {
    $('#list2').html(`<a href="#" class="list-group-item active"><span class="pull-left title">Referencia</span><input title="toggle all" type="checkbox" class="all pull-right"><span class="pull-right title mar">Seleccion De Productos</span></a>`)
    let _products = products.slice()
    data.forEach(product => {
      let discriminatedProduct = _products.filter(productSelect => productSelect.id == product.id)[0]
      if (discriminatedProduct != undefined) {
        _products.splice(_products.indexOf(discriminatedProduct), 1)
      }
      $('#list2').append(`<a href="#" class="list-group-item"><span class="ref-product pull-left">${product.ref}</span>  <span class="product-name">${product.name}</span> <span class="id-product">${product.id}</span><input type="checkbox" class="pull-right"></a>`)
    })
    loadProductsList(_products)
    /* toggle all checkboxes in group */
    $('.all').click(function (e) {
      e.stopPropagation();
      var $this = $(this);
      if ($this.is(":checked")) {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", true);
      } else {
        $this.parents('.list-group').find("[type=checkbox]").prop("checked", false);
        $this.prop("checked", false);
      }
    })


  })
})



$('.add').click(function () {
  $('.all').prop("checked", false);
  var items = $("#list1 input:checked:not('.all')");
  var n = items.length;
  if (n > 0) {
    if ($('#select-lineas').val() != null || !flagSelectLineas) {
      items.each(function (idx, item) {
        var choice = $(item);
        choice.prop("checked", false);
        choice.parent().appendTo("#list2");
      })
    } else {
      $.alert(
        'Selecciona una linea', 'Tezlik'
      )
    }
  } else {
    $.alert(
      'Selecciona al menos un elemento para agregar', 'Tezlik'
    )
  }
})

$('.remove').click(function () {
  $('.all').prop("checked", false);
  var items = $("#list2 input:checked:not('.all')");
  items.each(function (idx, item) {
    var choice = $(item);
    choice.prop("checked", false);
    choice.parent().appendTo("#list1");
    choice.siblings('.quantity').remove()
    
  });
  if (items.length == 0) {
    $.alert(
      'Selecciona al menos un elemento para quitar', 'Tezlik'
    )
  }
});

$('#btn-guardar-lineas').click(function () {
  let items = $("#list2 input:not('.all')")
  let productsToLine = []
  if (items.length > 0) {
    items.each(function (_indx, item) {
      let choice = $(item)
      product = {
        id: choice.siblings('.id-product').text()
      }
      productsToLine.push(product)
    })
  } else {
    $.alert("Escoge al menos un producto para la lista", "Tezlik")
    return false
  }
  if (flagSelectLineas) {
    let idLine = $('#select-lineas').val()
    $.post('api/create_update_line.php', {
      create: !flagSelectLineas,
      id: idLine,
      products: JSON.stringify(productsToLine)
    }, (data, status) => {
      if (data.status) {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: "Línea <b>Actualizada</b>"
        }, {
          type: 'primary',
          timer: 8000
        })
        
      }
    })
  } else {
    let nameLine = $('#lineas-create').val()
    $.post('api/create_update_line.php', {
      create: !flagSelectLineas,
      name: nameLine,
      products: JSON.stringify(productsToLine)
    }, (data, status) => {
      if (data.status) {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: "Línea <b>Creada</b>"
        }, {
          type: 'success',
          timer: 8000
        })
      }
    })
  }
})
