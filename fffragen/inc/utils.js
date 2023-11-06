/* jQuery StringPad */
$.strPad = function(i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
};



/**
 * Source: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 * @return {Array} a The shuffled array
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

