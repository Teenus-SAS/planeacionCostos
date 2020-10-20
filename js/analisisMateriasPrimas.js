var fsima ;
//variable donde se guarda la suma del valor de todos los materiales de un producto
var valorTotalMateriales=0;
//Variable que guarda el valor total multiplicado por la cantidad de ordenes de producto
var total = 0;
var materialSeleccionado=""
//Se ejecuta al cargar el dom
var ahorroMaterial
var creada=false
var arrPorcentaje = new Array();
$(document).ready(function(){
    $("#input-UnidadesFMes").attr('disabled','disabled');
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
          var ventana_ancho = $(window).width();
          var ventana_alto = $(window).height();
          alert(ventana_ancho);
          alert(ventana_alto);
          $("#input-UnidadesFMes").removeAttr('disabled');
          $("#input-AhorroMes").val(formatCurrency("es-CO","COP",2,0))
          $("#input-AhorroAño").val(formatCurrency("es-CO","COP",2,0))
          arrPorcentaje= new Array()
          if(creada ==true){
          $("#tableAnalisisMateriaPrimaAM").dataTable().fnDestroy();
          $("#tableAnalisisMateriaPrimaAM").empty()
          $("#tableAnalisisMateriaPrimaAM").append('<thead class="text-primary"><th>Materia</th><th>Precio Actual</th>'+
          '<th>Precio Negociar</th><th>Costo total</th><th>Costo mes </th><th>Costo proyectado </th></br></thead><tr></tr>'+
          '<tbody></tbody>')
         
          }
          
            //se reinicia la variable que guardara el valor total
            valorTotalMateriales=0;
            //Se captura el id del producto seleccionado
            let productSelected = data.filter(product => product.id == $(this).val())[0]
            let idInputProducto = $('#input-productoA').val();
            //cambia el titulo de la tabla
            $('#Titulo').empty();
            $('#Titulo').append(productSelected.name);
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
                $("#Costo_total").val(formatCurrency("es-CO","COP",2,total))
                //Si el llamado es exitoso carga los datos en el input de los materiales
                if (status == 'success') {
                    creada=true
                    let productSelected = data.filter(product => product.id == $(this).val())[0]
                    $('#inputProductoA').val(productSelected.id)
                    $('#title-products').text(productSelected.name)
                    $('#input-materiaAM option[selected]').attr('selected', false)
                    $('#input-materiaAM option[disabled]').attr('selected', 'selected')
                    $tableProductoMateriaA.api().ajax.url(`api/get_materialesA.php?dataTable=true&id=${productSelected.id}`)
                    $tableProductoMateriaA.api().ajax.reload()
                    //Arreglo que guarda los datos de costo y descripcion de los materiales para ordenarlos
                    let arregloMateriales = new Array();
                   
                    for (var i=0; i<_material.length;i++){
                    arregloMateriales[i] = [(_material[i].material.cost * _material[i].quantity),_material[i].material.description,_material[i].material.cost,_material[i].id]
                    }
                    //variables para determinar y comparar el 80 % del costo de los productos
                    var sumatoria=0;
                    var porcentaje = (80*valorTotalMateriales)/100
                    //Ordena el arreglo 
                    arregloMateriales=arregloMateriales.sort((a, b) => b[0] - a[0])
                    //Ciclo para validar los materiales que ocupan el 80% del costo del producto
                    console.log(arregloMateriales)
                    if(arregloMateriales!=0){
                    for (var i=0; i<arregloMateriales.length;i++){
                    sumatoria+=arregloMateriales[i][0]
                    arrPorcentaje[i]=arregloMateriales[i]
                    if(sumatoria>=porcentaje)
                      break
                    }}
                    console.log(arrPorcentaje)
                    $tableProductoMateriaAM = $('#tableAnalisisMateriaPrimaAM').dataTable({
                      bFilter: false, bInfo: false,"bPaginate": false,
                      responsive: true,
                      info: false,
                      data: arrPorcentaje,
                      columns: [
                          { data:'1', "defaultContent": '<p >Sin registro </p>'},
                          { data:'2', "defaultContent": '<p >Sin registro </p>',render: (data, type, row) => {return formatCurrency("es-CO","COP",2,data)}},
                          {
                            data: '0',
                            "defaultContent": '<p >Sin registro </p>',
                            render: (data, type, row) => {
                              if(data!=null)
                              return '<input type="number" class="form-control col-md-8"  style="margin-left:20%" value="0"  id="input-'+row[3]+'">'
                              } 
                          },
                          {data:'0',render: (data, type, row) => {return formatCurrency("es-CO","COP",2,data)}},
                          {data:'0',
                          render: (data, type, row) => {
                            if(data!=null){
                              return formatCurrency("es-CO","COP",2,data*$("#input-UnidadesFMes").val())
                            }
                          }
                          },
                          {data:'1',
                           render: (data, type, row) => {
                            if(data!=null){
                              if(fsima==false){
                                return 0;
                              }
                              else{
                                return formatCurrency("es-CO","COP",2,$("#input-"+row[3]).val()*$("#input-UnidadesFMes").val())
                              }
                          }
                          }}
                      ]
                  });
                  $tableProductoMateriaAM.width('100%')
                 
                    
                }
            })
            


        })
        $( "#btnValidarNuevoPrecio" ).click(function() {
          arr2=new Array()
          var ahorroMes=0
          console.log(arrPorcentaje)
          for(var i = 0 ; i<arrPorcentaje.length; i++){
            arr2[i]=arrPorcentaje[i]
            if(arr2[i].length==4){
              if($("#input-"+arrPorcentaje[i][3]).val()==null){
                arr2[i].push(0)
              }
              else{
                arr2[i].push($("#input-"+arrPorcentaje[i][3]).val())
            }
          }
            else{
              arr2[i].pop()
              arr2[i].push($("#input-"+arrPorcentaje[i][3]).val())
            }
          }
          console.log(arr2)
          $("#tableAnalisisMateriaPrimaAM").dataTable().fnDestroy();
          $("#tableAnalisisMateriaPrimaAM").empty()
          $("#tableAnalisisMateriaPrimaAM").append('<thead class="text-primary"><th>Materia</th><th>Precio Actual</th>'+
          '<th>Precio Negociar</th><th>Costo total</th><th>Costo mes </th><th>Costo proyectado </th></br></thead><tr></tr>'+
          '<tbody></tbody> ')
          $tableProductoMateriaAM = $('#tableAnalisisMateriaPrimaAM').dataTable({
            bFilter: false, bInfo: false,"bPaginate": false,
            responsive: true,
            info: false,
            data: arr2,
            columns: [
                { data:'1', "defaultContent": '<p >Sin registro </p>'},
                { data:'2', "defaultContent": '<p >Sin registro </p>', render: (data, type, row) => {return formatCurrency("es-CO","COP",2,data)}},
                {
                  data: '3',
                  render: (data, type, row) => {
                    if(data!=null)
                    return '<input type="number" class="form-control col-md-8"  style="margin-left:20%" value='+row[4]+'  id="input-'+row[3]+'">'
                    else{
                      '<input type="number" class="form-control col-md-8"  style="margin-left:20%" value=0  id="input-'+row[3]+'">'
                    }  
                  } 
                },
                {data:'0',render: (data, type, row) => {return formatCurrency("es-CO","COP",2,data)}},
                {data:'0',
                render: (data, type, row) => {
                  if(data!=null){
                    return formatCurrency("es-CO","COP",2,data*$("#input-UnidadesFMes").val())
                  }
                }
                },
                {data:'4',
                 render: (data, type, row) => {

                      return formatCurrency("es-CO","COP",2,data*$("#input-UnidadesFMes").val())

                }
                }
            ]
        });
        $tableProductoMateriaAM.width('100%')
        for(var i=0 ; i<arr2.length; i++){
          if(arr2[i][4]==0){
            ahorroMes = 0
            break
          }
          ahorroMes+=arr2[i][2]-arr2[i][4]
        }
        
          $("#input-AhorroMes").val(formatCurrency("es-CO","COP",2,ahorroMes*$("#input-UnidadesFMes").val()))
          $("#input-AhorroAño").val(formatCurrency("es-CO","COP",2,ahorroMes*$("#input-UnidadesFMes").val()*12))
        
        });
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
            $("#Costo_total").val(formatCurrency("es-CO","COP",2,total))
          }); 
    
    }) 
})
//variable que guardara la cantidad del producto para dividirlo por el valor por kilo 
var cant
//inicializacion de la tabla de materias primas por orden de produccion
var $tableProductoMateriaA = $('#tableAnalisisMateriaPrima').dataTable({
  bFilter: false, bInfo: false,"bPaginate": false,  
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
        return formatCurrency("es-CO","COP",2,$.number(data)*row.quantity)
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
//Funcion para convertir un numero a formato de moneda
function formatCurrency (locales, currency, fractionDigits, number) {
    var formatted = new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }