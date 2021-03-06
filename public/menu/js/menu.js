// Se crea el archivo de configuracion para realizar la autenticacion por medio de firebase 
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBjasCFXiGf7JZAdqlG_lo-7XMwLwUJw0E",
    authDomain: "delifast-7576c.firebaseapp.com",
    databaseURL: "https://delifast-7576c.firebaseio.com",
    projectId: "delifast-7576c",
    storageBucket: "delifast-7576c.appspot.com",
    messagingSenderId: "415819035666",
    appId: "1:415819035666:web:9300f229e79d85c0f6d4cb",
    measurementId: "G-ESS36GVJTN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  numero_almuerzos=0;
  numero_platos_carta=0;


VerificarExistenciarestaurante()
VerificarDia()

function VerificarExistenciarestaurante(){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryRestaurante = urlParams.get('restaurante');
    const QueryMesa=urlParams.get('mesa');
    if (QueryMesa !== null){
        console.log(QueryMesa)
    }
    console.log(QueryMesa)
    const dia_actual=VerificarDia()
    const dias_semana = ["Lunes", "Martes", "Miercoles","Jueves","Viernes","Sábado","Domingo"];
    var consulta_restaurantes=db.collection('restaurantes').where("nombreRestaurante","==",QueryRestaurante)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            $(".user-items").css("display","none")
            $(".float").css("display","none")

            swal({
                title:"Advertencia",
                  text:"No es un restaurante válido",
                  icon:"error"
              }).then(function(){
                window.location = 'https://almuerza.co/'
              })
        }
        else{

            $("#button_pedir").css("display","block")



            querySnapshot.forEach(function(doc){

                
                var nombreRestaurante=doc.data().nombre
                uid_restaurante=doc.data().uid
                var direccion_restaurante=doc.data().dir
                var estado=doc.data().estado
                var fechaVencimiento=doc.data().fechaVencimiento
                horaApertura=doc.data().horaApertura
                horaCierre=doc.data().horaCierre

                HorarioRestaurante(horaApertura,horaCierre)

                VerificarPago(estado,fechaVencimiento)
                // Colocar el logo del restaurante si existe 
                LocateLogo(uid_restaurante,nombreRestaurante,direccion_restaurante)

                var vista_menu=db.collection('menu').where("uid_restaurante","==",uid_restaurante)
                vista_menu.get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){
                        console.log("No hay un menu creado")
                    }
                    else{

                        querySnapshot.forEach(function(doc){
                            const categoria=doc.data().categoria
                            const nombre=doc.data().nombre
                            const descripcion=doc.data().descripcion
                            const estado= doc.data().estado
                            var categoriaFix = categoria.replace(/\s/g, '');
                            var dias= doc.data().dia
        
                            

                        if(dias[dia_actual]===true && estado==='activo'){    

                            if($("#" + categoriaFix).length == 0) {
                                //si no existe esa categoria debe crearse
                             if (categoriaFix === 'Entradas' || categoriaFix === 'Principio'){
                                 console.log("entradas o principio menu")
                                // $(`
                                // <div class="col-12 col-md-6 clase-categoria" id="${categoriaFix}">
                                //         <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                //         <h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                //         <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>
                                // </div>`).insertAfter( "#tituloAlmuerzos" );


                                
                                $(`

                                <h5 class="categoria-name mt-3 ">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu text-capitalize">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                </div>
                                
                                `).insertAfter( ".centro-restaurante-first" );
    
                             }
                             else if(categoriaFix === 'PlatoFuerte' || categoriaFix === 'Proteinas' || categoriaFix === 'Ensaladas'){
                               
                                $(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu text-capitalize">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                  </div>
                                
                                `).insertAfter( ".centro-restaurante-second" );

                             }

                             else{


                                $(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu text-capitalize">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                  </div>
                                
                                `).insertAfter(".centro-restaurante-tercero")
                             }
                              }
            
                            else{
                                //   $(`#${categoriaFix}`).append(`<h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                //                                         <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>`)

                                $(`#${categoriaFix}`).append(`   

                                <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu text-capitalize">${nombre}</h5>
                                <p class="card-text">${descripcion}</p>   
                                
                                `)
                              }
                            }


                        })
  
                    }
                })

                var consulta_precio=db.collection('restaurantes').where("uid","==",uid_restaurante)
                consulta_precio.get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        precio=doc.data().precio
                        precioDomicilio=doc.data().precioDomicilio
                     

                        $(".precio-restaurant").append(` $ ${precio}`)
                        $(".precio-restaurant-domicilio").append(` $ ${precioDomicilio}`)


                    })
                })




                


                
  
            })
        }

        var vista_carta=db.collection('carta').where("uid_restaurante","==",uid_restaurante)
        vista_carta.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                console.log("No hay productos de carta ")
            }
            else{
               $(`<h5 class="title-menu-carta col-12 d-flex justify-content-center  mt-5">Carta del restaurante <i class="material-icons icon">restaurant </i></h5>`).insertBefore(".centro-restaurante-first-carta")
                querySnapshot.forEach(function(doc){
                    const categoria=doc.data().categoria
                    const nombre=doc.data().nombre
                    const descripcion=doc.data().descripcion
                    const precio= doc.data().precio
                    const estado= doc.data().estado
                   
                    var categoriaFix = categoria.replace(/\s/g, '');
    
                    if(estado==='activo'){  
                        if($(`#${categoriaFix}Carta`).length == 0) {
                            //si no existe esa categoria debe crearse
                           
                            if (categoriaFix === 'Entradas' || categoriaFix === 'Principio'){
                                console.log("entrada o principio")

                                $(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                
                                    <div class="card-body" id="${categoriaFix}Carta">
                                        <div class="row" style=" height:45px">
                                            <h5 class="card-title  platoMenu nombreEnCarta col-6 "id="${doc.id}" > <p class=" card-title-pretty d-inline-flex text-capitalize">${nombre}</p> </h5>
                                            <div class="card-text col-6 text-center" ><p class="mt-2 precioEnCarta d-inline-flex" >${precio}</p></div>
                                        </div>

                                        <p class="card-text ">${descripcion}</p>

                                    </div> 

                                    
                                </div>
                                
                                `).insertAfter( ".centro-restaurante-first-carta" );

                                

                            }
                            else if(categoriaFix === 'PlatoFuerte'){
                             
                               $(`

                               <h5 class="categoria-name mt-3">${categoria}</h5>
                               <div class="card shadow" >
                                    <div class="card-body" id="${categoriaFix}Carta">
                                        <div class="row" style=" height:45px">
                                            <h5 class="card-title  platoMenu nombreEnCarta col-6 "id="${doc.id}" > <p class=" card-title-pretty d-inline-flex text-capitalize">${nombre}</p> </h5>
                                            <div class="card-text col-6 text-center" ><p class="mt-2 precioEnCarta d-inline-flex" >${precio}</p></div>
                                        </div>

                                    <p class="card-text ">${descripcion}</p>
                                    
                                    </div> 
                                </div>
                               
                               `).insertAfter( ".centro-restaurante-second-carta" );

                            }
                            else{


                                $(".centro-restaurante").append(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                    <div class="card-body" id="${categoriaFix}Carta">
                                        <div class="row" style=" height:45px">
                                            <h5 class="card-title  platoMenu nombreEnCarta col-6 "id="${doc.id}" > <p class=" card-title-pretty d-inline-flex text-capitalize">${nombre}</p> </h5>
                                            <div class="card-text col-6 text-center" ><p class="mt-2 precioEnCarta d-inline-flex" >${precio}</p></div>
                                        </div>

                                        <p class="card-text ">${descripcion}</p>
                                        
                                    </div> 
   
                                </div>
                                
                                `)
                             }

                        }
    
                        else{
                            $(`#${categoriaFix}Carta`).append(`
                            <div class="row" style=" height:45px">
                                <h5 class="card-title  platoMenu nombreEnCarta col-6 "id="${doc.id}" > <p class=" card-title-pretty d-inline-flex text-capitalize">${nombre}</p> </h5>
                                <div class="card-text col-6 text-center" ><p class="mt-2 precioEnCarta d-inline-flex" >${precio}</p></div>
                            </div>

                            <p class="card-text ">${descripcion}</p>
                            `)
                        }
                    }
                })
    
            }
        })
        
    })
}

