/**
 * Extract JSON Metadata from an element or element attribute
 * (loosely inspired by jQuery Metadata Plugin)
 *
 * @author		    Aicke Schulz (aicke.schulz@gmail.com)
 *
 * @history			1.30
 * 					- added more checks to see if there is useful json data in source, otherwise don't try to parse it
 * 					- returns undefined instead of {}, if there is no json data
 * 					1.28
 * 					- disabled JSON.decode strict mode; replacing ' by " as a workaround, would be a dirty and dangerous hack
 * 					1.27
 * 					- using JSON.decode strict mode
 * 					- added debug trackEvent's
 * 					1.26
 * 					- more error proof
 * 					1.25
 * 					- added option to automatically remove data after extraction
 * 					- improved default options handling
 * 					- simplified source extraction/handling
 * 					1.21
 *					- fixed source extraction problem
 *					1.2
 *					- added support for attribute
 *					- added support for json data without {}, e.g. class="data1:123 data2:456"
 *					  (used code from MooTools More Form.Validator -> Element.Properties.validatorProps
 *					1.1
 *					- object oriented version
 *
 * @todo			make it more error proof
 * @todo			expand for the same functionality like the jQuery Plugin (see: http://github.com/jquery/jquery-metadata/raw/master/jquery.metadata.js)
 *
 * @memberOf		JSON
 * @namespace		JSON
 *
 * @param			element	{Element|String}				element from where to extract the json data
 * @param			source	{String} 	[source='class']	json source (e.g. 'data', 'text', 'html')
 * @param			remove	{Boolean}	[remove=false]		remove data after reading
 *
 * @returns			{Object|undefined} 						extracted json data or undefined
 */
JSON.from = function(element, source, remove){

	var jsonObject;

	element = $(element);
	remove = (typeof remove !== 'boolean') ? false : remove;
	source = (typeof source !== 'string') ? 'class' : source;

	if (element) {
		//var dataString = element.get(source);
		var dataString = String(element.get(source)).clean(); // String casting needed for IE
		//console.log(dataString.indexOf("{"), typeof dataString, dataString.length, dataString);
		if (typeof dataString === 'string' && dataString.indexOf(':') > -1) {
			if (dataString.indexOf('{') >= 0 && dataString.indexOf('{') < dataString.indexOf(':')){
				// simple: json data is part of the string, but in brackets
				// get json data
				var jsonString = dataString.substring(dataString.indexOf('{'), dataString.lastIndexOf('}')+1);
				// with merge() the json cannot be undefined
				//jsonObject = Object.merge({}, JSON.decode(jsonString.replace(/'/g, '"')), true);
				jsonObject = Object.merge({}, JSON.decode(jsonString));
				// remove json data from element source
				if (remove) element.set(source, dataString.replace(jsonString, ''));
			} else {
				window.fireEvent('trackEvent', ['Script Error', 'JSON.from', 'Unusual JSON: ' + dataString, undefined, true]);
				// not so simple: json data is the whole string, but not in brackets
				var dataArray = dataString.split(' ').filter(function(split){
					return split.test(':');
				});
				if (dataArray.length > 0){
					var dataPair;
					dataArray.each(function(dataEntry){
						dataPair = dataEntry.split(':');
						if (dataPair[1]){
							try {
								//jsonObject[dataPair[0]] = JSON.decode(dataPair[1].replace(/'/g, '"'), true);
								jsonObject[dataPair[0]] = JSON.decode(dataPair[1]);
							} catch(e){
								window.fireEvent('trackEvent', ['Script Error', 'JSON.from', 'Invalid JSON: ' + dataPair[1], undefined, true]);
							}
						}
					});
				}
				if (remove) element.set(source, ''); // remove all data from the element source
			}
		}
	}

	return jsonObject;

};