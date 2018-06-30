(function localVideosCrossfade() {
	 
	'use strict'
	var URL = window.URL || window.webkitURL
	
	videojs('vid', {
		controls: true,
		autoplay: true,
		muted: true
	});
   
	var fileInput = $('#fileInput');
	var files = [];
	
	var index;
	var count;
	var k = 0;
	
	//listen to input change
	fileInput.change(function () {
		
		files=[];
		
		for (var index = 0; index < fileInput[0].files.length; index++) {
			var file = fileInput[0].files[index];
			files.push(file);
		}
		index=0;
		count=0;
		
		//hide buttons
		$('#video-container').css("opacity", 1);
		$('#vid').css("display", "block");
		$('#button-container').css({"opacity": 0, "z-index":-1});
		
		//restart player when new files added
		updatePlayer(index, count);
	   
	});
	
	//add videos button listener
	$('#addButton').click(function () {
		fileInput.click();
	});
	
	//keep going button listener
	$('#playButton').click(function () {
		$('#video-container').css("opacity", 1);
		$('#button-container').css({"opacity": 0, "z-index":-1});
		videojs('vid').ready(function () {
			this.autoplay(true);
			this.play();
		})
	});
	
	//update player function
	function updatePlayer(i,c) {
		index=i;
		count=c;
		
		//apply fade if not the very first video
		if(count >0){
			$('#vid').fadeToggle(3000, 'linear');
		}
			
		if (files.length > 0) {
			
			videojs('vid').ready(function () {
				
				var player = this;
				player.autoplay(true);
				
				//set index to first video to create loop
				if(index >= files.length){
					index = 0;
				}
				
				//update source
				var fileType = files[index].type;
				var fileURL = URL.createObjectURL(files[index]);
				player.src({type: fileType.includes("mp4") ? fileType : "video/webm" , src: fileURL});
				
				//played through all videos, give user options to continue or add other videos
				if(index === 0 && count > 0){
					player.autoplay(false);
					$('#video-container').css("opacity", .5);
					$('#button-container').css({"opacity": 1, "z-index":99});
				}
				
				//track video progress
				player.on('timeupdate', function () {
					
					//fade out in last 5 sec
					if(this.currentTime() > this.duration() -5){
						if (k < 1) {//run only once
							
							$('#vid').fadeToggle(3000, 'linear',function(){
								$('#playButton').css("display", "block");
								$('#addButton').text("New Videos");
								
								//update the video player
								updatePlayer(++index, ++count, files);
							});
						}
						k++;
					}
				})
				k=0;//reset counter
			})
		}
	};
})()
