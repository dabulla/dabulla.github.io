/* 
 * Minimal encryption just to avoid spam!
 * a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  ä  ö  ü  @  |  -  .  ,  #
 * 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
 */
var mail="9 14 6 15 30 4 1 14 9 5 12 2 21 12 12 1 33 4 5";
var mySystemIndependentCharCodes = " QWERTLUIOPÜÄÖZKJHGFDSAYXCVBNMabcdefghijklmnopqrstuvwxyzäöü@|-.,#\n\t<>_1234567890ß[](){}/+*\?!\"$%&;:'~^°"
// Type javascript:document.body.innerHTML=encrypt("yourtext");void()
function encrypt(str) {
	var res="";
	for(var i=0; i < str.length ; ++i) {
		res += ","+(mySystemIndependentCharCodes.indexOf(str.charAt(i))+i%15);
	}
	return res.substring(1);
}

function decrypt(str) {
	var res="";
	var arr = str.split(",");
	for(var i=0; i < arr.length ; ++i) {
		res += mySystemIndependentCharCodes.charAt(parseInt(arr[i])-i%15);
	}
	return res;
}