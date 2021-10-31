mia.acikDunya={};

// acikDunya page onload function
mia.acikDunya.yuklendiginde = function(){
	cl("acikDunya.yuklendiginde() fonksiyonu çalıştı");

	// api üzerinden oyuncu konumlarını getiren fonksiyonu sürekli çağıran fonksiyonu çağır
	mia.acikDunya.konumlariSurekliYenile();
	/*/
	document.querySelector('#acik-dunya-sahne').addEventListener("click", function(e){
		var x,y;
		x = e.offsetX;
		y = e.offsetY;
		cl('x',x,'y',y);
		mia.acikDunya.canavarGezginSimgeYeniKonum(102,x,y);
	});
	/*/
	//mia.acikDunya.canavarGezginSimgeKonumlariGetir();


}


// api üzerinden oyuncu konumlarını getiren fonksiyon
mia.acikDunya.canavarGezginSimgeKonumlariGetir = function(){
	// api üzerinden oyuncu konumlarını getir
	ajaxGet(mia.global.apiHost+'/sahne/konumlariGetir/1',function(donenCevap){

		if(donenCevap){
			cl("Konumlar api üzerinden yüklendi (URL "+mia.global.apiHost+"/sahne/konumlariGetir/1')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){

				// objeye dönüşmüş oyuncuKonumlari verisini RAM'a (mia.acikDunya objemizin içine) yükle
				mia.acikDunya.oyuncuKonumlari = donenCevapJson.cevap.oyuncu.konum.degerler;

				// ram'a yüklenmiş oyuncuKonumlari' verisini ekrana yansıtan tetik fonksiyonu çağır
				mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
			}
		}
		
	});
};



mia.acikDunya.canavarGezginSimgeKonumlariGuncelle = function(){
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



mia.acikDunya.canavarGezginSimgeYeniKonum = function(canavar_id,x,y){
	mia.acikDunya.oyuncuKonumlari[canavar_id].x=x;
	mia.acikDunya.oyuncuKonumlari[canavar_id].y=y;
	mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
}



mia.acikDunya.konumlariSurekliYenile = function(){

	if(mia.aktifSayfa == 'acikDunya'){
		// api üzerinden oyuncu konumlarını getiren fonksiyonu çağır
		mia.acikDunya.canavarGezginSimgeKonumlariGetir();

		setTimeout(mia.acikDunya.konumlariSurekliYenile, 1000);
	}
}