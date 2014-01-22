var response;
var gerritUrl = 'https://gerrit.moc.net/';

$(function () {
	$('.gerrit-changes').each(function (index) {
		var container = $(this);
		var issueId = $(this).data('issues-id');

		var gerritRequest = $.ajax({
			dataType: "json",
			url: 'http://gerrit.localhost/changes/',
			data: 'o=LABELS&q=tr:' + issueId,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			cache: true,
			beforeSend: _beforeSend,
			dataFilter: _dataFilter,
			complete: _complete,
			error: _error,
			success: _success
		});


		function _beforeSend(jqXHR, settings) {
		}

		function _dataFilter(data, type) {
			data = data.substring(5);
			return data;
		}

		function _complete(jqXHR, textStatus) {
		}

		function _error(jqXHR, textStatus, errorThrown) {
		}

		function _success(data, textStatus, jqXHR) {
			response = data;
			console.log(response);

			container.html(
					'<table class="list changes">' +
							'	<thead>' +
							'		<tr>' +
						//'			<th></th>' +
							'			<th>Subject</th>' +
							'			<th>Owner</th>' +
							'			<th>Project</th>' +
							'			<th>Branch</th>' +
							'			<th>Updated</th>' +
							'			<th>CR</th>' +
							'			<th>V</th>' +
							'		</tr>' +
							'	</thead>' +
							'	<tbody>' +
							'	</tbody>' +
							'</table>'
			);

			$.each(data, function (key, change) {
				var updated = new Date(change.updated);
				var status = getStatus(change);
				$('tbody', container).append(
						'<tr id="change-' + change._number + '" class="status-' + change.status.toLowerCase() + '">' +
							// '	<td class=""></td>' +
								'	<td class="subject"><a href="' + gerritUrl + change._number + '" target="_gerrit">' + change.subject + ' (' + change.status + ')</a></td>' +
								'	<td class="owner"><a href="' + gerritUrl + '#/q/owner:' + encodeURI('"' + change.owner.name + '"') + '+status:' + change.status.toLowerCase() + ',n,z" target="_gerrit">' + change.owner.name + '</a></td>' +
								'	<td class="project"><a href="' + gerritUrl + '#/q/status:merged+project:' + change.project + ',n,z" target="_gerrit">' + change.project + '</a></td>' +
								'	<td class="branch"><a href="' + gerritUrl + '#/q/status:merged+project:' + change.project + '+branch:' + change.branch + ',n,z" target="_gerrit">' + change.branch + '</a></td>' +
								'	<td class="updated">' + updated.format("d. mmm") + '</td>' +
								'	<td class="cr ' + status.cr.state + '"><span>' + status.cr.name + '</span></td>' +
								'	<td class="v ' + status.v.state + '"><span>' + status.v.name + '</span></td>' +
								'</tr>'
				);
			});

			$('tbody tr:odd', container).addClass('odd');
			$('tbody tr:even', container).addClass('even');
		}
	});


	function getStatus(change) {
		console.log(change);

		//console.log(Object.keys(change.labels["Code-Review"]));
		//console.log(change.labels["Code-Review"]);

		if (change.labels["Code-Review"] && Object.keys(change.labels["Code-Review"]).length > 0) {
			var cr_state = Object.keys(change.labels["Code-Review"])[0];
			var cr_name = change.labels["Code-Review"][Object.keys(change.labels["Code-Review"])[0]].name;
		} else {
			var cr_state = 'none';
			var cr_name = '';
		}

		if (change.labels["Verified"] && Object.keys(change.labels["Verified"]).length > 0) {
			var v_state = Object.keys(change.labels["Verified"])[0];
			var v_name = change.labels["Verified"][Object.keys(change.labels["Verified"])[0]].name;
		} else {
			var v_state = 'none';
			var v_name = '';
		}

		var status = {
			cr: {
				state: cr_state,
				name: cr_name
			},
			v: {
				state: v_state,
				name: v_name
			}
		};

		return status;
	}


});

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d: d,
					dd: pad(d),
					ddd: dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m: m + 1,
					mm: pad(m + 1),
					mmm: dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy: String(y).slice(2),
					yyyy: y,
					h: H % 12 || 12,
					hh: pad(H % 12 || 12),
					H: H,
					HH: pad(H),
					M: M,
					MM: pad(M),
					s: s,
					ss: pad(s),
					l: pad(L, 3),
					L: pad(L > 99 ? Math.round(L / 10) : L),
					t: H < 12 ? "a" : "p",
					tt: H < 12 ? "am" : "pm",
					T: H < 12 ? "A" : "P",
					TT: H < 12 ? "AM" : "PM",
					Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "h:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
