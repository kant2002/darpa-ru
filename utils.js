var months = new Array(12);
months[0] = {"long_name":"January", "short_name":"Jan"};
months[1] = {"long_name":"February", "short_name":"Feb"};
months[2] = {"long_name":"March", "short_name":"Mar"};
months[3] = {"long_name":"April", "short_name":"Apr"};
months[4] = {"long_name":"May", "short_name":"May"};
months[5] = {"long_name":"June", "short_name":"Jun"};
months[6] = {"long_name":"July", "short_name":"Jul"};
months[7] = {"long_name":"August", "short_name":"Aug"};
months[8] = {"long_name":"September", "short_name":"Sep"};
months[9] = {"long_name":"October", "short_name":"Oct"};
months[10] = {"long_name":"November", "short_name":"Nov"};
months[11] = {"long_name":"December", "short_name":"Dec"};

Number.prototype.ordinate = function(){
    var num = this,
        ones = num % 10, //gets the last digit
        tens = num % 100, //gets the last two digits
        ord = ["st","nd","rd"][ tens > 10 && tens < 20 ? null : ones-1 ] || 'th';
    return num.toString() + ord;
};

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
}

function ajaxCall(url, type, async, cache){
	var data;
	$.ajax({
		async: async, 
		cache: cache, 
		url: url,
		dataType: type,
		dataFilter: function(data) {
			var response; 
			if (type === 'json')
              return JSON.stringify(JSON.parse(data));
			else
			 return response = data;
		},
		success: function(response){
			data = response;
		}
	});
	return data;
}

function getOfficeDetails(office){
	var office_details = ajaxCall('01-DARPA-'+ office + '.json', 'json', false, true);
	return office_details;
}

function getPrograms() {
	var active_file = "";
	if ((window.location.href.indexOf("deploy") != -1) ||
       (window.location.href.indexOf("darpa.mil") != -1))
		active_file = "active_content_deployed.json";
	else
		active_file = "active_content.json";
		
	var programs  = ajaxCall(active_file, 'json', false, true);
	return programs;
}

function getDetails(filename) {
	var details = ajaxCall(filename, 'json', false, true);
	return details;
}

function getLicenses() {
	var licenses = ajaxCall('license-content.json', 'json', false, true);
	return licenses;
}

function isInArray(value, array) {
  //checks to see if a value exists in an array
  return array.indexOf(value) > -1;
}

function isIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	//check for ie10 and below or ie. If IE browser, return true. If another browser, return false
	if (msie > 0 || window.navigator.msMaxTouchPoints !== void 0 )    
		return true;
	else    
		return false;
}


function isSafari(){
	isSafari = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
	return isSafari;

}

function sortByProperty(property) {
	//sorts json array by a given property name
    return function (a, b) {
        var sortStatus = 0;
		if(a[property] instanceof Date){
			if (a[property] < b[property])
				sortStatus = -1;
			else if (a[property] > b[property])
				sortStatus = 1;
		}
		else{
			if (a[property].toLowerCase().trim() < b[property].toLowerCase().trim())
				sortStatus = -1;
			else if (a[property].toLowerCase().trim() > b[property].toLowerCase().trim())
				sortStatus = 1;
		}
 
        return sortStatus;
    };
}

function sortByMultipleProperties(property1, property2) {

	var property_a = property_b = property1;
    return function (a, b) {

        var sortStatus = 0;
		
		if(typeof(a[property_a]) == "undefined")
			property_a = property2;
		if(typeof(b[property_b]) == "undefined")
			property_b = property2;
		
        if (a[property_a].toLowerCase().trim() < b[property_b].toLowerCase().trim())
            sortStatus = -1;
        else if (a[property_a].toLowerCase().trim() > b[property_b].toLowerCase().trim())
            sortStatus = 1;
 
		property_a = property_b = property1;
        return sortStatus;
    };
}

function getStringArray(object) {
	return object = typeof object == 'string' ? [object] : object;
}

function toCamelCase(str) {
	return str.replace(/(?:^|\s)\w/g, function(match) {
	  return match.toUpperCase();
	});
}

function validEmail(item) {
	
	var value = null;
	
	if(item.value) value = item.value;
	else value = item;
		
	var filter = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
	return filter.test(value);
}

function getModificationDate(new_date, update_date){
	var change_date = "", change_text = "";
	var change_set = [];

	if(new_date == "" && update_date == ""){
		change_set["Date Type"] = change_text;
		change_set["Date"] = change_date;
	}
	else{
		if (new_date != "" && update_date != ""){
			if (new_date >= update_date){
			 change_date = new_date;
			 change_text = "NEW";
			}
			else{
			  change_date = update_date;
			  change_text = "UPDATED";
			}
		}
		else if( new_date != "" && update_date == ""){
			change_date = new_date;
			change_text = "NEW";
		}
		else if(update_date != "" && new_date == ""){
			change_date = update_date;
			change_text = "UPDATED";
		}
		
		change_set["Date Type"] = change_text;
		change_set["Date"] = change_date;
	}

	return change_set;
}


function getLastBuildDate(){
	var build_date = ajaxCall('last-build-date.txt', 'text', false, true);
	return build_date;
}

function getBuildDate(){
	var build_date = ajaxCall('build-date.txt', 'text', false, true);
	return build_date;
}

function stringToDate(text){
	var pattern1 = /\d{4}\d{2}\d{2}/;
	var pattern2 = /\d{4}\-\d{2}\-\d{2}/;
	var dt = "";
	
	if(pattern1.exec(text))
		dt = new Date(text.substring(0,4), parseInt(text.substring(4,6)) - 1, text.substring(6,8)); // - 1 because months starts from 0.
	else if (pattern2.exec(text)){
		text = text.split("-");
		dt = new Date(text[0], parseInt(text[1]) - 1, text[2]); // - 1 because months starts from 0.
	}
	else
		dt = new Date(text);

	return dt;
}


function dateToString(date, separator){
	var date_month = "",
	date_day = "",
	date_year = "",
	string_date = "";
	
	if(separator == "ordinal"){
		date_month = date.getMonth();
		date_day = date.getDate();
		
		string_date = months[date_month].short_name + ' ' + date_day.ordinate();
	}
	else{
		date_month = (date.getMonth() + 1).toString().length == 1? "0" + (date.getMonth() + 1).toString() : date.getMonth() + 1;
		date_day = (date.getDate()).toString().length == 1? "0" + (date.getDate()).toString() : date.getDate();
		date_year = date.getFullYear();
		
		string_date = date_month + separator + date_day + separator + date_year;
	}
	
	
	return string_date;
}

function getUrlParams(param_name)
{
       var query = window.location.search.substring(1);
       var params = query.split("&");
       for (var i=0;i<params.length;i++) {
               var pair = params[i].split("=");
               if(pair[0] == param_name){return pair[1];}
       }
       return "";
}
