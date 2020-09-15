//variable donde se guarda la suma del valor de todos los materiales de un producto
var valorTotalMateriales=0;
//Variable que guarda el valor total multiplicado por la cantidad de ordenes de producto
var total = 0;
var materialSeleccionado=""
//Se ejecuta al cargar el dom
var ahorroMaterial
$(document).ready(function(){
    //Agrega al select de los productos
    $('#input-productoA').append('<option selected disabled>Seleccione un producto</option>')
    //llamado de los productos de la base de datos
    $.get('api/get_productosA.php?materials', (data, status, xhr) => {
        productsJSON = data
        //Si el llamado es exitoso carga los datos en el input de los productos
        if (status == 'success') {
            data.forEach((product) => {
              $('#input-productoA').append(`<option value="${product.id}">${product.name}</option>`)
            })
        }
        //se activa al selecionar un producto
        $('#input-productoA').change(function () {
            //se reinicia la variable que guardara el valor total
            valorTotalMateriales=0;
            //Se captura el id del producto seleccionado
            let idInputProducto = $('#input-productoA').val();
            //Se vacia el input de los materiales
            $('#input-materiaAM').empty();
            $('#input-materiaAM').append('<option selected disabled>Selecione un Material</option>')
            //Llamado de los materiales de la base de datos dependiendo del producto
            $.get('api/get_materialesA.php?id='+idInputProducto, (_material, status, xhr) => {
                materialsJSON = _material
                console.log(_material);
                //asigna a la variable creada arriba la suma del valor de los productos
                for (var i=0; i<_material.length;i++){
                    valorTotalMateriales += _material[i].quantity*_material[i].material.cost
                }
                let inputCantidadOP = $('#input-cantidadOP').val();
                total = valorTotalMateriales * inputCantidadOP;
                //Si el llamado es exitoso carga los datos en el input de los materiales
                if (status == 'success') {
                    _material.forEach((materials) => {
                      $('#input-materiaAM').append(`<option value="${materials.id}">${materials.material.description}</option>`)
                    })
                    let productSelected = data.filter(product => product.id == $(this).val())[0]
                    $('#inputProductoA').val(productSelected.id)
                    $('#title-products').text(productSelected.name)
                    $('#input-materiaAM option[selected]').attr('selected', false)
                    $('#input-materiaAM option[disabled]').attr('selected', 'selected')
                    $tableProductoMateriaAM.api().ajax.url(`api/get_materialesA.php?dataTable=true&id=${productSelected.id}`)
                    $tableProductoMateriaAM.api().ajax.reload()
                    $tableProductoMateriaA.api().ajax.url(`api/get_materialesA.php?dataTable=true&id=${productSelected.id}`)
                    $tableProductoMateriaA.api().ajax.reload()
                    $tableProductoMateriaMes.api().ajax.url(`api/get_materialesA.php?dataTable=true&id=${productSelected.id}`)
                    $tableProductoMateriaMes.api().ajax.reload()
                    

                }
            })
        })
        //se activa al selecionar un material
        $('#input-materiaAM').change(function () {
            //Se captura el id del producto seleccionado
            let idInputProducto = $('#input-productoA').val();
            //Llamado de los materiales de la base de datos dependiendo del producto
            $.get('api/get_materialesA.php?id='+idInputProducto, (_material, status, xhr) => {
                materialsJSON = _material
                // Se captura el id del material seleccionado
                let materialSelected = _material.filter(material => material.id == $(this).val())[0]
                //Se asigna la cantidad del material a un input 
                $('#input-cantidadM').val(parseFloat(materialSelected.quantity))
                $('#input-Valor').val(parseFloat(materialSelected.material.cost))
                materialSeleccionado = materialSelected.material.description
                
            })
        })
    })
    //evento al dar click al boton de vbalidar las ordenes de produccion
    $( "#btnValidar" ).click(function() {
        let idInputProducto = $('#input-productoA').val();
        //Se consultan los productos de la base de datos
        $.get('api/get_materialesA.php?id='+idInputProducto, (_material, status, xhr) => {
            materialsJSON = _material
            //Se cra un arreglo que guardara los productos que sumen el 80%
            let arrPorcentaje=[];
            //Se reinicia el valor de los materiales
            valorTotalMateriales = 0;
            //carga el valor de los materiales
            for (var i=0; i<_material.length;i++){
              valorTotalMateriales += _material[i].quantity*_material[i].material.cost
            }
            //Recarga la tabla de ordenes de produccion
            $tableProductoMateriaA.api().ajax.reload()
            //Guarda el numero de ordenes de produccion
            var inputCantidadOP = $('#input-cantidadOP').val()
            //multiplica  el valor de los materiales por el numero de ordenes de produccion
            total = valorTotalMateriales * inputCantidadOP;
            //Arreglo que guarda los datos de costo y descripcion de los materiales para ordenarlos
            let arregloMateriales = new Array();
            for (var i=0; i<_material.length;i++){
               arregloMateriales[i] = [(_material[i].material.cost * _material[i].quantity)*inputCantidadOP,_material[i].material.description]
            }
            //variables para determinar y comparar el 80 % del costo de los productos
            var sumatoria=0;
            var porcentaje = (80*total)/100
            //Ordena el arreglo 
            arregloMateriales=arregloMateriales.sort((a, b) => b[0] - a[0])
            //Ciclo para validar los materiales que ocupan el 80% del costo del producto
            for (var i=0; i<3;i++){
              sumatoria+=arregloMateriales[i][0]
              arrPorcentaje[i]=arregloMateriales[i]
             if(sumatoria>=porcentaje)
              break
            }
            //carga esos materiales en pantalla
            $('#cargaValor').empty();
            $('#cargaValor').append('<div class="card py-2" id="MaterialesD"><h5>Materiales de Mayor gasto</h5></div>')
            for (var i=0; i<arrPorcentaje.length; i++){
            $('#MaterialesD').append('<div class="form-group row my-2"> <label class="col-md-3 col-3 col-form-label px-0  ml-5">'+arrPorcentaje[i][1]+': </label><label class="col-md-3 col-3 col-form-label px-0  ml-5">'+formatCurrency("es-CO","COP",2,arrPorcentaje[i][0])+'</label><label class="col-md-3 col-3 col-form-label px-0">'+(arrPorcentaje[i][0]*100/total).toFixed(5)+' % </labe></div>')
            }
          }); 
    
    })
    $( "#btnValidarA" ).click(function() {
        let idInputProducto = $('#input-productoA').val();
        ahorroMateria=0;
        //Se consultan los productos de la base de datos
        $.get('api/get_materialesA.php?id='+idInputProducto, (_material, status, xhr) => {
          valorTotalMateriales = 0
          materialsJSON = _material
          let materialSelected = _material.filter(material => material.id == $("#input-materiaAM").val())[0]
          
          for (var i=0; i<_material.length;i++){
            if(_material[i].material.description===materialSelected.material.description){
            ahorroMaterial=_material[i].quantity*_material[i].material.cost
            _material[i].quantity=$('#input-cantidadM').val();
            _material[i].material.cost=$('#input-Valor').val();
            ahorroMaterial-=_material[i].quantity*_material[i].material.cost
            valorTotalMateriales += _material[i].quantity*_material[i].material.cost
            let pesoLote=$("#input-pesoLote").val();
            let unidadesLote=$("#input-valorLote").val()
            if(pesoLote!=0){
              $('#cargaAhorro').empty();
              $('#cargaAhorro').append('<div class="card py-2" id="MaterialesAhorro"><h5>Ahorro Mensual</h5></div>')
              $('#MaterialesAhorro').append('<div class="form-group row my-2"> <label class="col-md-3 col-3 col-form-label px-0  ml-5">'+_material[i].material.description+': </label><label class="col-md-3 col-3 col-form-label px-0  ml-5">'+formatCurrency("es-CO","COP",2,(ahorroMaterial)*(pesoLote/unidadesLote))+'</label></div>')
              $('#MaterialesAhorro').append('<div class="form-group row my-2"> <label class="col-md-3 col-3 col-form-label px-0  ml-5">Valor total del producto: </label><label class="col-md-3 col-3 col-form-label px-0  ml-5">'+formatCurrency("es-CO","COP",2, valorTotalMateriales*(pesoLote/unidadesLote))+'</label></div>')
              console.log((ahorroMaterial)*(pesoLote/unidadesLote))
            }
            else{
              $('#cargaAhorro').empty();
              $('#cargaAhorro').append('<div class="card py-2" id="MaterialesAhorro"><h5>Ahorro Mensual</h5></div>')
              $('#MaterialesAhorro').append('<div class="form-group row my-2"> <label class="col-md-3 col-3 col-form-label px-0  ml-5">'+_material[i].material.description+': </label><label class="col-md-3 col-3 col-form-label px-0  ml-5">'+formatCurrency("es-CO","COP",2,(ahorroMaterial)*(unidadesLote))+'</label></div>')
              
              console.log((ahorroMaterial)*unidadesLote)
            }
            
            
            }
            else {
            valorTotalMateriales += _material[i].quantity*_material[i].material.cost
          }
        }
        })
        
        $tableProductoMateriaAM.api().ajax.reload()
        
 
      }); 
      $( "#btnValidarMes" ).click(function() {
        $tableProductoMateriaMes.api().ajax.reload()
      });
    
})
//variable que guardara la cantidad del producto para dividirlo por el valor por kilo 
var cant
//inicializacion de la tabla de materias primas por orden de produccion
var $tableProductoMateriaA = $('#tableAnalisisMateriaPrima').dataTable({
    language: {
      url: "/vendor/dataTables/Spanish.json",
      "emptyTable":"My Custom Message On Empty Table"
    },
    responsive: true,
    ajax: {
      url: 'api/get_materialesA.php?dataTable=true',
      dataSrc: 'data', 
    },
    columns: [{
      data: 'material.description',
      "defaultContent": '<p >Sin registro </p>'
    },
    {
      data: 'quantity',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        cant = data;
        if(data!=null){
        if(parseFloat(data) < 1){
          let sum = 0
          for (let index = 0; index < data.toString().length; index++) {
            sum += data.toString().charAt(index) == '0' ? 1 : 0
          }
          sum += 1
          return $.number(data, sum, ',', '.')
        }else{
          return $.number(data, 2, ',', '.')
        }
      }
      else return data
      }
    }, {
      data: 'material.cost' ,
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        if(data!=null)
        return formatCurrency("es-CO","COP",2,$.number(data)*cant)
      }
    },
    {
      data: 'quantity',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        if(data!=null){
        let OP=$("#input-cantidadOP").val();
        if(parseFloat(data) < 1){
          let sum = 0
          for (let index = 0; index < data.toString().length; index++) {
            sum += data.toString().charAt(index) == '0' ? 1 : 0
          }
          sum += 1
          return $.number(data * OP, sum, ',', '.')
        }else{
          return $.number(data * OP, 2, ',', '.')
        }}
        else return data
      } 
  
    },
    {
      data: 'material.cost',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
      if(data!=null){
      let OP=$("#input-cantidadOP").val();
      let mul=(parseFloat(data)*cant)*OP;
      return formatCurrency("es-CO","COP",2,$.number(mul));
    }
      else return data
      }
    },
    {
      data:'material.cost',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
      if(data!=null){  
      let OP=$("#input-cantidadOP").val();
      let mul=(((parseFloat(data)*cant)*OP)*100)/total;
      return mul.toFixed(5)+" %"
      }
      }
    }, 
    ], "drawCallback":function(){
        var api = this.api();
        let OP=$("#input-cantidadOP").val();
        $(api.column(0).footer()).html(
          'Total: '
    
        )
        $(api.column(4).footer()).html(
          formatCurrency("es-CO","COP",2,total)
        )
      }
    
    
  })
  
