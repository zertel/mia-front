cl("app.js yüklendi");




window.onload = function(){


	// Sayfa ilk yüklendiğinde, üyelik girişinin olup olmadığını, ajax isteği ile öğren
	ajaxGet('http://localhost:83/hesap/giris',function(donenCevap){

		if(donenCevap){
			cl("Hesap giriş bilgileri geldi");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				mia.sayfaYukle('acikDunya');
			}
			else{
				mia.sayfaYukle('anasayfa');
			}
		}
		
	});


	//mia.sayfaYukle('uyelikGirisi');
	//mia.sayfaYukle('hesapOlustur');
	//mia.sayfaYukle('canavarlarim');
	//mia.sayfaYukle('intro');
};