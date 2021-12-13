// Çekirdek değişken tanımlamalarımız
if(!mia)var mia={};
mia.yukluSayfalar={};

//Çekirdek ayarlar
mia.global={
	apiHost: 'http://localhost:83'
};

// Ufak Yardımcı Fonksiyonlar
var cl = console.log;


cl("core.js yüklendi");


// AJAX FONKSIYONLARI
function ajaxGet(url,callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}


// AJAX POST (html formu oku ajax olarak gönder)

// KULLANIMI
// ajaxPostGonder( 'iof-'+id, function(sonuc){
// 			alert('bitti'+sonuc);
// });
function ajaxPostGonder(formId,CB){
	var http = new XMLHttpRequest();
	var form = document.getElementById(formId);
	var formData=new FormData(form);
	http.open("POST",form.getAttribute('action'),true);

	//http.setRequestHeader('Content-type',"application/x-www-form-urlencoded");

	http.onreadystatechange = function () {
		if(http.readyState == 4 && http.status == 200 ){
			CB(http.responseText);
		}
	} 
	http.send(formData);

	return false;
}






// Ajax get yardımı ile seçili sayfayı yükler ve ekrandaki main etiketinin içine basar
mia.sayfaYukle = function(sayfaAdi,parametre){
	if(parametre){
		window.location.hash=parametre;
	}
	
	document.body.style.opacity=0;
	ajaxGet('sayfa/'+sayfaAdi+'/'+sayfaAdi+'.html', function(donenCevap){ 

		// Ajax sonucu dönen cevabı main etiketinin içine yapıştır
		document.querySelector('main').innerHTML = donenCevap;
		mia.aktifSayfa = sayfaAdi;
		mia.yukluSayfalar[sayfaAdi]={};
		
		cl(sayfaAdi + ' isimli sayfa yüklendi');
		
		// Yüklemesi tamamalanmış sayfanın javascript dosyasını da yükle (eğer aksi belirtilmemiş ise)
		if(donenCevap.indexOf('<!-- JAVASCRIPT YOK -->')==-1){
			// js dosyasının adresini hazırla
			var scriptAdress='sayfa/'+sayfaAdi+'/'+sayfaAdi+'.js';

			// aynı adrese sahip bir dosya yüklenmemiş ise yükleme için devam et
			if(!mia.yukluSayfalar[sayfaAdi].script){
				var script = document.createElement('script');
				script.src = scriptAdress;
				document.head.appendChild(script);

				// yüklemesi tamamlanmış js dosyasını yüklenmişler dizisine dahil et
				mia.yukluSayfalar[sayfaAdi].script=scriptAdress;

				// script tamamen yüklendikten sonra çalışması gereken fonksiyonu otomatik olarak tetikle
				script.onload = function(){
					setTimeout(function(){
						if(mia[sayfaAdi]['yuklendiginde']){
							mia[sayfaAdi]['yuklendiginde']();
						}
					},10);
				}
			}
			// seçili dosya daha önceden yüklenmiş ise içerisindeki tetik fonksiyonu çalıştır (bu tekrar yüklenmiş hissiyatı veriyor)
			else{
				setTimeout(function(){
					if(mia[sayfaAdi]['yuklendiginde']){
						mia[sayfaAdi]['yuklendiginde']();
					}
				},10);
			}

		}
		
		// Yüklemesi tamamalanmış sayfanın style(css) dosyasını da yükle (eğer aksi belirtilmemiş ise)
		if(donenCevap.indexOf('<!-- CSS YOK -->')==-1){
			// css dosyasının adresini hazırla
			var styleAdress='sayfa/'+sayfaAdi+'/'+sayfaAdi+'.css';
			// aynı adrese sahip bir dosya yüklenmemiş ise yükleme için devam et
			if(!mia.yukluSayfalar[sayfaAdi].style){
				var link = document.createElement('link');
				link.href = styleAdress;
				link.rel = 'stylesheet';
				document.head.appendChild(link);

				// yüklemesi tamamlanmış css dosyasını yüklenmişler dizisine dahil et
				mia.yukluSayfalar[sayfaAdi].style=styleAdress;
			}
		}

		document.body.style.opacity=1;
	});
}


