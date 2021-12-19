mia.acikDunya={
	aktifSayfaId:1,
	oyuncular:{},
	dusmanlar:{},
	oyuncuCanBariCarpani:40,
	dusmanCanBariCarpani:54,
};

// acikDunya page onload function
mia.acikDunya.yuklendiginde = function(){
	cl("acikDunya.yuklendiginde() fonksiyonu çalıştı");
	mia.acikDunya.aktifSayfaId=mia.oturum.hesap.sahne_id;
	
	// Oyuncu spritesini önceden yüklemeyi başlat
	mia.spriteYoneticisi.yukle('cibiliMons','sayfa/acikDunya/img/cibili-mons-60x20.png',{
		genislik: 20,
		yukseklik: 20,
		hiz: 50,
		animasyon: {
			yürü:{x:1, y:1, son:3},
			hasarAl:{x:1, y:1, son:2},
			kilicDarbesi:{x:1, y:1, son:2}
		}
	});
	
	// Sahnede bir çok defa kullanılacak ses dosyalarını yükle
	mia.sesYoneticisi.yukle('hasarAlmaEfektSesi','sayfa/acikDunya/mp3/hasar-alma-efekt-sesi.mp3',0.2);
	mia.sesYoneticisi.yukle('yildirimDusmeSesi','sayfa/acikDunya/mp3/yildirim-dusme-efekt-sesi.mp3',0.1);
	mia.sesYoneticisi.yukle('elektrikSesi','sayfa/acikDunya/mp3/elektrik-efekt-sesi.mp3',0.1);
	mia.sesYoneticisi.yukle('kilicSesi1','sayfa/acikDunya/mp3/kilic-darbe-efekt-sesi-1.mp3',0.5);
	mia.sesYoneticisi.yukle('kilicSesi2','sayfa/acikDunya/mp3/kilic-darbe-efekt-sesi-2.mp3',0.5);

	

	// api üzerinden oyuncu konumlarını getiren fonksiyonu sürekli çağıran fonksiyonu çağır
	mia.acikDunya.konumlariSurekliYenile();

	setTimeout(function(){
		var sahne = document.querySelector('#acik-dunya-sahne .container');

		cl("Sahne boyutu: x:", window.innerWidth, "y:", window.innerHeight);

		sahne.addEventListener("click", function(e){
			if(e.target.className == 'container'){
				var konum = mia.acikDunya.konumHesapla(e.pageX,e.pageY);
				mia.acikDunya.hedefeGit(konum.x,konum.y);
			}
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
	if(mia.acikDunya.sonIstekZamani){
		sonIstekZamani = mia.acikDunya.sonIstekZamani;
	}

	// api üzerinden oyuncu konumlarını getir
	ajaxGet(mia.global.apiHost+'/sahne/konumlariGetir/'+mia.acikDunya.aktifSayfaId+
		(mia.acikDunya.sonIstekZamani ? '/' + mia.acikDunya.sonIstekZamani : '')
		,function(donenCevap){

		if(donenCevap){
			//cl("Konumlar api üzerinden yüklendi (URL "+mia.global.apiHost+"/sahne/konumlariGetir/1')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				document.querySelector('#acik-dunya-sahne > .container').style.backgroundImage="url('sayfa/acikDunya/img/sahne/"+mia.acikDunya.aktifSayfaId+".jpg')";

				mia.acikDunya.sonIstekZamani = donenCevapJson.cevap.sonIstekZamani;

				// objeye dönüşmüş oyuncuKonumlari verisini RAM'a (mia.acikDunya objemizin içine) yükle
				mia.acikDunya.oyuncuKonumlari = donenCevapJson.cevap.oyuncu.konum.degerler;
				mia.acikDunya.canavarKonumlari = donenCevapJson.cevap.canavar.konum.degerler;
				mia.acikDunya.dusmanKonumlari = donenCevapJson.cevap.dusman.konum.degerler;

				// ram'a yüklenmiş oyuncu ve canavar konumlari' verisini ekrana yansıtan tetik fonksiyonları çağır
				mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle();
				mia.acikDunya.canavarGezginSimgeKonumlariGuncelle();
				mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle();

				if(donenCevapJson.cevap.dusman.saldiri.degerler.length>0){
					var saldiri=donenCevapJson.cevap.dusman.saldiri.degerler;
					for(i in saldiri){
						mia.acikDunya.dusmanSaldirdi(saldiri[i][0]);

						setTimeout(function(){
							mia.acikDunya.oyuncuHasarAldi(saldiri[i][1],saldiri[i][3],saldiri[i][4]);
						},saldiri[i][2]*1000);

					}
					cl("Düşman saldırısı bulundu");
				}
			}
		}
		
	});
};

mia.acikDunya.oyuncuGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.oyuncuKonumlari){
		var oyuncu_id=mia.acikDunya.oyuncuKonumlari[key][0];
		var canavar_id=mia.acikDunya.oyuncuKonumlari[key][1];
		
		//mia.acikDunya.oyuncuKonumlari[key][9]=oyuncu_id==1 ? 1 : 0;

		mia.acikDunya.oyuncular[oyuncu_id]={
			x: mia.acikDunya.oyuncuKonumlari[key][4],
			y: mia.acikDunya.oyuncuKonumlari[key][5],
			canavar_id: mia.acikDunya.oyuncuKonumlari[key][1],
			enYuksekCan: mia.acikDunya.oyuncuKonumlari[key][7],
			kalanCan: mia.acikDunya.oyuncuKonumlari[key][8],
			baygin: mia.acikDunya.oyuncuKonumlari[key][9]
		};

		if(!mia.acikDunya.oyuncuKonumlari[key][100]){
			mia.acikDunya.oyuncuKonumlari[key][100]=1;

			var oyuncuGezginSimge = document.querySelector('#oyuncu_gezgin_simge_'+oyuncu_id);
			if(oyuncuGezginSimge){
				var konum = mia.acikDunya.konumCoz(mia.acikDunya.oyuncuKonumlari[key][4], mia.acikDunya.oyuncuKonumlari[key][5]);
				oyuncuGezginSimge.style.left=konum.x+"px";
				oyuncuGezginSimge.style.top=konum.y+"px";

				if(mia.acikDunya.oyuncuKonumlari[key][9]){
					document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_baygin').style.display="block";
				}
				
				mia.acikDunya.oyuncuHasarYansit(oyuncu_id);
			}
			else{
				var konumObj = mia.acikDunya.konumCoz(mia.acikDunya.oyuncuKonumlari[key][2], mia.acikDunya.oyuncuKonumlari[key][3]);

				konumObj.oyuncu_id = oyuncu_id;
				konumObj.canavar_id = canavar_id;
				konumObj.transitionDuration = mia.acikDunya.oyuncuKonumlari[key][6];

				konumObj.enYuksekCan = mia.acikDunya.oyuncuKonumlari[key][7];
				konumObj.kalanCan = mia.acikDunya.oyuncuKonumlari[key][8];

				//cl("Oyuncu Konum Obj:",konumObj);
				mia.parcaYukle('oyuncuGezginSimge', '#acik-dunya-sahne .container', konumObj, 0, function(data){

					// Parça yüklemesi bittiğinde, bu parçaya animasyonlu sprite tanımla
					mia.spriteYoneticisi.tanimla('#oyuncu_gezgin_simge_'+data.oyuncu_id,'cibiliMons');

					mia.acikDunya.oyuncuHasarYansit(data.oyuncu_id);
				});
			}
		}
		else {
			alert("İkinci sefer");
		}
	}
};

mia.acikDunya.canavarGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış canavarKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.canavarKonumlari){
		var canavar_id=mia.acikDunya.canavarKonumlari[key][0];

		var canavarGezginSimge = document.querySelector('#canavar_gezgin_simge_'+canavar_id);
		if(canavarGezginSimge){
			var konum = mia.acikDunya.konumCoz(mia.acikDunya.canavarKonumlari[key][1], mia.acikDunya.canavarKonumlari[key][2]);
			canavarGezginSimge.style.left=konum.x+"px";
			canavarGezginSimge.style.top=konum.y+"px";
		}
		else{
			var konumObj = mia.acikDunya.konumCoz(mia.acikDunya.canavarKonumlari[key][1], mia.acikDunya.canavarKonumlari[key][2]);
			konumObj.canavar_id = canavar_id;

			//cl("Canavar Konum Obj:",konumObj);
			konumObj.apiHost = mia.global.apiHost;
			konumObj.monsterImageHost = mia.global.monsterImageHost;

			mia.parcaYukle('canavarGezginSimge', '#acik-dunya-sahne .container', konumObj);
		}
	}
};

