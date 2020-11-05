mia.acikDunya={};

// acikDunya page onload function
mia.acikDunya.yuklendiginde = function(){
	cl("acikDunya.yuklendiginde() fonksiyonu çalıştı");

	// api üzerinden oyuncu konumlarını getir
	ajaxGet('http://localhost/mia-api/oyuncu-konumlari/',function(donenCevap){

		if(donenCevap){
			cl("'oyuncuKonumlari' api üzerinden yüklendi (URL http://localhost/mia-api/oyuncu-konumlari/)");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var oyuncuKonumlari = JSON.parse(donenCevap);

			// objeye dönüşmüş oyuncuKonumlari verisini RAM'a (mia.acikDunya objemizin içine) yükle
			mia.acikDunya.oyuncuKonumlari = oyuncuKonumlari;

			// ram'a yüklenmiş oyuncuKonumlari' verisini ekrana yansıtan tetik fonksiyonu çağır
			mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
		}
		
	});

}


mia.acikDunya.canavarGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var canavar_id in mia.acikDunya.oyuncuKonumlari){
		var canavarGezginSimge = document.querySelector('#canavar_gezgin_simge_'+canavar_id);
		if(canavarGezginSimge){
			canavarGezginSimge.style.left=mia.acikDunya.oyuncuKonumlari[canavar_id].x+"px";
			canavarGezginSimge.style.top=mia.acikDunya.oyuncuKonumlari[canavar_id].y+"px";
		}
		else{
			parcaYukle('canavarGezginSimge', '#acik-dunya-sahne', mia.acikDunya.oyuncuKonumlari[canavar_id] );
		}
	}
};

mia.acikDunya.canavarGezginSimgeYeniKonum = function(canavar_id,x,y){
	mia.acikDunya.oyuncuKonumlari[canavar_id].x=x;
	mia.acikDunya.oyuncuKonumlari[canavar_id].y=y;
	mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
}