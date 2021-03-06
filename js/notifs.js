$(document).ready(function(){setInterval(notifications,10000);});
var dataNotifications=0;
var clearNot=true;
function notifications(){
	$.ajax({
		url:document.location.origin+"/getNotifications.php",
		cache:false,
		dataType:'json',
		type:'POST',
		error:function(data){console.log(data)},
		success:function(data){
			if ((clearNot)||(data!==[])){
				dataNotifications=data['notif'];
				if (data['notif'].length==0) return;
				if (data['notif'].length>9) count="9+";
				else count=data['notif'].length;
				countNotifications='Оповещения<div class="notifications">';
				countNotifications+='<div class="notific_num"><p>'+count+'</p></div></div>';
				$('.open_notifications_body a').html(countNotifications);
				htmlMessage='<div class="notifications_body_title">';
				htmlMessage+='<div class="notifications_body_title_elements_div">';
				htmlMessage+='<div class="notifications_body_text">';
				htmlMessage+='<p class="text_notification_body">Оповещения</p>';
				htmlMessage+='</div><div class="notifications_body_title_element_bar">';
				htmlMessage+='</div></div></div>';
				for (i=0;i<data['notif'].length;i++){
					
					htmlMessage+='<div class="notifications_bar"><p class="text_notifications_bar">';
					htmlMessage+=data['notif'][i]['message'];
					htmlMessage+='</p>';
					if (data['notif'][i]['add_friends']){
						htmlMessage+='<div class="button_friend "><input type="button" class=" notifications_buttons" id="userId'+data['notif'][i]['add_friends']+'" value="Принять" onclick="acceptApp(this)">';
						htmlMessage+='<input type="button notifications_buttons" id="userId'+data['notif'][i]['add_friends']+'" value="Отменить" onclick="cancelApp(this)">';
					}
					else{
						htmlMessage+='<div class="button_test notifications_buttons"><input type="button" value="Принять" recipient="'+data['notif'][i]['recipient']+'" onclick="document.location=document.location.origin+\'/'+data['notif'][i]['invitations']+'&recipient='+data['notif'][i]['recipient']+'\'">';
					}
					htmlMessage+='</div></div>';
				}
				htmlMessage+='<a href="allNotifications.html.php">Посмотреть прочтенные оповещения</a>';
				$('.notifications_body').html(htmlMessage);
				clearNot=false;
			}
		}
	});
}
	
$(document).ready(function(){$('#notif').click(function(){
		if ($('.notifications_body').is(':visible')){
			$('.open_notifications_body a').html('Оповещения');
			htmlMessage='<div class="notifications_body_title">';
			htmlMessage+='<div class="notifications_body_title_elements_div">';
			htmlMessage+='<div class="notifications_body_text">';
			htmlMessage+='<p class="text_notification_body">Оповещения</p>';
			htmlMessage+='</div><div class="notifications_body_title_element_bar">'
			htmlMessage+='</div></div></div><a href="allNotifications.html.php">Посмотреть прочтенные оповещения</a>';
			$('.notifications_body').html(htmlMessage);
			unreadNot();
		}
		else unreadNot();
	});
});

function unreadNot(){
	dataNot={};
	if (dataNotifications.length){
		for (i=0;i<dataNotifications.length;i++){				
			dataNot[String(i)]=dataNotifications[i];
		}
		$.ajax({
			url:document.location.origin+"/unreadNotifications.php",
			cache:false,
			type:'POST',
			dataType:'json',
			data:dataNot,
			error:function(data){console.log(data);},
			success:function(data){console.log(data);}
		});
	}
	clearNot=true;
}
	
function acceptApp(element){
	$idFriend=$(element).attr('id').replace('userId','');
	$.ajax({
		url:document.location.origin+"/acceptApp.php",
		cache:false,
		type:'POST',
		dataType:'json',
		data:{id:$idFriend},
		error:function(data){console.log(data);},
		success:function(data){
			switch(data['answer']){
				case 'success':
					app="<p>Заявка принята</p>";
					$(element).closest('.notifications_bar').html(app);
					break;
				case 'errorDataUser':
					alert("Данные вашего аккаунта не подтверждены");
					break;
				case 'errorDataFriend':
					alert("Невозможно добавить несуществующего пользователя");
					break;
				case 'serverError':
					alert("Произощла ошибка на сервере");
					break;
			}
		}
	});
}
	
function cancelApp(element){/*
	$idFriend=$(element).attr('id').replace('userId','');
	$.ajax({
		url:document.location.origin+"/mathtest/cancelApp.php",
		cache:false,
		type:'POST',
		dataType:'json',
		data:{id:$idFriend},
		error:function(data){console.log(data);},
		success:function(data){
			app="<p>Заявка принята</p>";
			$(element).closest('.notifications_bar').html(app);
		}
	});*/
}