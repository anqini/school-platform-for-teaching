
function genToken(n = 6) {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < n; i++)
		    text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
}
// console.log(makesalt());
module.exports = genToken;
