cl("lib.js yüklendi");

mia.slider = {

	aktif: {},

	tanimla: function(id){
		cl("slider istendi "+id);

		mia.slider.aktif[id]={
			"slider":document.querySelector(id),
			"slides":document.querySelectorAll(id+' .slide'),
			"no":-1
		};
		
		mia.slider.baslat(id);

	},

	baslat: function(id){
		mia.slider.sonraki(id);
	},

	sonraki: function(id){
		var aktifSlider=mia.slider.aktif[id];

		aktifSlider.no++;

		aktifSlider.slides[ aktifSlider.no ].style.display = "block";
		setTimeout(function(){ 
			aktifSlider.slides[ aktifSlider.no ].style.opacity = "1";

			setTimeout(function(){ 
				aktifSlider.slides[ aktifSlider.no ].style.transition = "opacity 1s";
				aktifSlider.slides[ aktifSlider.no ].style.opacity = "0";
				setTimeout(function(){ 
					aktifSlider.slides[ aktifSlider.no ].style.display = "none";




				},1000);


			},4000);
		},10);
	}

}