mia.yukluParcalar=[];
mia.parcaYukle = function(parcaAdi,hedefAdresi,data,CB,PCB){
	if(mia.yukluParcalar[parcaAdi]){ 
		if(mia.yukluParcalar[parcaAdi]!="Parça yüklenemedi"){
			if(CB)CB();
			if(!PCB)PCB=0;
			mia.parcaYerlestir(parcaAdi,hedefAdresi,data,PCB);
		}
		else{
			setTimeout(function(){
				mia.parcaYukle(parcaAdi,hedefAdresi,data,CB,PCB);
			},1);
		}
	}
	else{
		mia.yukluParcalar[parcaAdi]="Parça yüklenemedi";
		ajaxGet('parca/'+parcaAdi+'/'+parcaAdi+'.html', function(donenCevap){ 
			if(CB)CB();

			mia.yukluParcalar[parcaAdi]=donenCevap;
			cl(parcaAdi + ' isimli parça yüklendi');
			if(!PCB)PCB=0;
			mia.parcaYerlestir(parcaAdi,hedefAdresi,data,PCB);
		});
	}
}
mia.parcaYerlestir = function(parcaAdi,hedefAdresi,data,CB){
	if(mia.yukluParcalar[parcaAdi]){
		var parcaIcerigi=mia.yukluParcalar[parcaAdi];
		for(key in data){
			parcaIcerigi = parcaIcerigi.replace(new RegExp('{{'+key+'}}', "g"),data[key]);
		}
		document.querySelector(hedefAdresi).innerHTML += parcaIcerigi;

		if(CB)CB(data);
		cl(parcaAdi + ' isimli parça yerleştirildi');
	}
}

mia.parcaCokluYukle = function(parcaAdi,hedefAdresi,data,CB,PCB){
	if(mia.yukluParcalar[parcaAdi]){ 
		if(mia.yukluParcalar[parcaAdi]!="Parça yüklenemedi"){
			if(CB)CB();
			if(!PCB)PCB=0;
			mia.parcaCokluYerlestir(parcaAdi,hedefAdresi,data,PCB);
		}
	}
	else{
		mia.yukluParcalar[parcaAdi]="Parça yüklenemedi";
		ajaxGet('parca/'+parcaAdi+'/'+parcaAdi+'.html', function(donenCevap){ 
			if(CB)CB();

			mia.yukluParcalar[parcaAdi]=donenCevap;
			cl(parcaAdi + ' isimli parça yüklendi');
			if(!PCB)PCB=0;
			mia.parcaCokluYerlestir(parcaAdi,hedefAdresi,data,PCB);
		});
	}
}
mia.parcaCokluYerlestir = function(parcaAdi,hedefAdresi,data,CB){
	if(data && mia.yukluParcalar[parcaAdi]){
		for(i in data){
			mia.parcaYerlestir(parcaAdi,hedefAdresi,data[i],CB);
		}
	}
	else cl(parcaAdi + ' yüklenmeden yerleştirme istendi.');
}


mia.oturum = {
	durum: 0,
	hesap: {
		//id: 1,
		//kullaniciAdi: "zertel",
		//eposta: "mail@zertel.net",
		//ad: "Orhan",
		//soyad: "TUTUM",
		//sahne_id: 1
	},

	giris: function(oturumJson){
		if(oturumJson.sonuc == 1){
			localStorage.miaOturum=JSON.stringify({
				durum: oturumJson.sonuc,
				hesap: oturumJson.cevap
			});
			return 1;
		}
		return 0;
	},

	cikis: function(sayfaAdi){
		if(!sayfaAdi){
			sayfaAdi='anasayfa';
		}
		// api üzerinden üyelik çıkışı gerçekleştir ve localStorage'yi temizle
		ajaxGet(mia.global.apiHost + '/hesap/cikis',function(donenCevap){
			if(donenCevap){
				var donenCevapJson = JSON.parse(donenCevap);
				if(donenCevapJson.sonuc == 1){
					delete localStorage.miaOturum;
					mia.sayfaYukle(sayfaAdi);
				}
			}
		});
	},

	localStorageMiaOturumKontrol: function(){
		cl("localStorageMiaOturumKontrol() fonksiyonu çalıştı.");
		if(localStorage.miaOturum){
			var lsMiaOturum=JSON.parse(localStorage.miaOturum);
			if(lsMiaOturum.durum==1){
				mia.oturum.durum=lsMiaOturum.durum;
				mia.oturum.hesap=lsMiaOturum.hesap;
				mia.oturum.hesap.sahne_id=1;
			}
		}
	}
};




mia.pencere = {
	ac: function(pencereId,ayarlar,CB){

		if(!ayarlar)ayarlar={};
		if(!ayarlar.width)ayarlar.width="400px";
		if(!ayarlar.height)ayarlar.height="200px";
		if(!ayarlar.icerik)ayarlar.icerik="";


		// Eğer yok ise pencereyi oluştur (create html elements)
		if(!document.getElementById('pencere-'+pencereId)){
			document.body.insertAdjacentHTML("beforeend", '\
				<div class="pencere" id="pencere-' + pencereId + '" style="display:block; width:'+ayarlar.width+'; height:'+ayarlar.height+';">\
					<div style="text-align: right;"><button type="button" onclick="mia.pencere.kapat(\'' + pencereId + '\')">x</button></div>\
					<div class="pencere-icerik">\
						<h3 style="color:#777; text-align:center; margin-top:50px;">Yükleniyor...</h3>\
					</div>\
				</div>\
			');
		}

		if(ayarlar && ayarlar.parcaApiUrl){
			ajaxGet(ayarlar.parcaApiUrl, function(donenCevap){
				if(donenCevap){
					cl(pencereId+" idli pencere detayı api üzerinden yüklendi (URL " + ayarlar.parcaApiUrl + ")");

					// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
					var donenCevapJson = JSON.parse(donenCevap);

					if(donenCevapJson.sonuc == 1){
						
						mia.parcaYukle(ayarlar.parcaAdi,'#pencere-' + pencereId + " .pencere-icerik", donenCevapJson.cevap, function(){ 
							document.querySelector('#pencere-' + pencereId + " .pencere-icerik").innerHTML=ayarlar.icerik;
							if(CB)CB(donenCevapJson.cevap);
						} );
					}
				}
			});
		}

		if(ayarlar && ayarlar.icerik){
			document.querySelector('#pencere-' + pencereId + " .pencere-icerik").innerHTML=ayarlar.icerik;
		}


	},

	kapat: function(pencereId){
		document.querySelector('#pencere-' + pencereId).remove();
	},
};



