mia.acikDunya={};

// acikDunya page onload function
mia.acikDunya.yuklendiginde = function(){
	cl("acikDunya.yuklendiginde() fonksiyonu çalıştı");

	// api üzerinden oyuncu konumlarını getiren fonksiyonu sürekli çağıran fonksiyonu çağır
	mia.acikDunya.konumlariSurekliYenile();

	setTimeout(function(){
		document.querySelector('#acik-dunya-sahne .container').addEventListener("click", function(e){
			var x,y;
			x = e.offsetX;
			y = e.offsetY;
			cl('x',x,'y',y);
			mia.acikDunya.hedefeGit(x,y);
		});
	},500);


}


// api üzerinden oyuncu konumlarını getiren fonksiyon
mia.acikDunya.konumlariGetir = function(){
	// api üzerinden oyuncu konumlarını getir
	ajaxGet(mia.global.apiHost+'/sahne/konumlariGetir/1',function(donenCevap){

		if(donenCevap){
			cl("Konumlar api üzerinden yüklendi (URL "+mia.global.apiHost+"/sahne/konumlariGetir/1')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){

				// objeye dönüşmüş oyuncuKonumlari verisini RAM'a (mia.acikDunya objemizin içine) yükle
				mia.acikDunya.oyuncuKonumlari = donenCevapJson.cevap.oyuncu.konum.degerler;
				mia.acikDunya.canavarKonumlari = donenCevapJson.cevap.canavar.konum.degerler;
				mia.acikDunya.dusmanKonumlari = donenCevapJson.cevap.dusman.konum.degerler;

				// ram'a yüklenmiş oyuncu ve canavar konumlari' verisini ekrana yansıtan tetik fonksiyonları çağır
				mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle();
				mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
				mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle();
			}
		}
		
	});
};

mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.oyuncuKonumlari){
		var canavar_id=mia.acikDunya.oyuncuKonumlari[key][1];

		var canavarGezginSimge = document.querySelector('#canavar_gezgin_simge_'+canavar_id);
		if(canavarGezginSimge){
			canavarGezginSimge.style.left=mia.acikDunya.oyuncuKonumlari[key][4]+"px";
			canavarGezginSimge.style.top=mia.acikDunya.oyuncuKonumlari[key][5]+"px";
		}
		else{
			var konumObj={
				canavar_id:canavar_id,
				x:mia.acikDunya.oyuncuKonumlari[key][2],
				y:mia.acikDunya.oyuncuKonumlari[key][3]
			}
			mia.parcaYukle('canavarGezginSimge', '#acik-dunya-sahne', konumObj);
		}
	}
};

mia.acikDunya.canavarGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış canavarKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.canavarKonumlari){
		var canavar_id=mia.acikDunya.canavarKonumlari[key][0];

		var canavarGezginSimge = document.querySelector('#canavar_gezgin_simge_'+canavar_id);
		if(canavarGezginSimge){
			canavarGezginSimge.style.left=mia.acikDunya.canavarKonumlari[key][1]+"px";
			canavarGezginSimge.style.top=mia.acikDunya.canavarKonumlari[key][2]+"px";
		}
		else{
			var konumObj={
				canavar_id:canavar_id,
				x:mia.acikDunya.canavarKonumlari[key][1],
				y:mia.acikDunya.canavarKonumlari[key][2]
			}
			mia.parcaYukle('canavarGezginSimge', '#acik-dunya-sahne', konumObj);
		}
	}
};

mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.dusmanKonumlari){
		var dusman_id=mia.acikDunya.dusmanKonumlari[key][0];

		var dusmanGezginSimge = document.querySelector('#dusman_gezgin_simge_'+dusman_id);
		if(dusmanGezginSimge){
			dusmanGezginSimge.style.left=mia.acikDunya.dusmanKonumlari[key][4]+"px";
			dusmanGezginSimge.style.top=mia.acikDunya.dusmanKonumlari[key][5]+"px";
		}
		else{
			var konumObj={
				dusman_id:dusman_id,
				tip:mia.acikDunya.dusmanKonumlari[key][1],
				x:mia.acikDunya.dusmanKonumlari[key][2],
				y:mia.acikDunya.dusmanKonumlari[key][3]
			}
			mia.parcaYukle('dusmanGezginSimge', '#acik-dunya-sahne', konumObj);
		}
	}
};



mia.acikDunya.hedefeGit = function(x,y){

	// api get isteği ile konumu değiştir
	ajaxGet(mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y, function(donenCevap){

		if(donenCevap){
			cl("hedefeGit apisi çalıştı: (URL "+mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y+"')");

			/*/
			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){

			}
			/*/
		}
		
	});
}



mia.acikDunya.konumlariSurekliYenile = function(){

	if(mia.aktifSayfa == 'acikDunya'){
		// api üzerinden oyuncu konumlarını getiren fonksiyonu çağır
		mia.acikDunya.konumlariGetir();

		setTimeout(mia.acikDunya.konumlariSurekliYenile, 1000);
	}
}