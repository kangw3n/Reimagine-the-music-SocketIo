//INIT Parse
Parse.initialize("IfytVW7kwSQfQ1UwFFgLOQNi27nGmWMSbhWoj60Y", "jfTdP3LoqTXkTcqOqULRe2IpeP0p4jWdrz2Lb3El");
var ParseUser = Parse.Object.extend("ParseUser");
var parseUser = new ParseUser();
 

// JavaScript Document
var socket = io();
var $Con = $('.connection');
var $myName =  $('.myname');
var $textholder = $('.nameplace');
var $form = $("#inline_content");

//Menu Toggle  
$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

//////////////////////////////////////*SOCKET IO SCRIPT*/////////////////////////////////////////////////
//SOCKET IO appending current user itself
socket.on('appending', function(sas){
	//$('.usercontainer').append('<button class="btn btn-default">'+ sas +'</button>');
});

//SOCKET IO count current uver
socket.on('userconnect',function(usercon){
	//$Con.html(usercon);
});

//SOCKET IO appending current userlist to client   
socket.on('usernameall',function(userName){
	$('.usercontainer').html('');
	console.log(userName);
	userName.forEach(function(entry){
	  //console.log(entry);
	if(entry !== null){
		$('.usercontainer').append('<button type="button"  disabled="disabled"  class="btn btn-success">'+ entry +'</button>');
		var alluser = $('.usercontainer').children().length;
		$Con.html(alluser);
	  }
  });
});

//SOCKET IO Retrive msg from server to play a sound   
socket.on('chat message', function(msg){
	switch(msg){
        case "1":
		console.log("鼓");
		break;
		case "2":
		console.log("鈸");
		break;    
		case "3":
		console.log("風聲");
		break;
		case "4":
		console.log("雷聲");
		break;
		case "5":
		console.log("雨聲");
		break;
	} 
	var instance = createjs.Sound.play(msg, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
	if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { console.log(instance);return; }
	document.getElementById(msg).className = "gridBox active";
	document.getElementById(msg).children[0].className = "textsize fontsize";
	instance.addEventListener ("complete", function(instance) {
		document.getElementById(msg).className = "gridBox";
		document.getElementById(msg).children[0].className = "textsize";
	});
});
//////////////////////////////////////*SOCKET IO SCRIPT*/////////////////////////////////////////////////
       
//Fire when user reload a pages
//window.onbeforeunload = function(e) {
//  var dc = $('.myname').text();
 // socket.emit('trigger',dc);
//}; 

$( window ).unload( function(e) {
  var dc = $('.myname').text();
  socket.emit('trigger',dc);
}); 


//Local Storage Username
$(document).ready(function() {
	var socket = io();
	// Retrieve localstorage
	var lcname = localStorage.getItem("name");
	$textholder.html('我是 <span class="myname">' + lcname +'</span>' );
	socket.emit('username', lcname);
	
	
	if (localStorage.getItem("name") === null) {
		$textholder.html('');
		$('.usercontainer').html('');
		  $.colorbox({inline:true, 
					href:$form,
					escKey: false,
					overlayClose: false, 
					onComplete:function(){ $('#m').focus(); }});		
	}
	
	FastClick.attach(document.body);			
});

//form field for username input, send to server arrays
$('form').submit(function(){
	var $usernameholder = $('#m').val();
	socket.emit('username', $usernameholder);
    
    //ParseSaveUSERtoCloud
        parseUser.set("username", $usernameholder);
        parseUser.save(null, {
          success: function(gameScore) {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + gameScore.id);
          },
          error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });
    //ParseSaveUSERtoCloud
    
    $textholder.html('我是 <span class="myname">' + $('#m').val() +'</span>' );
	
    // save tolocalstorage
	localStorage.setItem("name", $usernameholder);
	$.colorbox.close()
	return false;
}); 
		
//Mobile Detection for touchstart		
function isMobile() {
	if (navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
			|| navigator.userAgent.match(/Opera Mini/i)
			|| navigator.userAgent.match(/IEMobile/i)
			) {
		return true;
	}
}

/*function removeMobileOnclick() {
	if(isMobile()) {
		$('#1,#2,#3,#4').removeAttr( "onclick" );
	} else {
		$('#1,#2,#3,#4').removeAttr( "ontouchstart" );
	}
}*/

//Load Sound
function soundLoaded(event) {
	document.getElementById("loader").className = "";
	var div = document.getElementById(event.id);
}

function stop() {
	if (preload != null) { preload.close(); }
	createjs.Sound.stop();
}

//Sending Info to socket io server       
function playSound(target) {
	socket.emit('chat message', target.id);
	//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
}



	