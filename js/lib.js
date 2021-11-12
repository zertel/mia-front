cl("lib.js yüklendi");


// Slayt yöneticisi
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

/*/ SLAYT TANIMLAMA ÖRNEĞİ

	mia.slaytYoneticisi.tanimla('#oyuncu_gezgin_simge_'+data.oyuncu_id+'_slayt', {
		tekrarEt: 0,
		slaytAyarlari: [
			{
				"belirmeSuresi": 1,
				"beklemeSuresi": 100,
				"kaybolmaSuresi": 1
			},
			{
				"belirmeSuresi": 1,
				"beklemeSuresi": 100,
				"kaybolmaSuresi": 1
			},
			{
				"belirmeSuresi": 1,
				"beklemeSuresi": 100,
				"kaybolmaSuresi": 1
			}
		],
		bittigindeCalistir: function(id){ 
			//mia.slaytYoneticisi.beklet(id);
		}
	});

	//mia.slaytYoneticisi.baslat('#oyuncu_gezgin_simge_'+mia.oturum.hesap.id+'_slayt');

/*/









// Ses yöneticisi
mia.yukluSesler = {};
mia.sesYoneticisi = {
	ortakSesDuzeyi: 0.1,
	kullanilabilir: 0,

	yukle: function(id,dosyaAdresi,sesDuzeyi){
		if(!sesDuzeyi)sesDuzeyi=0.4;
		mia.yukluSesler[id] = new Audio(dosyaAdresi);
		mia.yukluSesler[id].sesDuzeyi=sesDuzeyi;
		mia.yukluSesler[id].volume=sesDuzeyi;

		if(!mia.sesYoneticisi.kullanilabilirEvent){
			mia.sesYoneticisi.kullanilabilirEvent=1;
			document.body.addEventListener('click',function(){
				mia.sesYoneticisi.kullanilabilir=1;
			});
			
		}

	},

	oynat: function(id,baslangicZamani){
		if(mia.sesYoneticisi.kullanilabilir){
			mia.yukluSesler[id].volume = mia.yukluSesler[id].sesDuzeyi * mia.sesYoneticisi.ortakSesDuzeyi;

			if(baslangicZamani){
				mia.yukluSesler[id].currentTime = baslangicZamani;
			}
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
	},

	sesDuzeyi: function(id,sesDuzeyi){
		if(mia.yukluSesler[id]){
			mia.yukluSesler[id].sesDuzeyi = sesDuzeyi;
			mia.yukluSesler[id].volume = sesDuzeyi;
		}
	}

};

/*/ SES YÜKLEME VE ÖYNATMA ÖRNEĞİ

	mia.sesYoneticisi.yukle('intro','sayfa/intro/mp3/intro.mp3');
	mia.sesYoneticisi.oynat('intro'); // kaldığı yerden devam et
	mia.sesYoneticisi.duraklat('intro'); // pause
	mia.sesYoneticisi.durdur('intro'); // sonlandır
	
/*/








// Sprite yöneticisi
mia.yukluSpriteler = {};
mia.tanimliSpriteler = {};
mia.spriteYoneticisi = {
	yukle: function(spriteAdi,dosyaAdresi,ayarlar,CB){
		if(spriteAdi && dosyaAdresi){

			cl(spriteAdi+" isimli sprite yükleniyor...");
			var sprite = new Image();

			sprite.src = dosyaAdresi;
			mia.yukluSpriteler[spriteAdi] = sprite;
			mia.yukluSpriteler[spriteAdi].yuklendi=0;

			mia.yukluSpriteler[spriteAdi].ayarlar={};
			if(ayarlar.genislik){
				mia.yukluSpriteler[spriteAdi].ayarlar.genislik=ayarlar.genislik;
			}
			if(ayarlar.yukseklik){
				mia.yukluSpriteler[spriteAdi].ayarlar.yukseklik=ayarlar.yukseklik;
			}
			if(ayarlar.animasyon){
				mia.yukluSpriteler[spriteAdi].ayarlar.animasyon=ayarlar.animasyon;
			}

			sprite.onload=function(){
				mia.yukluSpriteler[spriteAdi].yuklendi=1;
				cl(spriteAdi+" isimli sprite yüklendi.");

				if(CB)CB(spriteAdi);
			};
		}
	},

	tanimla: function(hedefAdresi,spriteAdi){
		if(mia.yukluSpriteler && mia.yukluSpriteler[spriteAdi]){
			mia.tanimliSpriteler[hedefAdresi]={
				spriteAdi:spriteAdi,
				oynat:0
			};
			document.querySelector(hedefAdresi).style.backgroundImage="url(" + mia.yukluSpriteler[spriteAdi].src + ")";
		}
	},

	goster: function(hedefAdresi,x,y){
		var spriteAdi=mia.tanimliSpriteler[hedefAdresi].spriteAdi;
		document.querySelector(hedefAdresi).style.backgroundPosition = 
			(-((x-1)* mia.yukluSpriteler[spriteAdi].ayarlar.genislik )) + "px " + 
			(-((y-1)* mia.yukluSpriteler[spriteAdi].ayarlar.yukseklik )) + "px";
	},

	baslat: function(hedefAdresi,animasyonAdi,hiz){
		mia.tanimliSpriteler[hedefAdresi].oynat=1;
		mia.spriteYoneticisi.oynat(hedefAdresi,animasyonAdi,hiz);
	},

	durdur: function(hedefAdresi,animasyonAdi,hiz,frameNo){
		mia.tanimliSpriteler[hedefAdresi].oynat=0;
	},

	oynat: function(hedefAdresi,animasyonAdi,hiz,frameNo){
		if(hedefAdresi && animasyonAdi){

			var spriteAdi=mia.tanimliSpriteler[hedefAdresi].spriteAdi;
			var oynat=mia.tanimliSpriteler[hedefAdresi].oynat;
			if(mia.yukluSpriteler[spriteAdi].ayarlar.animasyon){
				var animasyon=mia.yukluSpriteler[spriteAdi].ayarlar.animasyon[animasyonAdi];
				
				if(!frameNo)frameNo=animasyon.x;

				mia.spriteYoneticisi.goster(hedefAdresi,frameNo,animasyon.y);

				if(oynat){
					if(frameNo<animasyon.son){
						frameNo++;
					}
					else{
						frameNo=0;
					}

					setTimeout(function(){
						mia.spriteYoneticisi.oynat(hedefAdresi,animasyonAdi,hiz,frameNo);
					},hiz);
				}
				else{
					mia.spriteYoneticisi.goster(hedefAdresi,1,animasyon.y);
				}
			}
		}
	}

};

/*/ SPRITE TANIMLAMA ÖRNEĞİ

	mia.spriteYoneticisi.yukle('oyuncu','sayfa/acikDunya/img/demo-char-80x120.png',{
		genislik: 20,
		yukseklik: 30,
		hiz: 100,
		animasyon: {
			yukarı:{x:1, y:2, son:4},
			sağa:{x:1, y:4, son:4},
			aşağı:{x:1, y:1, son:4},
			sola:{x:1, y:3, son:4}
		}
	},function(){

		mia.spriteYoneticisi.baslat('#oyuncu-1','down',100);
		mia.spriteYoneticisi.baslat('#oyuncu-2','right',100);

	});


	// Oynat ve hemen durdur
	mia.spriteYoneticisi.baslat('#oyuncu_gezgin_simge_'+oyuncu_id,'hasarAl',20);
	setTimeout(function(){
		mia.spriteYoneticisi.durdur('#oyuncu_gezgin_simge_'+oyuncu_id);
	},100);


/*/