function VerificarDia(){
   
    today =  new Date();
    today_day_week=today.getDay();
    console.log(today_day_week);
    if(today_day_week===0){
        return 6
    }
    else{
        today_day_week=today_day_week-1
        return today_day_week
    }
}

//Cuando quieran realizar un pedido

document.getElementById("button_pedir").addEventListener("click", function(){

    //debe decidirse cual modal mostrar si el de realizar pedido o realizar atenticación, esto depende si hay usuario o no 
    var user = firebase.auth().currentUser;
    console.log(user)
    validateAdress()
    if(HorarioRestaurante(horaApertura,horaCierre)===false){
   
        swal({
			title:"Atención",
              text:`No estas en el horario de atención pide entre:
               ${horaApertura} - ${horaCierre} `,
			  icon:"warning"
		  })

    }
    else{
        if(user === null){
        $("#modal-usuario").modal()
    }

    else{
        //Debe verificarse que tipo de usuario quiere hacer un pedido, si es un restaurante redirige a restaurantes 
        // Si es un cliente abre el modal de hacer pedido 
        var consulta_clientes=db.collection('clientes').where("uid","==",user.uid)
        consulta_clientes.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                // Seguramente es un restaurante entonces redirigimos a UvR
                //Toca asegurarse que es un restaurante
                var consulta_restaurantes=db.collection('restaurantes').where("uid","==",user.uid)
                consulta_restaurantes.get()
                .then(function(querySnapshotRestaurante){
                    // si no hay restaurantes tampoco con ese ID es por que es la primera vez que entra alguien con ese id
                    if(querySnapshotRestaurante.empty){
                        console.log("debe crearse en clientes")
                        GuardarNuevoCliente(user)
                        LanzarModal(null)
                    }
                    else{
                        querySnapshotRestaurante.forEach(function(doc){
                            // en este caso si es un restaurante
                            window.location = '../UvR/UvR.html'; 
                        })

                    }

                   

                })
                
               

            }
         
            querySnapshot.forEach(function(doc){

                LanzarModal(doc.data().dir)


             })
            
        })
        }
    }
})

function LanzarModal(dir){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryMesa=urlParams.get('mesa');

    console.log(dir)
    if(dir===null && QueryMesa === null){
        address()
    }
    numero_almuerzos = 0
    numero_platos_carta = 0
    

    if(numero_almuerzos === 0){
        $(".quitarMenu").remove()
    }

    if(numero_platos_carta === 0){
        $(".quitarPlatoCarta").remove()
    }
    if(numero_platos_carta=== 0 && numero_almuerzos===0){
        console.log("debemos quitar hacer pedido")
        $(".notas").remove()
        $(".hacerpedido").css("display","none")
    }
    
        $(".modalToHide").css("display","block")
        $(".modal-body-pedido").css("display","block")
        $(".btn-group").css("display","block")
        $(".fieldTotal").remove()
        $(".atras-enviar").css("display","none")
        $(".almuerzoDia").empty()
        $(".PlatoDeLaCarta").empty()
        $(".botones-adicionar-to-hide").css("display","block")
        $(".botones-quitar-to-hide").css("display","block")
       
        $(".ModalHacerPedido").empty()
        $("#modal-pedido").modal()
       
}

//click en navigation
$(".menu-click").click(function(){
console.log("click en menu")
$(".menu-click").addClass("navigation-select")
$(".carta-click").removeClass("navigation-select")
})

