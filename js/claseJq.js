$(document).ready(function(){
	//Manipulación del DOM con JQ
	//id
	let id = $('#lista1');
	console.log(id);

	//clase
	let clase = $('.elemento2');
	console.log(clase);

	//document, window, ......
	let documento = $(document);

	//Evento de mouse
	$('.btn1').click(function(){
		id.css('color', 'red');
	});
});