mia.panel = {
	ac: function(panelId,ayarlar,CB){

		if(!ayarlar)ayarlar={};
		if(!ayarlar.width)ayarlar.width="auto";
		if(!ayarlar.height)ayarlar.height="auto";
		if(!ayarlar.icerik)ayarlar.icerik="";
		if(!ayarlar.cokluParca)ayarlar.cokluParca=0;


		// Eğer yok ise pencereyi oluştur (create html elements)
		if(!document.getElementById('panel-'+panelId)){
			document.body.insertAdjacentHTML("beforeend", '\
				<div class="panel" id="panel-' + panelId + '" style="display:block; width:'+ayarlar.width+'; height:'+ayarlar.height+';z-index:101;">\
					<div style="position:fixed;top:0;right:0;bottom:'+ayarlar.height+';left:0;" onclick="mia.panel.kapat(\'' + panelId + '\')">&nbsp;</div>\
					<div class="panel-icerik">\
						<h3 style="color:#fff; text-align:center;">Yükleniyor...</h3>\
					</div>\
				</div>\
			');
		}

		if(ayarlar && ayarlar.parcaApiUrl){
			ajaxGet(ayarlar.parcaApiUrl, function(donenCevap){
				if(donenCevap){
					cl(panelId+" idli panel detayı api üzerinden yüklendi (URL " + ayarlar.parcaApiUrl + ")");

					// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
					var donenCevapJson = JSON.parse(donenCevap);

					if(donenCevapJson.sonuc == 1){
						
						var xcb=function(){ 
							document.querySelector('#panel-' + panelId + " .panel-icerik").innerHTML=ayarlar.icerik;
							if(CB)CB(donenCevapJson.cevap);
						};

						if(ayarlar.cokluParca){
							mia.parcaCokluYukle(ayarlar.parcaAdi,'#panel-' + panelId + " .panel-icerik", donenCevapJson.cevap, xcb );
						}
						else{
							mia.parcaYukle(ayarlar.parcaAdi,'#panel-' + panelId + " .panel-icerik", donenCevapJson.cevap, xcb );
						}
					}
				}
			});
		}

		if(ayarlar && ayarlar.icerik){
			document.querySelector('#panel-' + panelId + " .panel-icerik").innerHTML=ayarlar.icerik;
		}


	},

	kapat: function(panelId){
		document.querySelector('#panel-' + panelId).remove();
	},
};


mia.animasyon = function(hedefAdresi, ayarlar){
	var element = document.querySelector(hedefAdresi);
	if(element && ayarlar){

		var ek = {'width':'px','height':'px','top':'px','right':'px','bottom':'px','left':'px'};

		element.style.transition = '';
		for(i in ayarlar){
			switch( typeof(ayarlar[i]) ){
				case "object":
					var baslangicDegeri = ayarlar[i][0]; 
					var sure = ayarlar[i][2];

					if(i != 'display'){
						element.style.transitionProperty += (element.style.transitionProperty?',':'') + i;
						element.style.transitionDuration += (element.style.transitionDuration?',':'') + sure + "s";
						element.style[i] = baslangicDegeri + (ek[i] ? ek[i] : '');
					}
					break;
				case "string":
					element.style[i] = ayarlar[i] + (ek[i] ? ek[i] : '');
					break;
			}
		}

		setTimeout(function(){
			for(i in ayarlar){
				switch( typeof(ayarlar[i]) ){
					case "object":
						if(i != 'display'){
							var bitisDegeri = ayarlar[i][1];
							element.style[i] = bitisDegeri + (ek[i] ? ek[i] : '');
						}
						break;
				}
			}
		},1);

		if(ayarlar['display'] && typeof(ayarlar['display']) == 'object'){
			var sure = ayarlar['display'][2];
			var bitisDegeri = ayarlar['display'][1];
			setTimeout(function(){
				element.style['display'] = bitisDegeri;
			},sure*1000);
		}

	}
}