$(".carta-click").click(function(){
    console.log("click en menu")
    $(".carta-click").addClass("navigation-select")
    $(".menu-click").removeClass("navigation-select")
})


function AdicionarMenu(){

    var categorias = $(".clase-categoria").map(function() { return this.id;});
    console.log(categorias)

    if(categorias.length===0){
        	swal({
			title:"Atención",
			  text:"El restaurante no tiene un menú del día para hoy",
			  icon:"error"
		  }).then(function(){
              $("#modal-pedido").modal("toggle")
          })
    }
    else{

        $(".notas").remove()
        numero_almuerzos++;
        $(".almuerzoDia").append( `       <div id="almuerzoTitle${numero_almuerzos}">
                    <label id="almuerzoTitle" class="opcionFont">Almuerzo ${numero_almuerzos} </label>
                        </div>`)
            var i;

            for (i = 0; i < categorias.length; i++) { 

                        $(".almuerzoDia").append( `
                               
                                <div class="form-group col-md-12 ${categorias[i]}${numero_almuerzos}">
                                    <label for="input${categorias[i]}">${categorias[i]} ${numero_almuerzos}</label>
                                    <select id="input${categorias[i]}" class="form-control ${categorias[i]}${numero_almuerzos}class" name="${categorias[i]}${numero_almuerzos}">
                                        <option>Ninguna</option>
                                    </select>
                                </div> `)

                                var platoPorCategoria=$(`#${categorias[i]}`).find(".platoMenu").each(function(){
                                    console.log($( this ).text())
                                    $(`.${categorias[i]}${numero_almuerzos}class`).append(`<option>${$( this ).text()}</option>`)
                                })
                     }
                     $(".PlatoDeLaCarta").append( `   <div class="form-group col-md-12 notas">
                     <label for="notas">Notas</label>
                     <input type="notas" class="form-control" id="notas" placeholder="Notas">
                        </select>
                    </div> `)
                    

    if(numero_almuerzos>0 && $(".quitarMenu").length == 0){
        $(`
    
        <button type="button" class="btn btn-labeled col-5 quitarMenu d-flex align-items-center shadow mt-1 mb-1 mr-1 ml-1" onclick="QuitarMenu()" style="  background: transparent ; color: #FB747C; border: solid 2px #FB747C">
            <span class="btn-label"><i class="material-icons icon d-flex align-items-center mr-1">remove_circle</i></span>
            <small>Quitar Menú</small>
        </button>
        
        `).insertBefore(".split-quitar")
    }

    if(numero_platos_carta!= 0 || numero_almuerzos!=0){
   
        $(".hacerpedido").css("display","block")
    }

    console.log(`El numero de almuerzos es ${numero_almuerzos}`)

    }

}

function AdicionarPlatoCarta(){


    // la idea es colocar un Dropdown menu con las opciones de platos de la carta
    var platosCartaID= $(".nombreEnCarta").map(function() { return this.id;});
    var platosCartaNombres= $(".nombreEnCarta").map(function() { return $( this ).text();});
    var platosCartaPrecios= $(".precioEnCarta").map(function() { return $( this ).text();});
    
    //se quitan las notas para ponerlas al final 
    $(".notas").remove();
    numero_platos_carta++;

    console.log(`El numero de almuerzos a la carta es ${numero_platos_carta}`)
    $(".PlatoDeLaCarta").append( `       <div id="PlatoCarta${numero_platos_carta}">
            <label for="OpcionCarta${numero_platos_carta}" id="almuerzoTitle" class="opcionFont">Opción ${numero_platos_carta} de la carta</label>
            <select id="OpcionCarta${numero_platos_carta}" class="form-control mb-3" name="OpcionCarta${numero_platos_carta}" >
            </select>
        </div>`)
        var i;

        for (i = 0; i < platosCartaNombres.length; i++){
            $(`#OpcionCarta${numero_platos_carta}`).append( `                                
              <option id="${platosCartaPrecios[i]}">${platosCartaNombres[i]} </option>

             `)
        }

        $(".PlatoDeLaCarta").append( `   <div class="form-group col-md-12 notas">
        <label for="notas">Notas</label>
        <input type="notas" class="form-control" id="notas" placeholder="Notas">
           </select>
       </div> `)

       if(numero_platos_carta>0 && $(".quitarPlatoCarta").length == 0){
        $(`
        
        
        <button type="button" class="btn btn-labeled col-5 quitarPlatoCarta  d-flex align-items-center shadow mt-1 mb-1 mr-1 ml-1" onclick="QuitarPlatoCarta()" style="  background: transparent ; color: #F9A624; border: solid 2px #F9A624">
            <span class="btn-label"><i class="material-icons icon d-flex align-items-center mr-1">remove_circle</i></span>
            <small>Quitar plato de la Carta</small>
        </button>
        `).insertAfter(".split-quitar")
    
    }

    if(numero_platos_carta!= 0 || numero_almuerzos!=0){
   
        $(".hacerpedido").css("display","block")
    }
    
}

function QuitarPlatoCarta(){

    if (numero_platos_carta >=1){

                    $(`#PlatoCarta${numero_platos_carta}`).remove()
                    console.log(`El numero de Carta quitado es ${numero_platos_carta}`)
                    numero_platos_carta--;
    }

    if(numero_platos_carta === 0){
        $(".quitarPlatoCarta").remove()
    } 

    if(numero_platos_carta=== 0 && numero_almuerzos===0){
        $(".notas").remove()
        $(".hacerpedido").css("display","none")
    }


}

function QuitarMenu(){
    
    if (numero_almuerzos >= 1){

        var categorias = $(".clase-categoria").map(function() { return this.id;});
                    var i;
                    for (i = 0; i < categorias.length; i++) {
                        $(`.${categorias[i]}${numero_almuerzos}`).remove()
                       
                     }
                     $(`#almuerzoTitle${numero_almuerzos}`).remove()
                     console.log(`El numero de almuerzos quitado es ${numero_almuerzos}`)
        numero_almuerzos--;
    }

    if(numero_almuerzos === 0){
        $(".quitarMenu").remove()
    }

    if(numero_platos_carta=== 0 && numero_almuerzos===0){
        $(".notas").remove()
        $(".hacerpedido").css("display","none")

    }
 
}

// Cerrar sesión
function logout(){
    console.log("out")
    firebase.auth().signOut()
    location.reload()

}

// Click en entrar 
function entrar(){
    console.log("entrar")
    $("#modal-usuario").modal()

}




// Agregar boton de pedir 
// Agregar modal de registro o autenticacion

// reciclé la mayoría de tu código en el login.js

const formulario=document.forms['form-register']
const authForm=document.forms['form-auth']
const forgotForm=document.forms['form-forgot']
forgotForm.addEventListener('submit',olvidar_contrasena);
formulario.addEventListener('submit', crearUsuario);
authForm.addEventListener('submit', AutenticarUsuario);

var firstTime=false

function crearUsuario(event){
	event.preventDefault();
	const email = formulario['email'].value;
	const password = formulario['password'].value;
    const name = formulario['name'].value;
    const dir = formulario['dir'].value;
    const tel = formulario['telefono'].value;
    
	// se verifica si no lleno algun campo 
	if (!email || !name || !password || !tel || !dir ){
		console.log('Deben llenarse todos los campos')

		swal({
			title:"Advertencia",
			  text:"Debes llenar todos los campos",
			  icon:"warning"
		  })
	}

	else{
		console.log(`El usuario que quiere crearse es ${name} con email ${email} y contraseña ${password}`)
		      

		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(result=>{
			result.user.updateProfile({
				displayName: name
			})
			console.log("Entra a creacion de usuario")
			var user = firebase.auth().currentUser;
			console.log(user.emailVerified)
			
			user.sendEmailVerification().then(function() {
				console.log("Enviando correo de Verificacion")
				GuardarInformacionCliente(name,email,password,dir,tel,user.uid)
				// Email sent.

				swal({
					title:"Listo",
					  text:"Revisa tu Email (Spam) y regresa para pedir",
					  icon:"success"
				  
				  }).then(function(){
                    $("form").animate({height: "toggle", opacity: "toggle"}, "slow");
      
                    $(".login-form").css("display","block")
                    $(".forgot-form").css("display","none")
                    $(".register-form").css("display","none")
                    $(".modal-producto-title").empty()
                    $(".modal-producto-title").append("Ingresa tu usuario y contraseña")
                  })

			  }).catch(function(error) {
				alert(error)
			  });
			  firstTime=true
			 
	})
	.catch(error=>{
		alert(error)
		console.error(error)
	})
	

}
}

function AutenticarUsuario(event){
    firstTime=false
	event.preventDefault();
	const password = authForm['password'].value;
	const username = authForm['username'].value;
	console.log(`El usuario que quiere entrar es ${username} con  contraseña ${password}`)

  	firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result=>{
    	if(result.user.emailVerified){
            swal({
                title:"¡Listo!",
                  text:"Bienvenido",
                  icon:"success"
              
              }).then(function(){
                var user = firebase.auth().currentUser;
                var consulta_tipo=db.collection('clientes').where("uid","==",user.uid)
                consulta_tipo.get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){
                        swal({
                            title:"Advertencia",
                              text:"Debes ser de tipo usuario para pedir",
                              icon:"warning"
                          }).then(function(){
                            $("#modal-usuario").modal("toggle")
                          })
                    }
                    else{
                        $("#modal-usuario").modal("toggle")
                        $(".hacerpedido").css("display","none")
                        $(".modalToHide").css("display","block")
                        $(".modal-body-pedido").css("display","block")
                        $(".btn-group").css("display","block")
                        $(".fieldTotal").remove()
                        $(".atras-enviar").css("display","none")
                        $(".almuerzoDia").empty()
                        $(".PlatoDeLaCarta").empty()
                        $(".botones-adicionar-to-hide").css("display","block")
                        $(".botones-quitar-to-hide").css("display","block")
                       
                        $(".ModalHacerPedido").empty()
                        $("#modal-pedido").modal()
                        $("#modal-pedido").modal()

                    }
                })

              })
    	
		}
		
      else{

      	if(confirm("Verifica en tu correo electronico")){
      		// //Vamos a enviar un correo para que el usuario pueda verificarse 
			result.user.sendEmailVerification()
			.catch(error=>{// en caso deque hayaerror en el envío del correo 
				alert(error)

			console.error(error)
		})

      	console.log('Listo ya lo enviamos')
      	}
      	else{
      		console.log('okay como quieras')
      	}
      	//si va entrar pero se sale
      	firebase.auth().signOut()
      }
  	})
    
    .catch(function (error) {
        swal({
            title:"Lo sentimos",
              text:"Verifica tu Email o contraseña",
              icon:"error"
          
          })
 
	  console.log(error);

    });
}

function olvidar_contrasena(event){
    var auth = firebase.auth();
    event.preventDefault();
    const email = forgotForm['email-address'].value;

    auth.sendPasswordResetEmail(email).then(function() {
        swal({
            title:"Check",
              text:"An email has been sent",
              icon:"success"
          
          })
        // Email sent.
      }).catch(function(error) {
        alert(error)
        console.log(error)
      });
}

function EntrarGoogle(){
    console.log("entrar con google")
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider);

   
}

function EntrarFacebook(){
    console.log("entrar con Facebook")
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}


