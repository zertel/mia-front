mia.canavarDetay={};

// canavarDetay page onload function
mia.canavarDetay.yuklendiginde = function(){


	// api üzerinden canavarlarım verilerini getir
	ajaxGet('http://localhost:83/hesap/canavarDetay',function(donenCevap){
		if(donenCevap){
			cl("canavarlar api üzerinden yüklendi (URL http://localhost/mia-api/monsters/)");

			/*/
			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var canavarDetay = JSON.parse(donenCevap);

			// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
			for(i=0; i<canavarDetay.length; i++){
				mia.parcaYukle('canavar-kart','#canavarDetay', canavarDetay[i] );
			}
			/*/
		}

	});
}