$tableProductoMateriaA.width('100%')
$tableProductoMateriaA.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})


var $tableProductoMateriaAM = $('#tableAnalisisMateriaPrimaAM').dataTable({
    language: {
      url: "/vendor/dataTables/Spanish.json",
      "emptyTable":"My Custom Message On Empty Table"
    },
    responsive: true,
    ajax: {
      url: 'api/get_materialesA.php?dataTable=true',
      dataSrc: 'data',
      
    },
    columns: [{
      data: 'material.description',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        return data
      }
  
    },
    {
      data: 'quantity',
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        if(data!=null){
        if(row.material.description ===materialSeleccionado){
          cant =$('#input-cantidadM').val();
          return cant; 
        }
        else{
        cant = data;
        if(data!=null){
        if(parseFloat(data) < 1){
          let sum = 0
          for (let index = 0; index < data.toString().length; index++) {
            sum += data.toString().charAt(index) == '0' ? 1 : 0
          }
          sum += 1
          return $.number(data, sum, ',', '.')
        }else{
          return $.number(data, 2, ',', '.')
        }
      }
      else return data
      }
    }
    }
    }, {
      data: 'material.unit',
      "defaultContent": '<p >Sin registro </p>'
      
    },
    {
      data: 'material.cost' ,
      "defaultContent": '<p >Sin registro </p>',
      render: (data, type, row) => {
        if(data!=null){
          if(row.material.description ===materialSeleccionado){
            let valor =$('#input-Valor').val();
            return formatCurrency("es-CO","COP",2,$.number(valor)*cant)
          }
          else{
          return formatCurrency("es-CO","COP",2,$.number(data)*cant)
          }
      }
      }
    },
    ],
    "drawCallback":function(){
      var api = this.api();
      let OP=$("#input-cantidadOP").val();
      $(api.column(0).footer()).html(
        'Total: '
      )
      $(api.column(3).footer()).html(
        formatCurrency("es-CO","COP",2, valorTotalMateriales)
      )
    }
    
  })
  $tableProductoMateriaAM.width('100%')
  $tableProductoMateriaAM.on('click', 'tr', function () {
        $(this).toggleClass('selected');
    })
  var unidadesCompletas=0;
  var $tableProductoMateriaMes= $('#tableAnalisisMateriaPrimaMes').dataTable({
        language: {
          url: "/vendor/dataTables/Spanish.json",
          "emptyTable":"My Custom Message On Empty Table"
        },
        responsive: true,
        ajax: {
          url: 'api/get_materialesA.php?dataTable=true',
          dataSrc: 'data',
          
        },
        columns: [{
          data: 'material.description',
          "defaultContent": '<p >Sin registro </p>'
        },
        {
          data: 'quantity',
          visible: false,
          "defaultContent": '<p >Sin registro </p>',
          render: (data, type, row) => {
            cant = data;
            if(data!=null){
            if(parseFloat(data) < 1){
              let sum = 0
              for (let index = 0; index < data.toString().length; index++) {
                sum += data.toString().charAt(index) == '0' ? 1 : 0
              }
              sum += 1
              return $.number(data, sum, ',', '.')
            }else{
              return $.number(data, 2, ',', '.')
            }
          }
          else return data
          }
        }, {
          data: 'material.cost' ,
          "defaultContent": '<p >Sin registro </p>',
          render: (data, type, row) => {
            //data:data*10;
            if(data!=null)
            return formatCurrency("es-CO","COP",2,$.number(data)*cant)
          }
          
        },
        
        {
          data: 'material.cost',
          "defaultContent": '<p >Sin registro </p>',
          render: (data, type, row) => {
          if(data!=null){
          let pesoLote=$("#input-pesoLote").val();
          let unidadesLote=$("#input-valorLote").val()
          if(pesoLote!=0){
          let unidadesTotales=pesoLote/unidadesLote;
          unidadesCompletas=unidadesTotales;
          return formatCurrency("es-CO","COP",2,$.number((data*cant)*unidadesTotales));
          }
          else{
            unidadesCompletas=unidadesLote
            return formatCurrency("es-CO","COP",2,$.number((data*cant)*unidadesLote));
          }
        }
          else return data
          }
        },
        {
          data:'material.cost',
          "defaultContent": '<p >Sin registro </p>',
          render: (data, type, row) => {
          if(data!=null){  
          let mul=(((parseFloat(data)*cant))*100)/valorTotalMateriales;
          return mul.toFixed(5)+" %"
          }
          }
        }, 
        ],
        "drawCallback":function(){
          let pesoLote=$("#input-pesoLote").val();
          let unidadesLote=$("#input-valorLote").val()
          let unidadesTotales=0;
          unidadesTotales=pesoLote/unidadesLote;
          var api = this.api();
          let OP=$("#input-cantidadOP").val();
          $(api.column(3).footer()).html(
            formatCurrency("es-CO","COP",2,valorTotalMateriales*unidadesCompletas)
      
          )
        }
        
      })
      
      $tableProductoMateriaMes.width('100%')
      $tableProductoMateriaMes.on('click', 'tr', function () {
        $(this).toggleClass('selected');
      })

//Funcion para convertir un numero a formato de moneda
function formatCurrency (locales, currency, fractionDigits, number) {
    var formatted = new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }