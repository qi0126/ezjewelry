$(function(){
	$(".diploma-top1>ul>li").click(function(){
    	$(".diploma-top1>ul>li").removeClass("avte");
    	$(this).addClass("avte");
    	$("#typeName").text($(this).text());
    	$('#certType').val($(this).attr('t'));
  	});
	$('#serachCert').click(function(){
		var t = parseInt($('#certType').val());
		var q = $('[name="q"]').val();
		if(!t || !q){
			win.alert('请输入证书号!');
			return;
		}
		loadGif('certBody');
		http.postAjaxFrom("/bk/getCert.html",{t:t,q:q}, function(data) {
			if(data.code != 200){
				$('#certBody').html(data.msg);
				return;
			}
			var html = $(data.data); 
			var certData;
			switch (t) {
			case 1:
				certData = createGIA(html);
				break;
			case 2:
				certData = createIGI(html);
				break;
			}
			$('#certBody').html($('#cert_data').tmpl(certData));
			var record = createRecord(certData.waistCode);
			
		});
	});
	$('#resetCert').click(function(){
		$('li[t="1"]').click();
		$('[name="q"]').val('');
	});
	createRecord();
	
	if(certno && type){
		var t;
		if(type.toUpperCase() == 'GIA'){
			t = 1;
		}else if(type.toUpperCase() == 'IGI'){
			t = 2;
		}
		$('li[t="'+t+'"]').click();
		$('[name="q"]').val(certno);
		$('#serachCert').click();
	}
});
//生成历史记录
function createRecord(certNo){
	var r = sessionStorage.getItem('cert_record');
	if(certNo){
		if(!r){
			r = new Array();
			r[0] = certNo;
			sessionStorage.setItem("cert_record",JSON.stringify(r));
		}else{
			r = JSON.parse(r);
			if(r[0] != certNo){
				r.unshift(certNo);
				if(r.length > 5){
					r = r.slice(0,r.length-1);
				}
				sessionStorage.setItem("cert_record",JSON.stringify(r));
			}
		}
	}else{
		r = JSON.parse(r);
	}
	$('.list-right ol').html('');
	for (var i in r) {
		$('.list-right ol').append('<li>'+r[i]+'</li>');
	}
}

//生成GIA证书对象
function createGIA(html){
	var gia = {};
	gia.pdf = html.find('.giapdf').attr('onclick').replace(/show_pdf|\(|\)|'/g,'');
	gia.dateAddress = gia.pdf.replace('http://certs.gia114.com/gia/','').substring(0,10);
	gia.fullName = html.find('.report_summary').text().trim();
	gia.shape = gia.fullName.substring(0,gia.fullName.indexOf(' ')-1);
	gia.size = html.find('.report_details').eq(0).find('td.val').eq(0).text();
	gia.carat = html.find('.report_details').eq(0).find('td.val').eq(1).text();
	gia.color = html.find('.report_details').eq(0).find('td.val').eq(2).text();
	gia.clarity = html.find('.report_details').eq(0).find('td.val').eq(3).text();
	gia.cut = html.find('.report_details').eq(0).find('td.val').eq(4).text();
	
	gia.depth = html.find('.report_details').eq(1).find('td.val').eq(0).text();
	gia.tablePer = html.find('.report_details').eq(1).find('td.val').eq(1).text();
	gia.crownAngle = html.find('td:contains(Crown Angle)').siblings().text();
	gia.crownHeight = html.find('td:contains(Crown Height)').siblings().text();
	gia.pavilionAngle = html.find('td:contains(Pavilion Angle)').siblings().text();
	gia.pavilionDepth = html.find('td:contains(Pavilion Depth)').siblings().text();
	gia.starLength = html.find('td:contains(Star Length)').siblings().text();
	gia.lowerHalf = html.find('td:contains(Lower Half)').siblings().text();
	gia.girdle = html.find('td:contains(Girdle)').siblings().text();
	gia.bottomTip = html.find('td:contains(Culet)').siblings().text();
	
	gia.polish = html.find('.report_details').eq(2).find('td.val').eq(0).text();
	gia.symmetry = html.find('.report_details').eq(2).find('td.val').eq(1).text();
	gia.fluor = html.find('.report_details').eq(3).find('td.val').eq(0).text();
	gia.features = html.find('.report_details').eq(4).find('td.val').eq(0).text();
	gia.remark = html.find('p:contains(Comments)').parent().find('.val').text();
	gia.waistCode = html.find('p:contains(Inscription)').parent().find('.val').text();
	
	var typeAndCode = gia.waistCode.split(' ');
	gia.type = typeAndCode[0];
	gia.code = typeAndCode[1];
	
	createProp(gia);
	return gia;
}
//生成IGI证书对象
function createIGI(html){
	var igi = {};
	igi.pdf = html.find('a:contains(Download PDF)').attr('href');
	igi.dateAddress = html.find('.report_details').find('td.val').eq(1).text();
	igi.shape = html.find('.report_details').find('td.val').eq(2).text().split(' ')[0];
	igi.size = html.find('.report_details').find('td.val').eq(3).text();
	igi.carat = html.find('.report_details').find('td.val').eq(4).text();
	igi.color = html.find('.report_details').find('td.val').eq(5).text();
	igi.clarity = html.find('.report_details').find('td.val').eq(6).text();
	igi.cut = html.find('.report_details').find('td.val').eq(7).text();
	igi.depth = html.find('.report_details').find('td.val').eq(8).text();
	igi.tablePer = html.find('.report_details').find('td.val').eq(9).text();
	igi.crownHeight = html.find('td:contains(Crown Height)').siblings().text();
	igi.pavilionDepth = html.find('td:contains(Pavilion Depth)').siblings().text();
	igi.girdle = html.find('td:contains(Girdle)').siblings().text();
	igi.bottomTip = html.find('td:contains(Culet)').siblings().text();
	igi.polish = html.find('td:contains(Polish)').siblings().text();
	igi.symmetry = html.find('td:contains(Symmetry)').siblings().text();
	igi.fluor = html.find('td:contains(Fluorescence)').siblings().text();
	igi.remark = html.find('td:contains(Description)').siblings().text();
	
	igi.type = 'IGI';
	igi.code = $('[name="q"]').val();
	igi.waistCode = igi.type+' '+igi.code;
	
	createProp(igi);
	return igi;
}
//生成形状中文名称和图片
function createProp(cert){
	var i = cert.shape && shapeName[cert.shape.toUpperCase()];
	cert.shapeChName = shapeChName[i];
	cert.shapeImg = shapeImg[i];
}
//初始化参数
var shapeName = createShape();
var shapeChName = ['圆形','公主方形','祖母绿','三角形','枕形','橄榄形','雷帝恩形','椭圆形','梨形','心形'];
var shapeImg = ['zszel01.png','zszel05.png','zszel02.png','zszel04.png','zszel09.png','zszel07.png','zszel08.png','zszel10.png','zszel06.png','zszel03.png'];
function createShape(){
	if(shapeName) return shapeName;
	shapeName = [];
	shapeName['ROUND'] = 0;
	shapeName['PRINCESS'] = 1;
	shapeName['EMERALD'] = 2;
	shapeName['TRIANGLE'] = 3;
	shapeName['CUSHION'] = 4;
	shapeName['MARQUISE'] = 5;
	shapeName['RADIANT'] = 6;
	shapeName['OVAL'] = 7;
	shapeName['PEAR'] = 8;
	shapeName['HEART'] = 9;
	return shapeName;
}
