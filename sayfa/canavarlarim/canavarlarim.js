mia.canavarlarim={
	yuklenenAdet: 0
};

// canavarlarim sayfası yüklendiğinde otomatik olarak, belirtilmiş komutları çalıştırır
mia.canavarlarim.yuklendiginde = function(){

	mia.canavarlarim.yukle();

}

// Her çağırıldığında, canavarların devamını ekrana yükler
mia.canavarlarim.yukle = function(){

	// istenen adet aralığındaki canavarları api üzerinden getir
	ajaxGet('http://localhost:83/hesap/canavarlarim/' + ( mia.canavarlarim.yuklenenAdet ? mia.canavarlarim.yuklenenAdet + '/10': '10' ),function(donenCevap){
		if(donenCevap){
			cl("canavarlar api üzerinden yüklendi (URL "+'http://localhost:83/hesap/canavarlarim/' + ( mia.canavarlarim.yuklenenAdet ? mia.canavarlarim.yuklenenAdet + '/10': '10' )+")");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			// Ekranda var ise, daha fazla yükle butonunu siler
			var dhFzBtn=document.getElementsByClassName('daha-fazla-btn');
			if(dhFzBtn.length>0){
				for(i=0; i<dhFzBtn.length; i++){
					dhFzBtn[i].remove();
				}
			}
				

			if(donenCevapJson.sonuc == 1){

				if(donenCevapJson.cevap.length>0){

					var canavarlarim = donenCevapJson.cevap;

					// objeye dönüşmüş canavarlar verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana basar
					for(i=0; i<canavarlarim.length; i++){
						mia.parcaYukle('canavarKart', '#canavarlarim-sahne .ust-panel', canavarlarim[i]);
						mia.canavarlarim.yuklenenAdet++;
					}

					// gösterim tamamlandıktan sonra daha fazla yükle butonu oluşturur
					setTimeout(function(){
						mia.parcaYukle('dahaFazlaBtn', '#canavarlarim-sahne .ust-panel', {sayfaAdi:"canavarlarim", fonksiyonAdi:"yukle"});
					},10);

				}
			}

		}

	});

}
