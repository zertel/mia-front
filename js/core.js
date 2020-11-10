// Çekirdek değişken tanımlamalarımız
if(!mia)var mia={};
if(!mia.loadedScripts)mia.loadedScripts=[];
if(!mia.loadedStyles)mia.loadedStyles=[];
			

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




// Ajax get yardımı ile seçili sayfayı yükler ve ekrandaki main etiketinin içine basar
function sayfaYukle(sayfaAdi){
	ajaxGet('sayfa/'+sayfaAdi+'/'+sayfaAdi+'.html', function(donenCevap){ 
		// Ajax sonucu dönen cevabı main etiketinin içine yapıştır
		document.querySelector('main').innerHTML = donenCevap;
		mia.aktifSayfa = sayfaAdi;
		cl(sayfaAdi + ' isimli sayfa yüklendi');
		
		// Yüklemesi tamamalanmış sayfanın javascript dosyasını da yükle (eğer aksi belirtilmemiş ise)
		if(donenCevap.indexOf('<!-- JAVASCRIPT YOK -->')==-1){
			// js dosyasının adresini hazırla
			var scriptAdress='sayfa/'+sayfaAdi+'/'+sayfaAdi+'.js';

			// aynı adrese sahip bir dosya yüklenmemiş ise yükleme için devam et
			if(mia.loadedScripts.includes(scriptAdress)==false){
				var script = document.createElement('script');
				script.src = scriptAdress;
				document.head.appendChild(script);

				// yüklemesi tamamlanmış js dosyasını yüklenmişler dizisine dahil et
				mia.loadedScripts.push(scriptAdress);

				// script tamamen yüklendikten sonra çalışması gereken fonksiyonu otomatik olarak tetikle
				script.onload = function(){
					if(mia[sayfaAdi]['yuklendiginde']){
						mia[sayfaAdi]['yuklendiginde']();
					}
				}
			}
			// seçili dosya daha önceden yüklenmiş ise içerisindeki tetik fonksiyonu çalıştır (bu tekrar yüklenmiş hissiyatı veriyor)
			else{
				if(mia[sayfaAdi]['yuklendiginde']){
					mia[sayfaAdi]['yuklendiginde']();
				}
			}

		}
		
		// Yüklemesi tamamalanmış sayfanın style(css) dosyasını da yükle (eğer aksi belirtilmemiş ise)
		if(donenCevap.indexOf('<!-- CSS YOK -->')==-1){
			// css dosyasının adresini hazırla
			var styleAdress='sayfa/'+sayfaAdi+'/'+sayfaAdi+'.css';
			// aynı adrese sahip bir dosya yüklenmemiş ise yükleme için devam et
			if(mia.loadedStyles.includes(styleAdress)==false){
				var link = document.createElement('link');
				link.href = styleAdress;
				link.rel = 'stylesheet';
				document.head.appendChild(link);

				// yüklemesi tamamlanmış css dosyasını yüklenmişler dizisine dahil et
				mia.loadedStyles.push(styleAdress);
			}
		}
		
	});
}


var parcalar=[];
function parcaYukle(parcaAdi,hedefAdresi,data){
	if(parcalar[parcaAdi]){
		parcaYerlestir(parcaAdi,hedefAdresi,data);
	}
	else{
		ajaxGet('parca/'+parcaAdi+'/'+parcaAdi+'.html', function(donenCevap){ 
			parcalar[parcaAdi]=donenCevap;
			parcaYerlestir(parcaAdi,hedefAdresi,data);
			//cl(parcaAdi + ' isimli parça yüklendi ve yerleştirildi');
		});
	}
}
function parcaYerlestir(parcaAdi,hedefAdresi,data){
	if(parcalar[parcaAdi]){
		var parcaIcerigi=parcalar[parcaAdi];
		for(key in data){
			parcaIcerigi = parcaIcerigi.replace(new RegExp('{{'+key+'}}', "g"),data[key]);
		}
		document.querySelector(hedefAdresi).innerHTML += parcaIcerigi;
		cl(parcaAdi + ' isimli parça yerleştirildi');
	}
}



window.onload = function(){
	sayfaYukle('acikDunya');
	//sayfaYukle('canavarlarim');
};