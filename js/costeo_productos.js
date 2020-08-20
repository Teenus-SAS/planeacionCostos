/* 
@Author: Alexis Holguin
@github: MoraHol
logica de gosteo de productos
*/
var products
$.get('/app/products/api/get_products.php', (_products, status) => {
  products = _products
  loadProductsList(_products)
  $('#search-product').keyup(function () {
    let productsSought = products.filter(product => product.ref.trim().toLowerCase().includes($(this).val()) || product.name.trim().toLowerCase().includes($(this).val()))
    loadProductsList(productsSought)
    /* toggle all checkboxes in group */
    selectAll()
  })
  $('.add').click(function () {
    $('.all').prop("checked", false);
    var items = $("#list1 input:checked:not('.all')");
    var n = items.length;
    if (n > 0) {
      if (n > 1) {
        // si se desea colocar la misma cantidad para todos los productos
        $.confirm({
          title: 'EQUOTE',
          content: '¿Desea Cotizar una Sola Cantidad para los productos Seleccionados?',
          buttons: {
            SI: function () {
              // pide una sola cantidad para todos los productos
              $.confirm({
                title: 'EQUOTE',
                content: '' +
                  '<form class="formName">' +
                  '<div class="form-group">' +
                  '<label>Ingrese la cantidad para los productos seleccionados:</label>' +
                  '<input type="number" class="name form-control" required />' +
                  '</div>' +
                  '</form>',
                buttons: {
                  formSubmit: {
                    text: 'Enviar',
                    btnClass: 'btn-blue',
                    action: function () {

                      var quantity = this.$content.find('.name').val();
                      if (!quantity) {
                        $.alert('Ingresa la cantidad de productos a costear');
                        return false;
                      } else if (quantity < 1) {
                        $.alert('Ingresa una cantidad mayor a 0');
                        return false;
                      }
                      else {
                        items.each(function (idx, item) {
                          var choice = $(item);
                          choice.prop("checked", false);
                          choice.parent().appendTo("#list2");
                          choice.parent().append(`<span class="pull-right quantity">${quantity}</span>`)
                        });
                      }
                    }
                  },
                  cancelar: function () {
                    //close
                  },
                },
                onContentReady: function () {
                  this.$content.find('.name')[0].focus()
                  // bind to events
                  var jc = this;
                  this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                  });
                }
              })
            },
            No: function () {
              // pide la cantidad para cada uno de los productos seleccionados
              items.each(function (idx, item) {
                var choice = $(item);
                $.confirm({
                  title: 'EQUOTE',
                  content: '' +
                    '<form class="formName">' +
                    '<div class="form-group">' +
                    `<label>Ingrese la cantidad para el producto ${choice.siblings('.product-name').text()}:</label>` +
                    '<input type="number" class="name form-control" required />' +
                    '</div>' +
                    '</form>',
                  buttons: {
                    formSubmit: {
                      text: 'Enviar',
                      btnClass: 'btn-blue',
                      action: function () {
                        this.$content.find('.name').focus()
                        var quantity = this.$content.find('.name').val();
                        if (!quantity) {
                          $.alert('Ingresa un valor');
                          return false;
                        } else if (quantity < 1) {
                          $.alert('Ingresa una cantidad mayor a 0');
                          return false;
                        } else {
                          choice.parent().append(`<span class="pull-right quantity">${quantity}</span>`)
                          choice.prop("checked", false);
                          choice.parent().appendTo("#list2");
                        }
                      }
                    },
                    cancelar: function () {
                      //close
                    },
                  },
                  onContentReady: function () {
                    this.$content.find('.name')[0].focus()
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                      // if the user submits the form by pressing enter in the field.
                      e.preventDefault();
                      jc.$$formSubmit.trigger('click'); // reference the button and click it

                    });
                  }
                });
              })
            }
          }
        })
      } else {
        // si solo se escoge uno
        items.each(function (idx, item) {
          var choice = $(item);
          $.confirm({
            title: 'EQUOTE',
            content: '' +
              '<form class="formName">' +
              '<div class="form-group">' +
              `<label>Ingrese la cantidad para el producto ${choice.siblings('.product-name').text()}:</label>` +
              '<input type="number" class="name form-control" required />' +
              '</div>' +
              '</form>',
            buttons: {
              formSubmit: {
                text: 'Enviar',
                btnClass: 'btn-blue',
                action: function () {
                  this.$content.find('.name').focus()
                  var quantity = this.$content.find('.name').val();
                  if (!quantity) {
                    $.alert('provide a valid name');
                    return false;
                  }
                  if (quantity < 1) {
                    $.alert('Ingresa una cantidad mayor a 0');
                    return false;
                  }
                  choice.prop("checked", false);
                  choice.parent().appendTo("#list2");
                  choice.parent().append(`<span class="pull-right quantity">${quantity}</span>`)
                }
              },
              cancelar: function () {
                //close
              },
            },
            onContentReady: function () {
              this.$content.find('.name')[0].focus()
              // bind to events
              var jc = this;
              this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it

              });
            }
          });
        });
      }
    } else {
      $.alert("Escoge al menos un elemento de la lista", "EQUOTE");
    }
  });

  $('.remove').click(function () {
    $('.all').prop("checked", false);
    var items = $("#list2 input:checked:not('.all')");
    items.each(function (idx, item) {
      var choice = $(item);
      choice.prop("checked", false);
      choice.parent().appendTo("#list1");
      choice.siblings('.quantity').remove()
      console.log(choice.siblings('.quantity'))
    });
    if (items.length == 0) {
      $.alert(
        'Selecciona al menos un elemento para quitar', 'EQUOTE'
      )
    }
  });

  selectAll()

  $('[type=checkbox]').click(function (e) {
    /* e.stopPropagation(); */
  });

 

  $("#list1 .list-group a").on("click", function (e) {
    $this = $(this)
    if($this.parent().attr('id') == 'list1'){
      clicks++;  //count clicks

      if (clicks === 1) {
  
        timer = setTimeout(function () {
          var $checkbox = $this.find("[type=checkbox]");
          if ($checkbox.is(":checked")) {
            $checkbox.prop("checked", false);
          } else {
            $checkbox.prop("checked", true);
          }
  
          if ($checkbox.hasClass("all")) {
            $checkbox.trigger('click');
          }
          clicks = 0;             //after action performed, reset counter
  
        }, DELAY);
  
      } else {
        clearTimeout(timer);    //prevent single-click action
        clicks = 0;             //after action performed, reset counter
  
        $this.appendTo("#list2");
        $this.append(`<span class="pull-right quantity">1</span>`)
      }  
    }
    

  })
    .on("dblclick", function (e) {
      e.preventDefault();  //cancel system double-click event
    });
})