// tengo un objeto mirando si hay o no autenticacion, si la hay abre lo otro
firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        var user = firebase.auth().currentUser;
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      console.log(token)
      var consulta_clientes=db.collection('clientes').where("uid","==",user.uid)
      consulta_clientes.get()
      .then(function(querySnapshot){
          if(querySnapshot.empty){
              console.log('no existe')
              GuardarNuevoCliente(user)
              LanzarModal(null)
          }
          else{
              console.log('User exists')
          }
      })



      $(".hacerpedido").css("display","none")
      $(".modalToHide").css("display","block")
      $(".modal-body-pedido").css("display","block")
      $(".btn-group").css("display","block")
      $(".fieldTotal").remove()
      $(".atras-enviar").css("display","none")
      $(".almuerzoDia").empty()
      $(".PlatoDeLaCarta").empty()
      $(".botones-adicionar-to-hide").css("display","block")
      $(".botones-quitar-to-hide").css("display","block")
     
      $(".ModalHacerPedido").empty()
      $("#modal-pedido").modal()
      $("#modal-pedido").modal()
      // ...
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

firebase.auth().onAuthStateChanged(user => {
  if(user && firstTime===false) {
    var user = firebase.auth().currentUser;
    console.log(user)
    $(".icon-login").css("color","white")
    $(".user-name").append(user.displayName)
    $(".user-dropdown").empty()
    $(".user-dropdown").append(
    `
    <button class="dropdown-item" onClick="logout()"><i class="material-icons icon">logout</i>Salir</button>
    <button class="dropdown-item" onClick="user_dashboard()"><i class="material-icons icon">restaurant_menu</i>Mis Pedidos</button>
    <button class="dropdown-item" onClick="address()"><i class="material-icons icon">my_location</i>Cambiar dirección</button>
    
    `
    )
   
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){

        if(querySnapshot.empty){
            $(".direccion-space").empty()
            $(".direccion-space").append(`<p>Debes ingresar como cliente para pedir</p>`)
        }

    querySnapshot.forEach(function(doc){
        const urlParams = new URLSearchParams(window.location.search);
        const QueryMesa=urlParams.get('mesa');
        if (QueryMesa !== null){
            console.log(QueryMesa)
            $(".direccion-space").empty()
            $(".direccion-space").append(`<p> Mesa ${QueryMesa}</p>`)
        }
       else{
         var direccionEntrega= doc.data().dir
         if(direccionEntrega!== null){
         $(".direccion-space").empty()
         $(".direccion-space").append(`<p> ${direccionEntrega}</p>`)
         }
         else{
             address()
         }
       }
    })

    })
    .catch((error)=>{
        console.log(error)
    })



    
    

  }
  else{
    
    console.log("Is the first time dont redirect or Logout")
    $(".icon-login").css("color","#606060")
    $(".user-name").empty()
    $(".user-dropdown").empty()
    $(".user-dropdown").append(`<button class="dropdown-item" onClick="entrar()"><i class="material-icons icon">login</i>Entrar</button>`)
    $(".direccion-space").empty()
    $(".direccion-space").append(`<p> Inicia Sesión para pedir</p>`)
  }
});

function user_dashboard(){
    var user = firebase.auth().currentUser;
    var uid=user.uid
    var consulta_restaurantes=db.collection('restaurantes').where("uid","==",uid)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){

            window.location = '../clientes/clientes.html'//redirigiendo al html de prueba mientras miramos donde redireccionamos para realizar los pedidos
        }
        else{
            querySnapshot.forEach(function(doc){
               
                const tipo=doc.data().tipo
                if(tipo ==='restaurante'){
                    window.location = '../restaurantes/restaurantes.html'
                }
                else{
                    firebase.auth().signOut()
                    window.location = '../login.html'
                }
            })
        }
        
    })

}

function GuardarInformacionCliente(name,email,password,dir,tel,userUid) {

	console.log('Enviando a base de datos')
    db.collection("clientes").doc().set({
		nombre:name,
        email: email,
        password: password,
        dir:dir,
		tel:tel,
		tipo:'cliente',
		uid:userUid,
	})
    .then(function() {
        console.log("Document successfully written!");
        firebase.auth().signOut()
        
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
	});
}


