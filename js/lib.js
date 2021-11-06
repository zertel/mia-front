cl("lib.js yüklendi");

mia.yukluSlaytlar = {};
mia.slaytYoneticisi = {

	varsayilanAyarlar: {
		"beklet":0,
		"tekrarEt":0,
		"belirmeSuresi": 2000,
		"beklemeSuresi": 3000,
		"kaybolmaSuresi": 1000,
		"slaytAyarlari": [
			/*/
			{
				"belirmeSuresi": 0,
				"beklemeSuresi": 0,
				"kaybolmaSuresi": 0
			},
			{
				"belirmeSuresi": 0,
				"beklemeSuresi": 0,
				"kaybolmaSuresi": 0
			},
			{
				"belirmeSuresi": 0,
				"beklemeSuresi": 0,
				"kaybolmaSuresi": 0
			}
			/*/
		],
		"bittigindeCalistir": function(){},
	},


	// Slayt geçişi yapılacak html grubunun varsayılan slayt özelliklerine sahip olabilmesi ve ayarlarının yapılabilmesi için tanımlama fonksiyonu
	tanimla: function(id,ayarlar){
		cl("slaytYoneticisi istendi "+id);

		mia.yukluSlaytlar[id]={
			"slaytYoneticisi":document.querySelector(id),
			"slaytlar":document.querySelectorAll(id+' .slayt'),
			"no":-1,
			"beklet":0,
			"ayarlar":{}
		};
		
		// Eğer özel ayar tanımlanmış ise onu kullan, tanımlanmamış ise varsayılan ayarları kullan
		if(ayarlar){
			if(typeof(ayarlar)=="object"){
				mia.yukluSlaytlar[id].ayarlar = ayarlar;
				if(!mia.yukluSlaytlar[id].ayarlar.tekrarEt){
					mia.yukluSlaytlar[id].ayarlar.tekrarEt=mia.slaytYoneticisi.varsayilanAyarlar.tekrarEt;
				}
				if(!mia.yukluSlaytlar[id].ayarlar.belirmeSuresi){
					mia.yukluSlaytlar[id].ayarlar.belirmeSuresi=mia.slaytYoneticisi.varsayilanAyarlar.belirmeSuresi;
				}
				if(!mia.yukluSlaytlar[id].ayarlar.beklemeSuresi){
					mia.yukluSlaytlar[id].ayarlar.beklemeSuresi=mia.slaytYoneticisi.varsayilanAyarlar.beklemeSuresi;
				}
				if(!mia.yukluSlaytlar[id].ayarlar.kaybolmaSuresi){
					mia.yukluSlaytlar[id].ayarlar.kaybolmaSuresi=mia.slaytYoneticisi.varsayilanAyarlar.kaybolmaSuresi;
				}
				if(!mia.yukluSlaytlar[id].ayarlar.slaytAyarlari){
					mia.yukluSlaytlar[id].ayarlar.slaytAyarlari=mia.slaytYoneticisi.varsayilanAyarlar.slaytAyarlari;
				}
				if(!mia.yukluSlaytlar[id].ayarlar.bittigindeCalistir){
					mia.yukluSlaytlar[id].ayarlar.bittigindeCalistir=mia.slaytYoneticisi.varsayilanAyarlar.bittigindeCalistir;
				}
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
		var aktifSlayt=mia.yukluSlaytlar[id];
		aktifSlayt.no=0;
		aktifSlayt.beklet=0;
		mia.slaytYoneticisi.sonraki(id);
	},

	beklet: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];
		aktifSlayt.beklet=1;
		mia.slaytYoneticisi.sonraki(id);
	},
	
	devamEt: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];
		aktifSlayt.beklet=0;
		mia.slaytYoneticisi.sonraki(id);
	},





	sonraki: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];

		if(aktifSlayt.beklet == 0){

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

		}

		mia.slaytYoneticisi.goster(id, function(){mia.slaytYoneticisi.sonraki(id)});
	},


	onceki: function(id){
		var aktifSlayt=mia.yukluSlaytlar[id];

		if(aktifSlayt.beklet == 0){
			aktifSlayt.no--;

			if(aktifSlayt.no < 0){
				if(aktifSlayt.ayarlar.tekrarEt){
					aktifSlayt.no = aktifSlayt.slaytlar.length;
				}
				else{
					return;
				}
			}
		}

		mia.slaytYoneticisi.goster(id, function(){mia.slaytYoneticisi.onceki(id)});
	},

	goster: function(id,bittigindeCalistir){

		var slayt=document.querySelector(id).querySelectorAll('.slayt');
		if(slayt.length>0){
			var aktifSlayt=mia.yukluSlaytlar[id];
			var belirmeSuresi = 
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no] &&
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].belirmeSuresi 
					? aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].belirmeSuresi 
					: aktifSlayt.ayarlar.belirmeSuresi;
			var beklemeSuresi = 
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no] &&
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].beklemeSuresi 
					? aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].beklemeSuresi 
					: aktifSlayt.ayarlar.beklemeSuresi;
			var kaybolmaSuresi = 
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no] &&
					aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].kaybolmaSuresi 
					? aktifSlayt.ayarlar.slaytAyarlari[aktifSlayt.no].kaybolmaSuresi 
					: aktifSlayt.ayarlar.kaybolmaSuresi;

			slayt[ aktifSlayt.no ].style.opacity = "0";
			slayt[ aktifSlayt.no ].style.display = "block";
			setTimeout(function(){ 

				slayt[ aktifSlayt.no ].style.transition = "opacity "+(belirmeSuresi/1000).toFixed(2)+"s";
				slayt[ aktifSlayt.no ].style.opacity = "1";

				setTimeout(function(){ 

					setTimeout(function(){ 
						slayt[ aktifSlayt.no ].style.transition = "opacity "+(kaybolmaSuresi/1000).toFixed(2)+"s";
						slayt[ aktifSlayt.no ].style.opacity = "0";
						
						setTimeout(function(){ 
							//aktifSlayt.slaytlar[ aktifSlayt.no ].style.display = "none";
							slayt[ aktifSlayt.no ].style.display = "none";

							bittigindeCalistir(id);

						},kaybolmaSuresi);

					},beklemeSuresi);

				},belirmeSuresi);

			},20);
		}
	}

}






// Ses yöneticisi
mia.yukluSesler = {};
mia.sesYoneticisi = {

	yukle: function(id,dosyaAdresi){
		mia.yukluSesler[id] = new Audio(dosyaAdresi);
	},

	oynat: function(id){
		if(mia.yukluSesler[id]){
			mia.yukluSesler[id].play();
		}
	},

	duraklat: function(id){
		if(mia.yukluSesler[id]){
			mia.yukluSesler[id].pause();
		}
	},

	durdur: function(id){
		if(mia.yukluSesler[id]){
			mia.yukluSesler[id].pause();
			mia.yukluSesler[id].currentTime = 0;
		}
	}

};