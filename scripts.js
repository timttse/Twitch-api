// Sort channels so online channels at top
function rearrange(){
	var container=$('.streamContainer')
	var elem=container.find(".online").sort(sortChannels).parent();
	container.prepend(elem);
	container.find(".header").prependTo(container);
}

function sortChannels(a,b){
	return a.className<b.className;
}

//Get user (streamer) information
function getUser(user){
	$.getJSON("https://wind-bow.glitch.me/twitch-api/users/"+user+"?callback=?",function(data){
		if(data.status!=404){
			var name=data.display_name;
			var image=data.logo;
			var url=data.url;

			$("#link_"+user).attr("href",url);
			$("#img_"+user).attr("src",image);
			$("#name_"+user).text(name);
		}
	});


}

// Get channel information Status
function getChannel(channel){
	$.getJSON("https://wind-bow.glitch.me/twitch-api/channels/"+channel+"?callback=?",function(data){
		if(data.status!=404){
			var name=data.display_name;
			var status=data.status;
			var image=data.logo;
			var url=data.url;
			var game=data.game;

			$("#link_"+channel).attr("href",url);
			$("#img_"+channel).attr("src",image);
			$("#name_"+channel).html(name);
			$("#status_"+channel).text(status);
			$("#game_"+channel).text("Streaming "+game);

		}
	});
}

//Determine if channel offline or not
function getStream(stream){
	$.getJSON("https://wind-bow.glitch.me/twitch-api/streams/"+stream+"?callback=?",function(data){
		if(data.stream==null){
			$("#status_"+stream).addClass("hidden");
			$(".id_"+stream).addClass("offline").removeClass("online");
			$("#status_"+stream).text(" Offline");
			$("#game_"+stream).addClass("hidden");
		} else {
			$("#status_"+stream).removeClass("hidden");
			$(".id_"+stream).addClass("online").removeClass("offline");
			$("#game_"+stream).removeClass("hidden");
		}
		rearrange();
	});
}

// If screen shrunk, stack streamer name above logo
function restackDiv(width,channels,clen){
	for(var i=0;i<clen;i++){
		if (width <= 750) {
			$("#name_"+channels[i]).prependTo($("#logo_"+channels[i]));
			$(".center").css("min-width",width)
		} else {
			console.log(width);
			$("#name_"+channels[i]).prependTo($("#display_"+channels[i]));
			$(".center").css("min-width","750px")					
		}
	}
}

// initialize channels
function addChannelsToDiv(channels){
	for(var i=0;i<channels.length;i++){
		var c=channels[i];
		$(".streamContainer").append("<a href='#' target='_blank' class='streamLink' id='link_"+c+"'><div class='streamDiv row id_"+c
			+"''><span class='logoDiv col-md-2 col-md-push-9' id='logo_"+c+"'><img src='' class='logo' id='img_"+c
			+"'/></span><span class='scol display col-md-3 col-md-pull-3' id='display_"+c
			+"''><div class='displayName' id='name_"+c+"'></div><div class='game' id='game_"+c
			+"'></div></span><span class='scol status hidden col-md-7' id='status_"+c
			+"''></span></div></a>");
	}

}

function filter(elem){
	var action=$(elem).text();
	$(".menuBtn").removeClass("menuActive")
	switch(action){
		case ("All"):
		$(".online").removeClass("hidden");
		$(".offline").removeClass("hidden");
		$(".allBtn").addClass("menuActive");
		break;
		case ("Online"):
		$(".online").removeClass("hidden");
		$(".offline").addClass("hidden");
		$(".onlineBtn").addClass("menuActive");
		break;
		case ("Offline"):
		$(".offline").removeClass("hidden");
		$(".online").addClass("hidden");
		$(".offlineBtn").addClass("menuActive");
		break;

	}

}

function moveMenu(width){
	if (width <= 750) {
		$("#topMenu").addClass("hidden");
		$("#botMenu").removeClass("hidden");
		$(".menuBtn").css("width","100%");
	} else {
		$("#topMenu").removeClass("hidden");
		$("#botMenu").addClass("hidden");
		$(".menuBtn").css("width","");
	}
}

$(document).ready(function(){
	var channels=["freecodecamp","riotgames","summit1g","esl_sc2","ogamingsc2","PlayOverwatch","dotamajor","voyboy","scarra"];

	addChannelsToDiv(channels);
	for(var i=0;i<channels.length;i++){
		getChannel(channels[i]);
		getStream(channels[i]);
	}

	var onLoadWidth = $(window).width();
	var resizeWidth = $(window).width();

	moveMenu(onLoadWidth);
	restackDiv(resizeWidth,channels,channels.length);

	$(window).resize(function () {
		resizeWidth = $(window).width();
		restackDiv(resizeWidth,channels,channels.length);
		moveMenu(resizeWidth);
	});
	$(".menuBtn").click(function(){filter(this);});


	$(".searchForm").submit(function(e){
		e.preventDefault();
		var searchName=$("#streamerName").val()
		$(".displayName").each(function(){
			var dispName=$(this).text();
			var reg=new RegExp(searchName,"ig");
			if(reg.test(dispName)){
				$(this).parent().parent().removeClass("sHidden");
			}else{
				$(this).parent().parent().addClass("sHidden");
			}
		});

	});
	return false;
});
