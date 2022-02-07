/* 
 */
var email="38,44,37,47,63,38,36,50,46,43,51,42,62,54,55,30,63,35,37";
var address="5,39,50,35,41,46,40,54,56,58,57,73,12,88,81,31,48,70,77,75,77,80,79,8,29,68,58,46,56";
var telDE="88,74,80,3,74,81,81,7,86,79,83,11,90,83,87,0,75,78";
var telCH="88,74,72,3,80,82,83,7,80,79,84,11,83,84,93";

$(function() {
	$("#email").html(decrypt(email));
	$("#telephoneDE").html(decrypt(telDE));
	$("#telephoneCH").html(decrypt(telCH));
	$(".leaf").hide();

	$("#businesscard").css("margin-top", "-250px");
	setTimeout(function() {$("#businesscard").animate({"margin-top":"-150px", "easing":"easeOutBounce"}, 2000);}, 000);
	$(".leaf").each(function(idx, elem) {
		setTimeout(function() {
			$(elem).fadeIn(2000);
		}, idx*150+500);
		
	});
});