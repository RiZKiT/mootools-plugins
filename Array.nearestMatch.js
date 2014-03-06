/**
 * Array.nearestMatch()
 *
 * returns the value of an array which is the nearest match for the value
 *
 * @example		Array.nearestMatch([1, 5, 10], 4)) == 5;
 *
 * @author		Dimitar "coda" Christoff (http://fragged.org)
 *				Aicke Schulz (aicke.schulz@gmail.com)
 */
if (typeof Array.nearestMatch === 'undefined'){
	Array.implement({
		nearestMatch: function(value) {
			var indexes = {},
				diff = null,
				values = this.map(function(element, index) {
					diff = Math.abs(element - value);
					indexes[diff] = index;
					return diff;
				});
			return this[indexes[Math.min.apply(null, values)]];
		}
	});
}
