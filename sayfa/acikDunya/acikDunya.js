mia.acikDunya={};

// acikDunya page onload function
mia.acikDunya.yuklendiginde = function(){
	cl("acikDunya.yuklendiginde() fonksiyonu çalıştı");

	// api üzerinden oyuncu konumlarını getiren fonksiyonu sürekli çağıran fonksiyonu çağır
	mia.acikDunya.konumlariSurekliYenile();

	setTimeout(function(){
		var sahne = document.querySelector('#acik-dunya-sahne .container');

		cl("Sahne boyutu: x:", window.innerWidth, "y:", window.innerHeight);

		sahne.addEventListener("click", function(e){
			var konum = mia.acikDunya.konumHesapla(e.pageX,e.pageY);
			mia.acikDunya.hedefeGit(konum.x,konum.y);
		});

		mia.acikDunya.scrollXStart=0;
		mia.acikDunya.scrollX=0;
		mia.acikDunya.scrollYStart=0;
		mia.acikDunya.scrollY=0;
		document.body.addEventListener("mousedown", function(e){
			mia.acikDunya.scrollXStart = window.scrollX+e.clientX;
			mia.acikDunya.scrollYStart = window.scrollY+e.clientY;
			document.body.style.cursor="grabbing";
		});
		document.body.addEventListener("mousemove", function(e){
			if(mia.acikDunya.scrollXStart>0 || mia.acikDunya.scrollYStart>0){
				mia.acikDunya.scrollX = mia.acikDunya.scrollXStart - e.clientX;
				mia.acikDunya.scrollY = mia.acikDunya.scrollYStart - e.clientY;
				window.scrollTo(mia.acikDunya.scrollX,mia.acikDunya.scrollY);
			}
		});
		document.body.addEventListener("mouseup", function(e){
			mia.acikDunya.scrollXStart=0;
			mia.acikDunya.scrollX=0;
			mia.acikDunya.scrollYStart=0;
			mia.acikDunya.scrollY=0;
			document.body.style.cursor="default";
		});
		document.body.addEventListener("mouseleave", function(e){
			mia.acikDunya.scrollXStart=0;
			mia.acikDunya.scrollX=0;
			mia.acikDunya.scrollYStart=0;
			mia.acikDunya.scrollY=0;
		});


		if(window.innerWidth > window.innerHeight ){
			sahne.style.width = window.innerWidth+"px";
			sahne.style.height = window.innerWidth+"px";
		}
		else{
			sahne.style.width = window.innerHeight+"px";
			sahne.style.height = window.innerHeight+"px";
		}
		

	},500);

}

mia.acikDunya.konumHesapla = function(x,y){
	if(window.innerWidth > window.innerHeight ){
		return {
			x: Math.ceil( 1000 / (window.innerWidth/x) ),
			y: Math.ceil( 1000 / (window.innerWidth/y) )
		};
	}
	else{
		return {
			x: Math.ceil( 1000 / (window.innerHeight/x) ),
			y: Math.ceil( 1000 / (window.innerHeight/y) )
		};
	}
}

mia.acikDunya.konumCoz = function(x,y){
	if(window.innerWidth > window.innerHeight ){
		return {
			x: Math.ceil( window.innerWidth / (1000/x) ),
			y: Math.ceil( window.innerWidth / (1000/y) )
		};
	}
	else{
		return {
			x: Math.ceil( window.innerHeight / (1000/x) ),
			y: Math.ceil( window.innerHeight / (1000/y) )
		};
	}
}

// api üzerinden oyuncu konumlarını getiren fonksiyon
mia.acikDunya.konumlariGetir = function(){
	// api üzerinden oyuncu konumlarını getir
	ajaxGet(mia.global.apiHost+'/sahne/konumlariGetir/1',function(donenCevap){

		if(donenCevap){
			//cl("Konumlar api üzerinden yüklendi (URL "+mia.global.apiHost+"/sahne/konumlariGetir/1')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){

				// objeye dönüşmüş oyuncuKonumlari verisini RAM'a (mia.acikDunya objemizin içine) yükle
				mia.acikDunya.oyuncuKonumlari = donenCevapJson.cevap.oyuncu.konum.degerler;
				mia.acikDunya.canavarKonumlari = donenCevapJson.cevap.canavar.konum.degerler;
				mia.acikDunya.dusmanKonumlari = donenCevapJson.cevap.dusman.konum.degerler;

				// ram'a yüklenmiş oyuncu ve canavar konumlari' verisini ekrana yansıtan tetik fonksiyonları çağır
				mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle();
				mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
				mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle();
			}
		}
		
	});
};

mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.oyuncuKonumlari){
		var oyuncu_id=mia.acikDunya.oyuncuKonumlari[key][0];
		var canavar_id=mia.acikDunya.oyuncuKonumlari[key][1];

		var oyuncuGezginSimge = document.querySelector('#oyuncu_gezgin_simge_'+oyuncu_id);
		if(oyuncuGezginSimge){
			var konum = mia.acikDunya.konumCoz(mia.acikDunya.oyuncuKonumlari[key][4], mia.acikDunya.oyuncuKonumlari[key][5]);
			oyuncuGezginSimge.style.left=konum.x+"px";
			oyuncuGezginSimge.style.top=konum.y+"px";
		}
		else{
			var konumObj = mia.acikDunya.konumCoz(mia.acikDunya.oyuncuKonumlari[key][2], mia.acikDunya.oyuncuKonumlari[key][3]);
			/*/
			var konumObj={
				canavar_id:canavar_id,
				x: Math.ceil(window.innerWidth / 1000 * mia.acikDunya.oyuncuKonumlari[key][2]),
				y: Math.ceil(window.innerHeight / 1000 * mia.acikDunya.oyuncuKonumlari[key][3])
			}
			/*/
			konumObj.oyuncu_id = oyuncu_id;
			konumObj.canavar_id = canavar_id;
			cl("Oyuncu Konum Obj:",konumObj);
			mia.parcaYukle('oyuncuGezginSimge', '#acik-dunya-sahne .container', konumObj);
		}
	}
};

