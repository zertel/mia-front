cl("lib.js yüklendi");

mia.yukluSlaytlar = {};
mia.slaytYoneticisi = {

	varsayilanAyarlar: {
		"tekrarEt":0,
		"bittigindeCalistir": function(){}
	},


	// Slayt geçişi yapılacak html grubunun varsayılan slayt özelliklerine sahip olabilmesi ve ayarlarının yapılabilmesi için tanımlama fonksiyonu
	tanimla: function(id,ayarlar){
		cl("slaytYoneticisi istendi "+id);

		mia.yukluSlaytlar[id]={
			"slaytYoneticisi":document.querySelector(id),
			"slaytlar":document.querySelectorAll(id+' .slayt'),
			"no":-1
		};
		
		// Eğer özel ayar tanımlanmış ise onu kullan, tanımlanmamış ise varsayılan ayarları kullan
		if(ayarlar){
			if(typeof(ayarlar)=="object"){
				mia.yukluSlaytlar[id].ayarlar = ayarlar;
			}
			else if(typeof(ayarlar)=="function"){
				mia.yukluSlaytlar[id].ayarlar = mia.slaytYoneticisi.varsayilanAyarlar;
				mia.yukluSlaytlar[id].ayarlar.bittigindeCalistir = ayarlar;
			}
		}
		else{
			mia.yukluSlaytlar[id].ayarlar = mia.slaytYoneticisi.varsayilanAyarlar;
		}

		mia.slaytYoneticisi.baslat(id);

	},





	baslat: function(id){
		mia.slaytYoneticisi.sonraki(id);
	},





	sonraki: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];

		aktifSlayt.no++;

		if(aktifSlayt.no >= aktifSlayt.slaytlar.length){
			if(aktifSlayt.ayarlar.tekrarEt){
				aktifSlayt.no = 0;
			}
			else{
				aktifSlayt.ayarlar.bittigindeCalistir();
				return;
			}
		}

		mia.slaytYoneticisi.goster(id, function(){mia.slaytYoneticisi.sonraki(id)});
	},


	onceki: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];

		aktifSlayt.no--;

		if(aktifSlayt.no < 0){
			if(aktifSlayt.ayarlar.tekrarEt){
				aktifSlayt.no = aktifSlayt.slaytlar.length;
			}
			else{
				return;
			}
		}

		mia.slaytYoneticisi.goster(id, function(){mia.slaytYoneticisi.onceki(id)});
	},

	goster: function(id,bittigindeCalistir){
		var aktifSlayt=mia.yukluSlaytlar[id];

		aktifSlayt.slaytlar[ aktifSlayt.no ].style.opacity = "0";
		aktifSlayt.slaytlar[ aktifSlayt.no ].style.display = "block";
		setTimeout(function(){ 
			aktifSlayt.slaytlar[ aktifSlayt.no ].style.opacity = "1";

			setTimeout(function(){ 
				aktifSlayt.slaytlar[ aktifSlayt.no ].style.transition = "opacity 1s";
				aktifSlayt.slaytlar[ aktifSlayt.no ].style.opacity = "0";
				setTimeout(function(){ 
					aktifSlayt.slaytlar[ aktifSlayt.no ].style.display = "none";

					bittigindeCalistir();
				},1000);
			},4000);

		},100);
	}

}