// caundo se manda a procesar
$('#btn-procesar').click(function () {
  var items = $("#list2 input:not('.all')");
  productsToCost = []
  if (items.length > 0) {
    items.each(function (_indx, item) {
      let choice = $(item)
      product = {
        id: choice.siblings('.id-product').text(),
        quantity: choice.siblings('.quantity').text()
      }
      productsToCost.push(product)
    })
    sessionStorage.setItem('products',JSON.stringify(productsToCost))
    location.href = 'report.php'
  } else {
    $.alert("Escoge al menos un elemento de la lista para cotizar", "EQUOTE");
  }
})

if ($(window).width() <= 400) {
  $('.add i').removeClass('nc-minimal-right')
  $('.remove i').removeClass('nc-minimal-left')
  $('.add i').addClass('nc-minimal-down')
  $('.remove i').addClass('nc-minimal-up')
}

loadLines()
function loadLines() {
  $.get('/app/products/api/get_lines.php', (data, status) => {
    $('#select-lineas').html('<option disabled selected>- - Seleccione Linea - -</option>')
    selectAll()
    data.forEach(line => {
      $('#select-lineas').append(`<option value="${line.id}">${line.name}</option>`)
    })
    $('#select-lineas').append(`<option value="all">Todos</option>`)
  })
}

function loadProductsList(products) {
  $('#list1').html('<a href="#" class="list-group-item active"><span class="pull-left title">Referencia</span><input title="toggle all" type="checkbox" class="all pull-right"><span class="pull-right title mar">Seleccion De Productos</span></a>')
  products.forEach((product) => {
    $('#list1').append(`<a href="#" class="list-group-item"><span class="ref-product pull-left text-capitalize">${product.ref}</span>  <span class="product-name text-lowercase" title="${product.name}">${product.name.length > 30 ? product.name.substring(0, 30) + " ..." : product.name}</span> <span class="id-product">${product.id}</span><input type="checkbox" class="pull-right"></a>`)
  })
  sizeList()
  selectAll()
}

function sizeList() {
  $('.product-name').each(function () {
    if ($(this).height() > 18) {
      while ($(this).height() > 18) {
        $(this).html($(this).html().substring(0, $(this).html().length - 7) + " ...")
      }
      $(this).html($(this).html().substring(0, $(this).html().length - 7) + " ...")
    }
  })
}

function sizeList2() {
  $('#list2 .product-name').each(function () {
    if ($(this).height() > 18) {
      while ($(this).height() > 18) {
        $(this).html($(this).html().substring(0, $(this).html().length - 7) + " ...")
      }
      $(this).html($(this).html().substring(0, $(this).html().length - 7) + " ...")
    }
  })
}
$('#select-lineas').change(function () {
  if ($(this).val() == 'all') {
    $.get('/app/products/api/get_products.php', (_products, status) => {
      products = _products
      loadProductsList(products)
      selectAll()
    })
  } else {
    $.get('/app/products/api/get_products_line.php', {
      id: $(this).val()
    }, (data, status) => {
      products = data
      loadProductsList(products)
      selectAll()
    })
  }
})

function selectAll() {
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
}

var DELAY = 700, clicks = 0, timer = null;