mia.acikDunya.dusmanGezginSimgeKonumlariGuncelle = function(){
	// daha önceden tanımlanmış oyuncuKonumlari verisini döngü ve parcaYukle fonksiyonu yardımı ile ekrana bas
	for(var key in mia.acikDunya.dusmanKonumlari){
		var dusman_id=mia.acikDunya.dusmanKonumlari[key][0];

		mia.acikDunya.dusmanlar[dusman_id]={
			x: mia.acikDunya.dusmanKonumlari[key][4],
			y: mia.acikDunya.dusmanKonumlari[key][5],
			tip: mia.acikDunya.dusmanKonumlari[key][1],
			enYuksekCan: mia.acikDunya.dusmanKonumlari[key][7],
			kalanCan: mia.acikDunya.dusmanKonumlari[key][8]
		};

		if(mia.acikDunya.dusmanlar[dusman_id].kalanCan>0){
			var dusmanGezginSimge = document.querySelector('#dusman_gezgin_simge_'+dusman_id);
			if(dusmanGezginSimge){
				var konum = mia.acikDunya.konumCoz(mia.acikDunya.dusmanKonumlari[key][4], mia.acikDunya.dusmanKonumlari[key][5]);
				dusmanGezginSimge.style.left=konum.x+"px";
				dusmanGezginSimge.style.top=konum.y+"px";

				mia.acikDunya.dusmanHasarYansit(dusman_id);
			}
			else{
				var konumObj = mia.acikDunya.konumCoz(mia.acikDunya.dusmanKonumlari[key][2], mia.acikDunya.dusmanKonumlari[key][3]);
				konumObj.tip = mia.acikDunya.dusmanKonumlari[key][1];
				konumObj.dusman_id = dusman_id;
				konumObj.transitionDuration = mia.acikDunya.dusmanKonumlari[key][6];

				konumObj.enYuksekCan = mia.acikDunya.dusmanKonumlari[key][7];
				konumObj.kalanCan = mia.acikDunya.dusmanKonumlari[key][8];

				konumObj.apiHost = mia.global.apiHost;

				//cl("Düşman Konum Obj:",konumObj);

				mia.parcaYukle('dusmanGezginSimge', '#acik-dunya-sahne .container', konumObj, 0, function(data){

					mia.acikDunya.dusmanHasarYansit(data.dusman_id);
				
				});
			}
		}
		else{
			cl(dusman_id+" idli düşmanın canı kalmamış");
		}
	}
};



