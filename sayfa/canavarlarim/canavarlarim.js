mia.canavarlarim={};

// canavarlarim page onload function
mia.canavarlarim.yuklendiginde = function(){


	// api üzerinden canavarlarım verilerini getir
	ajaxGet('http://localhost:83/hesap/canavarlarim',function(donenCevap){
		if(donenCevap){
			cl("canavarlar api üzerinden yüklendi (URL http://localhost/mia-api/monsters/)");

			/*/
			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var canavarlarim = JSON.parse(donenCevap);

			// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
			for(i=0; i<canavarlarim.length; i++){
				mia.parcaYukle('canavar-kart','#canavarlarim', canavarlarim[i] );
			}
			/*/
		}

	});
}