function HacerPedido(){
    var total_platos_carta=0
    // Aqui se mostrará el resumen de lo que se piensa pedir
    var categorias = $(".clase-categoria").map(function() { return this.id;});

    if($(".atrasBoton").length == 0){
        //$(`<button type="button" class="btn btn-outline-danger col-3 atrasBoton" onclick="Atras()">Atras</button>`).insertAfter(".hacerpedido")
        //$(`<button type="button" class="btn btn-primary col-3 enviarOrden" onclick="EnviarOrden()">Enviar Orden</button>`).insertAfter(".hacerpedido")

        $(".atras-enviar-add").append(`
        <button type="button" class="btn btn-labeled col-5 d-flex align-items-center shadow mt-1 mb-1 mr-1 ml-1 atrasBoton" onclick="Atras()" style="background: transparent ; color: #FB747C;border: solid 2px #FB747C"">
            <span class="btn-label"><i class="material-icons icon d-flex align-items-center mr-1">add_circle</i></span>
            <small>Atras</small>
      </button>

      <button type="button" id="botonEnviar" class="btn btn-labeled col-5 d-flex align-items-center shadow mt-1 mb-1 mr-1 ml-1 " onclick="EnviarOrden()" style="background: #4BD143; color: white;">
        <span class="btn-label"><i class="material-icons icon d-flex align-items-center mr-1">add_circle</i></span>
        <small id="textoEnviar">Enviar</small>
    </button>
        
        `)
    }

    $(".modal-body-pedido").animate({height: "toggle", opacity: "toggle"}, "slow");
    $(".modal-body-pedido").animate({height: "toggle", opacity: "toggle"}, "fast");

    $(".modalToHide").css("display","none")
    $(".atras-enviar").css("display","block")
   
   
    $(".botones-quitar-to-hide").css("display","none")
    $(".botones-adicionar-to-hide").css("display","none")
    $(".hacerpedido").css("display","none")
    
    $(".ModalHacerPedido").css("display","block")
    $(".ModalHacerPedido").empty()

    console.log(`iterar pedido en ${numero_almuerzos}`)

    if(numero_almuerzos >0){

        $(".ModalHacerPedido").append(`
        <h5 class="resumen-title">Resumen del pedido Menú</h5>
        <table class="table table-sm TablaHacerPedido">
        <thead>
        <tr class="headerTablaHacerPedido">
        
        </tr>
        </thead>

        <tbody class="bodyTablaHacerPedido">


        </tbody>

        </table>
        <div class="row subtotal-menu ">
        
        </div>



        
        `)
        $(".headerTablaHacerPedido").empty()
        
        $(".headerTablaHacerPedido").append(`<th scope="col" >Tipo</th>`)

        
        var j;

        for (j = 1; j <= numero_almuerzos; j++) { 
            $(".bodyTablaHacerPedido").append(`  
                                                <tr class="tablaAlmuerzo${j}">
                                                    <th scope="row" >Almuerzo ${j} </th>
    
                                                </tr>
                                                `)
        }
    
        var i;

        for (i = 0; i < categorias.length; i++) { 
            $(".headerTablaHacerPedido").append(`<th scope="col">${categorias[i]}</th>`)
            

            var j;

            for (j = 1; j <= numero_almuerzos; j++) { 
                

                var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
                $(`.tablaAlmuerzo${j}`).append(`
                                                <td > ${valueTable} </td>
                                                `
                    )
            }


        }

    }

    if(numero_platos_carta>0){
        $(".ModalHacerPedido").append(`
        </table>
            <h5 class="resumen-title" >Resumen del pedido Carta</h5>
            <table class="table table-sm TablaHacerPedidoCarta">
            <thead>
            <tr class="headerTablaHacerPedidoCarta">
            
            </tr>
            </thead>

            <tbody class="bodyTablaHacerPedidoCarta">


            </tbody>

        </table>
        <div class="row subtotal-carta ">
        
        </div>


        
        `)
        $(".headerTablaHacerPedidoCarta").empty()
        $(".headerTablaHacerPedidoCarta").append(`
                <th scope="col" >Tipo</th>
                <th scope="col" >Pedido de Carta</th>`)

        //Recorrer todas las opciones y ponerlas como rows
        PlatosCartaPedidos=[]
        PlatosCartaPrecios=[]
        var i;
        for(i = 1; i <= numero_platos_carta; i++){

        

            var PlatoCartaValue=document.forms["PedidoForm"][`OpcionCarta${i}`].value

            PlatosCartaPedidos.push(PlatoCartaValue)

            //Array de precios

            var SelectedDelForm = document.getElementById(`OpcionCarta${i}`);
            var PlatoHijoSeleccionado = SelectedDelForm.options[SelectedDelForm.selectedIndex].id;
            PlatosCartaPrecios.push(PlatoHijoSeleccionado)
            
        }

        //Pasar a Entero 

        for(var i=0; i<PlatosCartaPrecios.length;i++) PlatosCartaPrecios[i] = parseInt(PlatosCartaPrecios[i], 10);

        console.log(PlatosCartaPrecios)
        // Total de platos de la carta 
      
        total_platos_carta = PlatosCartaPrecios.reduce((a, b) => a + b, 0)
          
        $(".bodyTablaHacerPedidoCarta").append(`  
        <tr >
            <th scope="row" >Carta </th>
            <td id="PedidoDeCarta">${PlatosCartaPedidos} </td>
        </tr>
        `)

    }

    const precio_menus=precio*numero_almuerzos
    precioDomicilio=parseInt(precioDomicilio, 10);
    const granTotal=precio_menus+total_platos_carta+precioDomicilio
    console.log(granTotal)
    $(".subtotal-menu").append( `<p class="col-12 text-right align-self-center "><span class="subtotal-title"> Subtotal Menú:</span> $${precio_menus}</p> `)
    $(".subtotal-carta").append(`<p class="col-12 text-right align-self-center "><span class="subtotal-title"> Subtotal Carta:</span> $${total_platos_carta}</p> `)

    $( `<div class="fieldTotal">
            <div class="container-fluid">
                <div class="row">
                <div class="col-12 totalPagar text-right">
                    <p class="subtotal-title">Domicilio: <span class="GranTotal">$${precioDomicilio}</span> </p>
                    <p class="subtotal-title">Total: <span class="GranTotal">$${granTotal}</span> </p> 
                </div>
                </div>
            </div>
        </div>
        
        `).insertAfter( ".ModalHacerPedido" );

    var notas=document.forms["PedidoForm"][`notas`].value
    if(notas!=""){
    $( `<div class="col-12 ">
        <p class="subtotal-title">Notas: <small style="color:black;">${notas}</small> </p> 
        </div>
    `).insertBefore( ".totalPagar" );

    }


  
    
}

function Atras(){
    $(".modal-body-pedido").animate({height: "toggle", opacity: "toggle"}, "slow");
    $(".modal-body-pedido").animate({height: "toggle", opacity: "toggle"}, "fast");
    //quitar el total 
    $(".fieldTotal").remove()
    //Muestra el modal de formulario
    $(".modalToHide").css("display","block")
    //este modal es como reduntante
    //$(".modal-body-pedido").css("display","block")

    
    $(".atras-enviar").css("display","none") 

    $(".hacerpedido").css("display","block")

    $(".botones-adicionar-to-hide").css("display","block")
    $(".botones-quitar-to-hide").css("display","block")

    $(".ModalHacerPedido").css("display","none")
}

