mia.intro={};

// intro page onload function
mia.intro.yuklendiginde = function(){

	mia.sesYoneticisi.yukle('intro','sayfa/intro/mp3/intro.mp3');
	mia.sesYoneticisi.oynat('intro');
	
	mia.slaytYoneticisi.tanimla('#intro.slayt-yoneticisi', function(){ 
		mia.sesYoneticisi.durdur('intro');
		mia.sayfaYukle('anasayfa');
	});

	/*/
	// api üzerinden canavarlarım verilerini getir
	ajaxGet('http://localhost/mia-api/intro/',function(donenCevap){

		if(donenCevap){
			cl("canavarlar api üzerinden yüklendi (URL http://localhost/mia-api/monsters/)");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var intro = JSON.parse(donenCevap);

			// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
			for(i=0; i<intro.length; i++){
				mia.parcaYukle('canavar-kart','#intro', intro[i] );
			}
		}
		
	});
	/*/
}