mia.acikDunya.canavarGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış canavarKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.canavarKonumlari){
		var canavar_id=mia.acikDunya.canavarKonumlari[key][0];

		var canavarGezginSimge = document.querySelector('#canavar_gezgin_simge_'+canavar_id);
		if(canavarGezginSimge){
			canavarGezginSimge.style.left=mia.acikDunya.canavarKonumlari[key][1]+"px";
			canavarGezginSimge.style.top=mia.acikDunya.canavarKonumlari[key][2]+"px";
		}
		else{
			var konumObj={
				canavar_id:canavar_id,
				x:mia.acikDunya.canavarKonumlari[key][1],
				y:mia.acikDunya.canavarKonumlari[key][2]
			}
			mia.parcaYukle('canavarGezginSimge', '#acik-dunya-sahne .container', konumObj);
		}
	}
};

mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.dusmanKonumlari){
		var dusman_id=mia.acikDunya.dusmanKonumlari[key][0];

		var dusmanGezginSimge = document.querySelector('#dusman_gezgin_simge_'+dusman_id);
		if(dusmanGezginSimge){
			dusmanGezginSimge.style.left=mia.acikDunya.dusmanKonumlari[key][4]+"px";
			dusmanGezginSimge.style.top=mia.acikDunya.dusmanKonumlari[key][5]+"px";
		}
		else{
			var konumObj={
				dusman_id:dusman_id,
				tip:mia.acikDunya.dusmanKonumlari[key][1],
				x:mia.acikDunya.dusmanKonumlari[key][2],
				y:mia.acikDunya.dusmanKonumlari[key][3]
			}
			mia.parcaYukle('dusmanGezginSimge', '#acik-dunya-sahne .container', konumObj);
		}
	}
};



mia.acikDunya.hedefeGit = function(x,y){

	// api get isteği ile konumu değiştir
	ajaxGet(mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y, function(donenCevap){

		if(donenCevap){
			cl("hedefeGit apisi çalıştı: (URL "+mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y+"')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				cl("hedefeGit:",donenCevapJson);

				if(donenCevapJson.cevap[0] && donenCevapJson.cevap[0].oyuncu_id){
					var oyuncuGezginSimge = document.querySelector('#oyuncu_gezgin_simge_'+donenCevapJson.cevap[0].oyuncu_id);
					if(oyuncuGezginSimge){
						oyuncuGezginSimge.style.transitionDuration = 
							donenCevapJson.cevap[0].hedefeKalanSure+"s, "+
							donenCevapJson.cevap[0].hedefeKalanSure+"s";
					}
				}
			}
		}
		
	});
}



mia.acikDunya.konumlariSurekliYenile = function(){

	if(mia.aktifSayfa == 'acikDunya'){
		// api üzerinden oyuncu konumlarını getiren fonksiyonu çağır
		mia.acikDunya.konumlariGetir();

		setTimeout(mia.acikDunya.konumlariSurekliYenile, 500);
	}
}


// canavar detay parçası için
mia.acikDunya.canavarDetaySiradakiDiyalog = function(canavar,diyalog_id){
	setTimeout(function(){

		if(!diyalog_id)diyalog_id=0;

		if(canavar){
			mia.acikDunya.sonDiyalogCanavar=canavar;
		}
		else if(mia.acikDunya.sonDiyalogCanavar){
			canavar=mia.acikDunya.sonDiyalogCanavar;
		}

		if(canavar){
			mia.acikDunya.canavarDetayDiyalogYukle(canavar, diyalog_id);
		}

	},10);
}


mia.acikDunya.canavarDetayDiyalogYukle = function(canavar,diyalog_id){
	if(canavar && canavar.id){

		if(!diyalog_id)diyalog_id=0;

		// api get isteği ile sıradaki diyaloğu getir
		ajaxGet(mia.global.apiHost+'/canavar/iknaEt/'+canavar.id + (diyalog_id ? '/'+diyalog_id : ''), function(donenCevap){

			if(donenCevap){
				cl("iknaEt çalıştı: (URL "+mia.global.apiHost+'/canavar/iknaEt/'+canavar.id + (diyalog_id ? '/'+diyalog_id : '')+")");

				// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
				var donenCevapJson = JSON.parse(donenCevap);

				if(donenCevapJson.sonuc == 1){

					if(donenCevapJson.cevap && donenCevapJson.cevap.diyalog){
						var diyalog=donenCevapJson.cevap.diyalog;
						
						// diyalog panelini temizle
						document.getElementById('canavar-detay-diyalog').innerHTML='';

						// canavarın cevabını göster
						if(diyalog.canavar){
							document.getElementById('canavar-detay-diyalog').innerHTML +='<h4>Canavar: '+diyalog.canavar+'</h4>';
						}

						setTimeout(function(){
							// oyuncunun diyaloğu devam edebileceği metinleri göster
							if(diyalog.oyuncu){
								for(diyalog_id in diyalog.oyuncu){
									document.getElementById('canavar-detay-diyalog').innerHTML +=
									'<button type="button" onclick="mia.acikDunya.canavarDetaySiradakiDiyalog(0,'+diyalog_id+')">Ben: '+diyalog.oyuncu[diyalog_id]+'</button>';
								}
							}
						},1000);
					}

				}
			}
			
		});

	}

}