function EnviarOrden(){
    var pedido = {};
    $('#botonEnviar').attr('disabled','disabled');
    $("#textoEnviar").empty()
    $("#textoEnviar").append('Enviando tu Pedido')

    //Esta funcion escribe en la base de datos de pedidos y tambien hace un append al array 
    // de restaurante con el uiid del cliente. 
    var user = firebase.auth().currentUser
    // pedir la dirección y telefono a la base de datos 
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const urlParams = new URLSearchParams(window.location.search);
            const QueryMesa=urlParams.get('mesa');
            if(QueryMesa !==null){
                var direccion =`Mesa ${QueryMesa}`
            }
            else{
                var direccion= doc.data().dir
                
            }
           
            var telefono= doc.data().tel
            var nombre_cliente= doc.data().nombre
            pedido['nombre']=nombre_cliente
            pedido['tel']=telefono
            pedido['dir']=direccion
            
            var PedidoDeCarta=$("#PedidoDeCarta").text()
            var PedidoDeCarta = PedidoDeCarta.split(',');
            var totalpagar=$(".GranTotal").text()
            //se tendrá un array con el nombre de la categoria que tenga la orden 
            var categorias = $(".clase-categoria").map(function() { return this.id;});
            var categoriaPedido=[]
            
            //notas del pedido
            var notas=document.forms["PedidoForm"][`notas`].value
            var i;  
            for (i = 0; i < categorias.length; i++) { 
                // arreglo auxiliar para ingresarle lo que va en cada categoria
                var auxiliar_array=[]
                var j;
                for (j = 1; j <= numero_almuerzos; j++) { 
                    var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
                    auxiliar_array.push(valueTable)
                }


                pedido[`${categorias[i]}`] = auxiliar_array;
            }

            pedido['carta']=PedidoDeCarta
            pedido['uid_cliente']=user.uid
            pedido['uid_restaurante']=uid_restaurante
            pedido['notas']=notas
            pedido['hora_pedido']=Date.now()
            pedido['estado']='ordenado'
            pedido['total']=totalpagar
   
            if(pedido['dir']!==null && pedido['dir']!==""){
            GuardarPedido(pedido,uid_restaurante,user.uid)
            console.log("Enviar A Guardar Pedido ")
            console.log(pedido)

            }
            else{
                
            swal({
                title:"Falto la dirección",
                  text:"No configuraste la dirección de entrega",
                  icon:"error"
              
              }).then(function(){
                $("#modal-pedido").modal('toggle');
              })

            }

        })
    })
    .catch(function(err){
        console.log(err)
    })
   
    
}

function GuardarPedido(pedido,uid_restaurante,user_uid) {

	
    db.collection("pedidos").doc().set(pedido)
    .then(function() {
        console.log("Document successfully written!");

        swal({
            title:"Listo",
              text:"Pedido enviado",
              icon:"success"
          
          }).then(()=>{
            $('#botonEnviar').prop("disabled", false)
            $("#textoEnviar").empty()
            $("#textoEnviar").append('Enviar')
            $("#modal-pedido").modal('toggle');
    
            console.log("cerrar modal")
            window.location = '../clientes/clientes.html'
          })

        var consulta_restaurantes=db.collection('restaurantes').where("uid","==",uid_restaurante)
        consulta_restaurantes.get()
        .then(function(querySnapshot){


            querySnapshot.forEach(function(doc){
                    console.log(doc.data())
                    var clientes=doc.data().clientes
                    var doc_restaurante=doc.id
                    if(clientes.includes(user_uid)!= true){
                    clientes.push(user_uid)
                    var actualizacion_clientes=db.collection('restaurantes').doc(doc_restaurante)
                    return actualizacion_clientes.update({
                        clientes: clientes
                    })
                    .then(function(){
                       console.log("guardado")
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                }

            })
            
    })
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });

 
    

}

//Cambio de Direccion del usuario 

function address(){
    console.log("cambiar direccion")

   
    var user = firebase.auth().currentUser
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){

        querySnapshot.forEach(function(doc){
            // Mostrar la direccion actual 
            const direccionActual=doc.data().dir
            
            $(".user-direccion-modify").empty()
            $(".user-direccion-modify").append(doc.id)
            $("#direccionInput").val(direccionActual)
            $("#modal-direccion").modal()
        })

    })

}

