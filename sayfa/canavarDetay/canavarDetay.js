mia.canavarDetay={};

// canavarDetay page onload function
mia.canavarDetay.yuklendiginde = function(){


	if(window.location.hash){

		var canavar_id = window.location.hash.split('#canavarId=')[1];

		if(canavar_id){

			// api üzerinden canavarlarım verilerini getir
			ajaxGet(mia.global.apiHost+'/canavar/detay/'+canavar_id,function(donenCevap){
				if(donenCevap){
					cl("canavar detay bilgisi api üzerinden yüklendi (URL "+mia.global.apiHost+'/canavar/detay/'+canavar_id+")");


					// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
					var donenCevapJson = JSON.parse(donenCevap);

					if(donenCevapJson.sonuc == 1){
						var canavar=donenCevapJson.cevap;
						canavar.takimAdi="Demo";
						canavar.bayginlik=0;

						document.getElementById('canavar-detay-img').src="monster/" + canavar.id + ".png";
						document.getElementById('canavar-detay-id').innerHTML=canavar.id;
						document.getElementById('canavar-detay-kalanCan').innerHTML=canavar.kalanCan + "/" + canavar.enYuksekCan;
						document.getElementById('canavar-detay-saldiriGucu').innerHTML=canavar.saldiriGucu;
						document.getElementById('canavar-detay-seviye').innerHTML=canavar.seviye;
						document.getElementById('canavar-detay-takimAdi').innerHTML=canavar.takimda == 1 ? canavar.takimAdi : "Yakım yok";
						document.getElementById('canavar-detay-bayginlik').innerHTML=canavar.bayginlik == 1 ? "Baygın" : "Değil";

						if(canavar.bayginlik == 1){
							document.getElementById('canavar-detay-bayginlikBitisZamani').innerHTML=canavar.bayginlikBitisZamani;
						}
						else{
							document.getElementById('canavar-detay-bayginlikBitisZamani').parentNode.parentNode.style.display="none";
						}


						// objeye dönüşmüş veriyi döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
						for(i=0; i<donenCevapJson.length; i++){
							mia.parcaYukle('canavar-kart','#canavarDetay', canavarDetay[i] );
						}
					}
				}

			});
		}

	}
	
}