mia.acikDunyaOnLoad = function(){
	cl("açık dünya fonksiyonu çalıştı");


	// api üzerinden oyuncu konumlarını getir
	ajaxGet('http://localhost/mia-api/oyuncukonumlari/',function(donenCevap){

		if(donenCevap){
			cl("oyuncukonumlari api üzerinden yüklendi (URL http://localhost/mia-api/oyuncukonumlari/)");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var oyuncukonumlari = JSON.parse(donenCevap);

			// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
			for(i=0; i<oyuncukonumlari.length; i++){
				parcaYukle('canavarGezginSimge', '#acik-dunya-sahne', oyuncukonumlari[i] );
			}
		}
		
	});

}