mia.acikDunya.hedefeGit = function(x,y){
	var baygin = mia.acikDunya.oyuncular[mia.oturum.hesap.id].baygin;

	if(!baygin){
		// api get isteği ile konumu değiştir
		ajaxGet(mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y, function(donenCevap){

			if(donenCevap){
				cl("hedefeGit apisi çalıştı: (URL "+mia.global.apiHost+'/sahne/hedefeGit/'+x+'/'+y+"')");

				// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
				var donenCevapJson = JSON.parse(donenCevap);

				if(donenCevapJson.sonuc == 1){
					cl("hedefeGit:",donenCevapJson);
					
					if(donenCevapJson.cevap[0] && donenCevapJson.cevap[0].oyuncu_id){

						// Gezinti başladıysa, tanımlı sprite animasyonu başlat
						mia.spriteYoneticisi.baslat('#oyuncu_gezgin_simge_'+donenCevapJson.cevap[0].oyuncu_id,'yürü',100);

						var oyuncuGezginSimge = document.querySelector('#oyuncu_gezgin_simge_'+donenCevapJson.cevap[0].oyuncu_id);
						if(oyuncuGezginSimge){
							oyuncuGezginSimge.style.transitionDuration = 
								donenCevapJson.cevap[0].hedefeKalanSure+"s, "+
								donenCevapJson.cevap[0].hedefeKalanSure+"s";

							setTimeout(function(){

								// Gezinti bittiyse sprite animasyonu durdur
								mia.spriteYoneticisi.durdur('#oyuncu_gezgin_simge_'+donenCevapJson.cevap[0].oyuncu_id,'yürü');

								var sahneYon="";
								if(y<=0){
									sahneYon='ust';
								}
								else if(x>=1000){
									sahneYon='sag';
								}
								else if(y>=1000){
									sahneYon='alt';
								}
								else if(x<=0){
									sahneYon='sol';
								}

								if(sahneYon){
									ajaxGet(mia.global.apiHost+'/sahne/sonrakiHarita/'+sahneYon, function(donenCevap2){
										var donenCevap2Json = JSON.parse(donenCevap2);
										if(donenCevap2Json.sonuc == 1){
											cl("sonrakiHarita/sag:",donenCevap2Json);
											if(donenCevap2Json.cevap.id){
												mia.acikDunya.aktifSayfaId=donenCevap2Json.cevap.id;
												mia.oturum.hesap.sahne_id=donenCevap2Json.cevap.id;
												mia.sayfaYukle('acikDunya');
											}
										}
									});
								}
							
							},donenCevapJson.cevap[0].hedefeKalanSure*1000);

						}
					}
				}
			}
			
		});
	}
	else{
		alert("Seçili canavar baygın olduğu için hareket edemez.");
	}
}