function cambiar_direccion(){
    var user_doc_id = $(".user-direccion-modify").text(); //preferred
    var direccionNueva= document.forms["DireccionForm"]["direccion"].value;
    if(direccionNueva!==""){
    var actualizacion_direccion=db.collection('clientes').doc(user_doc_id)
    return actualizacion_direccion.update({
        dir: direccionNueva
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Dirección de envío actualizada",
              icon:"success"
          
          }).then(function(){
            $("#modal-direccion").modal('toggle');
            location.reload();

          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    }
    else{
        swal({
            title:"Dirección inválida",
              text:"no es posible colocar esta como dirección de entrega",
              icon:"error"
          
          })

    }
}

function LocateLogo(uid_restaurante,nombreRestaurante,direccion_restaurante){

    $(".header-portada").append(
        `
        <div class="centered " >
            <div class="image shadow-lg">
            </div>

        </div>


        <div class="centered-second" style="top:70%">
         
            <p class="pide-en col-12" >Pide en ${nombreRestaurante}</p>

        </div>

        <div class="centered-second" style="top:90%">
         
            <p class="pide-en col-12 " >${direccion_restaurante}</p>

        </div>



        `
    )


    var storageRef = firebase.storage().ref();

    var LogoRef = storageRef.child(`${uid_restaurante}/logo.png`);
    // Get the download URL
    LogoRef.getDownloadURL()
        .then(function(url) {
        // Insert url into an <img> tag to "download"
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            console.log(url)
            $(".image").css("background",`url(${url}) 50% 50% no-repeat`)
            $(".image").css("background-size", "100% auto")
            
        })
        .catch(function(error) {
        console.log(error)
        $(".image").css("background",`url(./assets/img/logo-default.JPG) 50% 50% no-repeat`)
        });
}

function VerificarPago(estado,fechaDeVencimiento){

    var today = new Date();
    var nextDate= new Date(fechaDeVencimiento)

    const diffTime= nextDate - today
    const diffDays= Math.ceil(diffTime/(1000*60*60*24))
    console.log(diffDays)

    if(estado==='activo' || estado ==='demo'){


    if(diffDays <= -3){
        swal({
            title:"Restaurante no disponible",
              text:`El restaurante se encuentra inactivoaa`,
              icon:"warning"
          
          }).then(function(){
            window.location = '../index.html'
          })
    }

    }
    else{

        swal({
            title:"Restaurante no disponible",
              text:`El restaurante se encuentra inactivo !`,
              icon:"warning"
          
          }).then(function(){
            window.location = '../index.html'
          })

    }



}


function GuardarNuevoCliente(user){

    console.log(user.displayName)
    const nombreUsuario=user.displayName
    const emailUsuario=user.email
    const phoneNumber=user.phoneNumber
    const userUid=user.uid
    const dir=null


    db.collection("clientes").doc().set({
		nombre:nombreUsuario,
        email: emailUsuario,
        tel:phoneNumber,
        dir:null,
        tipo:'cliente',
        uid:userUid,
        
	})
    .then(function() {
        console.log("Document successfully written!"); 
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
	});

}

function HorarioRestaurante(horaApertura,horaCierre){
    console.log(horaApertura)
    console.log(horaCierre)

    var date=new Date()
    var hora= date.getHours()
    var minutos=date.getMinutes()
    console.log(hora)
    var arrayApertura=horaApertura.split(":")
    var arrayCierre=horaCierre.split(":")
    var hApertura = parseInt(arrayApertura[0],10)
    var mApertura = parseInt(arrayApertura[1],10)
    var hCierre = parseInt(arrayCierre[0],10)
    var mCierre = parseInt(arrayCierre[1],10)
    console.log(hApertura)
    console.log(hCierre)

    

    if(hora >= hApertura && hora <= hCierre){
        console.log("estas en la franja ")
        if(hora===hApertura){
            // ver los minutos 
            if(minutos<mApertura){
                console.log("En pocos minutos se abrira el restaurante")
                
                swal({
                    title:"Atención",
                      text:`En pocos minutos podrás pedir en este restaurante:
                      Horario
                       ${horaApertura} - ${horaCierre} `,
                      icon:"warning"
                  })
                
                  return false
                //$("#button_pedir_int").prop('disabled', true);
            }
            else{
                console.log("restaurante abierto")
                return true
                //$("#button_pedir_int").prop('disabled', false);
                
            }
        }

        else if(hora === hCierre){
            if(minutos > mCierre){
                swal({
                    title:"Atención",
                      text:`No estas en el horario de atención pide entre:
                       ${horaApertura} - ${horaCierre} `,
                      icon:"warning"
                  })
                console.log("el restaurante se encuentra cerrado")
                return false
                //$("#button_pedir_int").prop('disabled', true);
            }
            else{
                console.log("restaurante abierto")
                return true
                //$("#button_pedir_int").prop('disabled', false);
            }
        }
        else{
            
            console.log("restaurante abierto")
            return true
            //$("#button_pedir_int").prop('disabled', false);
        }
    }
    else{
        swal({
			title:"Atención",
              text:`No estas en el horario de atención pide entre:
               ${horaApertura} - ${horaCierre} `,
			  icon:"warning"
		  })
        console.log("no estas en la frnanja")
        return false
        //$("#button_pedir").prop('disabled', true);
    }
}

// esta función devuelve True or False dependiendo si la ubicación del cliente cae dentro de la zona de servicio o no
function validateAdress(){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryRestaurante = urlParams.get('restaurante');
    var attr = []
    var consulta_restaurantes=db.collection('restaurantes').where("nombreRestaurante","==",QueryRestaurante)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            attr[0]=doc.data().dir
            attr[1]=doc.data().areaServicio
            var user = firebase.auth().currentUser
            var dir_cliente
            var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
            consulta_usuario.get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    dir_cliente=doc.data().dir
                    console.log(attr)
                    console.log(dir_cliente)
                    var value = geocoder(dir_cliente, attr) 
                    
                    return value
                }) 
            })
        })
    })
}

// esta función se invoca dentro de la función validateAdress() y se encarga de la geocodificación y validación
function geocoder(dir_cliente,dir_rest){
    require([
        "esri/tasks/Locator", 
        "esri/tasks/GeometryService",
        "esri/tasks/support/DistanceParameters",
        "dojo/domReady!",
    ], function(Locator, GeometryService, DistanceParameters) {

    var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    })
  
    var addressParams = {"singleLine": dir_rest[0]+' Bogota'};
    locatorTask.addressToLocations({address: addressParams}).then(function(evt){    
        // console.log(evt)      
        if (evt[0].location){
            var pt1 = {
                type: "point",  // autocasts as new Point()
                longitude: evt[0].location.longitude,
                latitude: evt[0].location.latitude
            };
        }
        console.log(pt1)
        var addressParams = {"singleLine": dir_cliente+' Bogota'};
        locatorTask.addressToLocations({address: addressParams}).then(function(evt){
            if (evt[0].location){
                var pt2 = {
                    type: "point",  // autocasts as new Point()
                    longitude: evt[0].location.longitude,
                    latitude: evt[0].location.latitude
                };
            }
            console.log(pt2) 
            geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var distParams = new DistanceParameters();
            distParams.distanceUnit = GeometryService.UNIT_KILOMETER;
            distParams.geometry1 = pt1;
            distParams.geometry2 = pt2;
            distParams.geodesic = true;
            geometryService.distance(distParams).then(function(distance) {
                console.log(distance);
                 if (distance <= dir_rest[1]){
                    console.log(true)
                    return true
                } else {
                    console.log(false)
                    return false
                } 
            });
        })
    })
})
}

