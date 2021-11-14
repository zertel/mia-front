mia.oyuncuDetay={};

// oyuncuDetay page onload function
mia.oyuncuDetay.yuklendiginde = function(){


	if(mia.oturum.durum){

		var oyuncu_id = mia.oturum.hesap.id;

		if(oyuncu_id){

			// api üzerinden canavarlarım verilerini getir
			ajaxGet(mia.global.apiHost+'/oyuncu/detay/'+oyuncu_id,function(donenCevap){
				if(donenCevap){
					cl("oyuncu detay bilgisi api üzerinden yüklendi (URL "+mia.global.apiHost+'/oyuncu/detay/'+oyuncu_id+")");

					// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
					var donenCevapJson = JSON.parse(donenCevap);

					if(donenCevapJson.sonuc == 1){
						var oyuncu=donenCevapJson.cevap;

						document.getElementById('oyuncu-detay-img').src=mia.global.apiHost + "/monster/" + oyuncu.kullanici + ".png";
						document.getElementById('oyuncu-detay-kullanici').innerHTML=oyuncu.kullanici;
						document.getElementById('oyuncu-detay-ad').innerHTML=oyuncu.ad;
						document.getElementById('oyuncu-detay-soyad').innerHTML=oyuncu.soyad;
						document.getElementById('oyuncu-detay-dogumYili').innerHTML=oyuncu.dogumYili;
						document.getElementById('oyuncu-detay-miacoin').innerHTML="⚡"+oyuncu.miacoin;

						if(oyuncu.cinsiyet == 'K'){
							document.getElementById('oyuncu-detay-cinsiyet').innerHTML="Kadın";
						}
						else{
							document.getElementById('oyuncu-detay-cinsiyet').innerHTML="Erkek";
						}

						// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
						for(i=0; i<oyuncu.takim.length; i++){
							mia.parcaYukle('canavarKart','.takim', oyuncu.takim[i] );
						}
					}
				}

			});
		}

	}
	
}