mia.acikDunya.konumlariSurekliYenile = function(){

	if(mia.aktifSayfa == 'acikDunya'){
		// api üzerinden oyuncu konumlarını getiren fonksiyonu çağır
		mia.acikDunya.konumlariGetir();

		setTimeout(mia.acikDunya.konumlariSurekliYenile, 2000);
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


// şef canavarı seçmek için
mia.acikDunya.canavarSecimPencerisiAc = function(){
	mia.panel.ac('canavar-sec',{
		parcaAdi:'canavarSecimKarti',
		parcaApiUrl: mia.global.apiHost + '/hesap/canavarlarim/00/100',
		cokluParca: 1,
		height: '260px'
	});
}

mia.acikDunya.canavarSec = function(canavar_id){
	// api get isteği ile canavarı değiştir
	ajaxGet(mia.global.apiHost+'/canavar/sec/'+canavar_id, function(donenCevap){

		if(donenCevap){
			cl("canavar/sec apisi çalıştı: (URL "+mia.global.apiHost+'/canavar/sec/'+canavar_id+"')");

			// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
			var donenCevapJson = JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				cl("canavarSec:",donenCevapJson);

				mia.acikDunya.seciliCanavar = donenCevapJson.cevap;

				alert(canavar_id + " idli canavar saldırı için seçildi.");
			}
		}
		
	});
}


mia.acikDunya.dusmanaSaldir = function(dusman_id){

	if(mia.oturum && mia.oturum.durum && dusman_id && mia.oturum.hesap.id){

		var ox=mia.acikDunya.oyuncular[mia.oturum.hesap.id].x;
		var oy=mia.acikDunya.oyuncular[mia.oturum.hesap.id].y;
		var dx=mia.acikDunya.dusmanlar[dusman_id].x;
		var dy=mia.acikDunya.dusmanlar[dusman_id].y;
		var a = ox - dx;
		var b = oy - dy;
		var c = Math.sqrt( a*a + b*b );
		if(c<100){
			var oyuncu_id = mia.oturum.hesap.id;

			if(dusman_id){
				mia.acikDunya.seciliDusman = dusman_id;
			}
			else if(mia.acikDunya.seciliDusman){
				dusman_id = mia.acikDunya.seciliDusman;
			}

			canavar_id=0;
			if(mia.acikDunya.seciliCanavar && mia.acikDunya.seciliCanavar.id){
				canavar_id = mia.acikDunya.seciliCanavar.id;
			}

			if(dusman_id && canavar_id){
				mia.sesYoneticisi.oynat('kilicSesi1');
				mia.spriteYoneticisi.baslat('#oyuncu_gezgin_simge_'+oyuncu_id,'kilicDarbesi',100);
				
				// api get isteği ile düşmana saldırı gerçekleştir
				ajaxGet(mia.global.apiHost+'/dusman/saldir/'+canavar_id+'/'+dusman_id, function(donenCevap){
					mia.sesYoneticisi.oynat('kilicSesi2');


					var dgsid = '#dusman_gezgin_simge_' + dusman_id + '';
					mia.animasyon(dgsid,{
						'width':[50,47,0], 
						'height':[50,47,0], 
						'opacity':[1,0.6,0.1]
					});
					setTimeout(function(){
						mia.spriteYoneticisi.durdur('#oyuncu_gezgin_simge_'+oyuncu_id);

						mia.animasyon(dgsid,{
							'width':[47,50,0], 
							'height':[47,50,0],
							'opacity':[0.6,1,0.1]
						});
						setTimeout(function(){
							mia.animasyon(dgsid,{
								'opacity':[1,0.6,0.1]
							});
							setTimeout(function(){
								mia.animasyon(dgsid,{
									'opacity':[0.6,1,0.1]
								});
							},101);
						},101);
					},101);


					if(donenCevap){
						cl("dusman/saldir apisi çalıştı: (URL "+mia.global.apiHost+'/dusman/saldir/'+canavar_id+'/'+dusman_id+")");

						// text yığını olarak dönen json verisini parçala ve objeye dönüştür 
						var donenCevapJson = JSON.parse(donenCevap);

						if(donenCevapJson.sonuc == 1){
							cl("dusmanaSaldiri:",donenCevapJson);
							//alert("Saldırı gerçekleşti, "+donenCevapJson.cevap.saldiri.verilenHasar+" hasar verildi.");

							mia.acikDunya.dusmanlar[dusman_id].kalanCan-=donenCevapJson.cevap.saldiri.verilenHasar;

							//mia.sesYoneticisi.oynat('hasarAlmaEfektSesi',0.2);
							if(mia.acikDunya.dusmanlar[dusman_id].kalanCan <= 0){
								var silinecekDusman=document.getElementById('dusman_gezgin_simge_'+dusman_id);
								if(silinecekDusman){
									silinecekDusman.remove();
									mia.pencere.kapat('dusman-detay');
								}
							}
							else{
								mia.acikDunya.dusmanHasarYansit(dusman_id);
							}
						}
						else{
							alert(donenCevapJson.mesaj);
						}
					}
					
				});
			}
			else if(dusman_id){
				mia.acikDunya.canavarSecimPencerisiAc();
			}

		}
		else{
			mia.acikDunya.hedefeGit(dx,dy);
		}

	}


}

mia.acikDunya.dusmanButonGoster = function(dusman_id){
	var dsply = document.getElementById('dusman_gezgin_simge_'+dusman_id+'_butonlar').style.display == 'none' ? 0 : 1;
	mia.animasyon('#dusman_gezgin_simge_'+dusman_id+'_butonlar',{
		'display':(dsply ? ['block','none',0.5] : 'block') 
	});
	mia.animasyon('#dusman_gezgin_simge_'+dusman_id+'_butonlar button:first-child',{
		'width':(dsply ? [50,10,0.5] : [10,50,0.5]), 
		'height':(dsply ? [50,10,0.5] : [10,50,0.5]),
		'left':(dsply ? [-30,25,0.5] : [25,-30,0.5]),
		'top':(dsply ? [50,20,0.5] : [20,50,0.5]),
		'opacity':(dsply ? [1,0,0.5] : [0,1,1])
	});
	mia.animasyon('#dusman_gezgin_simge_'+dusman_id+'_butonlar button:last-child',{
		'width':(dsply ? [50,10,0.5] : [10,50,0.5]), 
		'height':(dsply ? [50,10,0.5] : [10,50,0.5]),
		'right':(dsply ? [-30,25,0.5] : [25,-30,0.5]),
		'top':(dsply ? [50,20,0.5] : [20,50,0.5]),
		'opacity':(dsply ? [1,0,0.5] : [0,1,1])
	})
}




mia.acikDunya.dusmanSaldirdi = function(dusman_id){
	if(dusman_id){
		var dusmanGezginSimge = document.getElementById('dusman_gezgin_simge_'+dusman_id);
		if(dusmanGezginSimge){
						
			//mia.sesYoneticisi.durdur('yildirimDusmeSesi');
			//mia.sesYoneticisi.oynat('yildirimDusmeSesi');
			mia.sesYoneticisi.oynat('elektrikSesi');
			
			setTimeout(function(){
				//mia.spriteYoneticisi.baslat('#oyuncu_gezgin_simge_'+oyuncu_id,'hasarAl',30);
				var dusmanGezginSimgeHasarX = document.getElementById('dusman_gezgin_simge_'+dusman_id+'_saldiri_x');
				setTimeout(function(){
					//mia.spriteYoneticisi.durdur('#oyuncu_gezgin_simge_'+oyuncu_id);

					if(dusmanGezginSimgeHasarX){
						dusmanGezginSimgeHasarX.style.display="none";
					}

					var dusmanGezginSimgeHasarX2 = document.getElementById('dusman_gezgin_simge_'+dusman_id+'_saldiri_x2');
					if(dusmanGezginSimgeHasarX2){
						dusmanGezginSimgeHasarX2.style.display="block";
					}
					setTimeout(function(){
						if(dusmanGezginSimgeHasarX2){
							dusmanGezginSimgeHasarX2.style.display="none";
						}

						dusmanGezginSimgeHasarX.style.display="block";
						setTimeout(function(){
								dusmanGezginSimgeHasarX.style.display="none";
						},160);

					},160);

				},160);

				if(dusmanGezginSimgeHasarX){
					dusmanGezginSimgeHasarX.style.display="block";
				}

			},180);


		}
	}
}

mia.acikDunya.oyuncuHasarAldi = function(oyuncu_id,alinanHasar,saldiriTipi){
	if(!oyuncu_id && mia.oturum && mia.oturum.durum){
		oyuncu_id = mia.oturum.hesap.id;
	}
	if(oyuncu_id){
		var oyuncuGezginSimge = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id);
		if(oyuncuGezginSimge){


			// saldırı tipine göre efektler
			switch(saldiriTipi){
				case "YILDIRIM_DÜŞMESİ":

					mia.sesYoneticisi.oynat('yildirimDusmeSesi',0.01);

					var yildirimDusmesi = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_hasar_YILDIRIM_DÜŞMESİ_1');
					if(yildirimDusmesi){
						yildirimDusmesi.style.display="block";
					}
					setTimeout(function(){
						if(yildirimDusmesi){
							yildirimDusmesi.style.display="none";
						}
						var yildirimDusmesi2 = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_hasar_YILDIRIM_DÜŞMESİ_2');
						if(yildirimDusmesi2){
							yildirimDusmesi2.style.display="block";
						}
						setTimeout(function(){
							if(yildirimDusmesi2){
								yildirimDusmesi2.style.display="none";
							}
						},400);
					},60);
					
					break;


				default:
					break;
			}



			// her hasarda beliren efektler
			setTimeout(function(){

				mia.spriteYoneticisi.baslat('#oyuncu_gezgin_simge_'+oyuncu_id,'hasarAl',30);
				var oyuncuGezginSimgeHasarX = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_hasar_x');
				
				setTimeout(function(){
					mia.spriteYoneticisi.durdur('#oyuncu_gezgin_simge_'+oyuncu_id);

					if(oyuncuGezginSimgeHasarX){
						oyuncuGezginSimgeHasarX.style.display="none";
					}

					var oyuncuGezginSimgeHasarX2 = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_hasar_x2');
					if(oyuncuGezginSimgeHasarX2){
						oyuncuGezginSimgeHasarX2.style.display="block";
					}

					mia.acikDunya.oyuncular[oyuncu_id].kalanCan-=alinanHasar;

					mia.acikDunya.oyuncuHasarYansit(oyuncu_id);

					setTimeout(function(){
						if(oyuncuGezginSimgeHasarX2){
							oyuncuGezginSimgeHasarX2.style.display="none";
						}
					},160);

				},160);

				if(oyuncuGezginSimgeHasarX){
					oyuncuGezginSimgeHasarX.style.display="block";
				}

				mia.sesYoneticisi.oynat('hasarAlmaEfektSesi',0.2);
			},60);



		}
	}
}

mia.acikDunya.oyuncuHasarYansit = function(oyuncu_id){
	var oyuncuCanBari = document.getElementById('oyuncu_gezgin_simge_'+oyuncu_id+'_can_bari');
	if(oyuncuCanBari){
		oyuncuCanBari.style.width=(mia.acikDunya.oyuncuCanBariCarpani / mia.acikDunya.oyuncular[oyuncu_id].enYuksekCan * mia.acikDunya.oyuncular[oyuncu_id].kalanCan)+"px";
	}
};

mia.acikDunya.dusmanHasarYansit = function(dusman_id){
	var dusmanCanBari = document.getElementById('dusman_gezgin_simge_'+dusman_id+'_can_bari');
	if(dusmanCanBari){
		dusmanCanBari.style.width=(mia.acikDunya.dusmanCanBariCarpani / mia.acikDunya.dusmanlar[dusman_id].enYuksekCan * mia.acikDunya.dusmanlar[dusman_id].kalanCan)+"px";
	}
	var dusmanKalanCanSpan = document.getElementById('dusman_kalanCan_span_'+dusman_id);
	if(dusmanKalanCanSpan){
		dusmanKalanCanSpan.innerHTML=mia.acikDunya.dusmanlar[dusman_id].kalanCan;
	}
};