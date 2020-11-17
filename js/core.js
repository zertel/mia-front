// Çekirdek değişken tanımlamalarımız
if(!mia)var mia={};
mia.yukluSayfalar={};
			

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
mia.sayfaYukle = function(sayfaAdi){
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
			if(!mia.yukluSayfalar[sayfaAdi].style){
				var link = document.createElement('link');
				link.href = styleAdress;
				link.rel = 'stylesheet';
				document.head.appendChild(link);

				// yüklemesi tamamlanmış css dosyasını yüklenmişler dizisine dahil et
				mia.yukluSayfalar[sayfaAdi].style=styleAdress;
			}
		}
		
	});
}


mia.yukluParcalar=[];
mia.parcaYukle = function(parcaAdi,hedefAdresi,data){
	if(mia.yukluParcalar[parcaAdi]){
		mia.parcaYerlestir(parcaAdi,hedefAdresi,data);
	}
	else{
		ajaxGet('parca/'+parcaAdi+'/'+parcaAdi+'.html', function(donenCevap){ 
			mia.yukluParcalar[parcaAdi]=donenCevap;
			mia.parcaYerlestir(parcaAdi,hedefAdresi,data);
			//cl(parcaAdi + ' isimli parça yüklendi ve yerleştirildi');
		});
	}
}
mia.parcaYerlestir = function(parcaAdi,hedefAdresi,data){
	if(mia.yukluParcalar[parcaAdi]){
		var parcaIcerigi=mia.yukluParcalar[parcaAdi];
		for(key in data){
			parcaIcerigi = parcaIcerigi.replace(new RegExp('{{'+key+'}}', "g"),data[key]);
		}
		document.querySelector(hedefAdresi).innerHTML += parcaIcerigi;
		cl(parcaAdi + ' isimli parça yerleştirildi');
	}
}



window.onload = function(){
	//mia.sayfaYukle('acikDunya');
	//mia.sayfaYukle('canavarlarim');
	mia.sayfaYukle('intro');
};