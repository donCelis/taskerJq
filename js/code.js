$(document).ready(function() {
  console.time("tiempo");
  /*Recomedaciones:
		--Para programar usar id
		--Para diseño usar clases

		Labores:
		--Crear un objeto para las alertas --> ok
		--Pasar la template a una función --> ok
		--Crear la variable tarea como objeto --> ok
		--Validar la entrada de datos --> ok
		--Resetear el campo del formulario y los estilos --> ok
		--Marcar ok --> ok
		--Almacenar las tareas en firebase --> ok
		--Tarea completada -> ok
		--Animaciones
		--Validar campos del formulario con expresiones regulares
		--Agregar tareas --> ok
		--Crear la tarea en la vista --> ok
		--Delay para tareas completadas
		--Delay para cargar tareas
		--Como serán ordenadas {Por fechas, aplicando filtros de firebase} -> ok
		--Proteger la base de datos con reglas de firebase
		--Autenticación de usuarios (proteger la bd)
		--Reuniciar la animación del campo de entrada --> ok
		--Cargarlo al hosting --> ok
	*/

  //Iniciar firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDZPvhThHsK7tG0kxwZ47q7XRMlE8AaZn0",
    authDomain: "projectf1834543.firebaseapp.com",
    databaseURL: "https://projectf1834543.firebaseio.com",
    projectId: "projectf1834543",
    storageBucket: "",
    messagingSenderId: "446281075829",
    appId: "1:446281075829:web:002598c4a1b1c00d"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Initialize vars
  let db = firebase.firestore();
  let secTareas = $(".tareas");

  //Declaración de funciones
  function enviarTarea(x) {
    db.collection("tasks")
      .add({
        nombre: x.trim().toLowerCase(),
        estado: "incompleto",
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  //Iniciar la sesión
  function iniciarSesion(x, y) {
    firebase
      .auth()
      .signInWithEmailAndPassword(x, y)
      .then(() => {
        console.log("Sesión activa");
      })
      .catch(() => {
        console.log("Por favor iniciar sesión");
      });
  }

  //Detectar la sesión activa
  function sesionActiva() {
    firebase.auth().onAuthStateChanged(() => {
      let user = firebase.auth().currentUser;
      if (user !== null) {
        $(".inserForm").remove();
        let email = user.email;
        console.log(email);
        $(".sesionAc").slideToggle();
        $(".inserForm").remove();
      } else {
        console.log("Sesión inactiva");
        $(".inserForm").slideToggle();
        $(".sesionAc").remove();
      }
    });
  }

  sesionActiva();

  //Template de la tarea
  function crearTarea(idn, valor, estado) {
    let colorV = "";
    let linea = "";

    if (estado === "completo") {
      colorV = "verde";
      linea = "raya";
    }

    let r = `<div id="${idn}" estado="${estado}">
              <p class="titulo ${linea}">${valor}</p>
              <i class="ok fas fa-check-circle ${colorV}"></i>
					  </div>`;
    return r;
  }

  //Enviar los datos
  $(".iniSesion").click(e => {
    e.preventDefault();
    let usuario = $("#usuario").val();
    let contra = $("#contra").val();
    if (usuario === "" && contra === "") {
      console.log("Campos vacios");
    } else {
      iniciarSesion(usuario, contra);
    }
  });

  $(".iconAdd").on("click", function() {
    let alerta = {
      rojo: { borderColor: "rgb(231, 76, 60)" },
      azul: { borderColor: "rgb(41, 128, 185)" },
      mediaNoche: { borderColor: "rgba(44, 62, 80, .5" }
    };

    let entrada = {
      selector: $("#entrada"),
      valor: $("#entrada").val()
    };

    if (entrada.valor === "") {
      //Alertas
      entrada.selector
        .attr("placeholder", "Campo obligatorio")
        .addClass("error mover")
        .css(alerta.rojo)
        .on({
          focus: function() {
            $(this)
              .css(alerta.azul)
              .attr("placeholder", "Ingresar tarea")
              .removeClass("error mover");
          },
          blur: function() {
            $(this).css(alerta.mediaNoche);
          }
        });
      setTimeout(() => {
        entrada.selector.removeClass("mover");
      }, 500);
    } else {
      //Procesos
      enviarTarea(entrada.valor);
      entrada.selector.val("");
    }
  });

  db.collection("tasks")
    .orderBy("fecha", "desc")
    .onSnapshot(querySnapshot => {
      secTareas.html("");
      querySnapshot.forEach(doc => {
        //console.log(`${doc.id} => ${doc.data().nombre}`);
        let texto = doc.data().nombre;
        let idx = doc.id;
        let estado = doc.data().estado;
        secTareas.append(crearTarea(idx, texto, estado));
      });
    });

  secTareas.on("click", ".ok", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this)
      .toggleClass("verde")
      .prev(".titulo")
      .toggleClass("raya");
    let idz = $(this)
      .parent("div")
      .attr("id");
    let datos = db.collection("tasks").doc(idz);
    datos.update({ estado: "completo" }).then(() => {
      console.log("Tarea completa");
    });
  });

  /*$(document).on("mouseenter mouseleave", ".ok", function(e) {
    let estado = $(this).attr("estado");
    if (estado === "completo") {
      //$(this).toggleClass('moverTarea');
    }

    e.preventDefault();
    e.stopPropagation();
  });*/
  console.timeEnd("tiempo");
});

/* setTimeout(()=>{
  $('.animate').animate({fontSize: '3em'});
}, 5000); */
