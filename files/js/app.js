$(document).ready(function () {


	var url;
	$("form.url-input-wrapper").submit(function (e) {
		e.preventDefault();
		url = undefined;
		var input = $(".url-input-wrapper input").val();

		var error = false;
		if (input != null) {
			input = input.trim();

			try {
				let inputUrl = new URL(input);
				url = inputUrl;

				var html = "";
				var count = 0;
				inputUrl.searchParams.forEach((value, key) => {
					html += "<div class='query-item-row' data-key='" + key + "'>";

					html += "<div class='query-count'>" + (++count) + "</div>";
					html += "<div class='query-key'> <input type='text' value='" + key + "' ><a href='#' class='action-copy copy-trigger'><i class='material-icons'>file_copy</i></a></a> </div>";
					html += "<div class='query-value'> <input type='text' value='" + value + "' ><a href='#' class='action-copy copy-trigger'><i class='material-icons'>file_copy</i></a></a> </div>";
					html += "<!--<div class='query-controls'> <a href='#' class='action-remove'><i class='material-icons'>clear</i></a></div>-->";

					html += "</div>";
				});

				if (count === 0) {
					html += "<div class='query-item-row'>";
					html += "<div class='query-empty'>url contains no query/search parameters</div>";
					html += "</div>";
				}

				$(".query-table-wrapper").show();
				$(".query-table").html(html);
				renderUrl(url);

			} catch (e) {
				error = ERROR.INVALID_URL;
				$(".url-result-wrapper").hide();
				console.error(e);

			}
		} else {
			error = ERROR.INPUT_NULL;
			$(".url-result-wrapper").hide();

		}

	});

	$(document).on("keyup", ".query-key input", function (e) {
		if (typeof (url) !== 'undefined') {
			let $parent = $(this).parent().parent();
			let thisKeyName = $parent.attr("data-key");
			let newKeyName = $(this).val();
			let thisKeyVal = url.searchParams.get(thisKeyName);
			url.searchParams.delete(thisKeyName);
			url.searchParams.set(newKeyName, thisKeyVal);
			$parent.attr("data-key", newKeyName);

			renderUrl(url);
		}

	});

	$(document).on("keyup", ".query-value input", function (e) {

		if (typeof (url) !== 'undefined') {
			let $parent = $(this).parent().parent();
			let key = $parent.attr("data-key");
			url.searchParams.set(key, $(this).val());
			renderUrl(url);

		}
	});

	$(".url-result-copy").on("click", function (e) {
		if (typeof (url) !== 'undefined') {
			copyToClipboard(url.href);
		}
	});

	$(document).on("click", ".copy-trigger", function (e) {
		var original = $(this).html();
		$(this).html("<i class='material-icons'>done</i>");
		var $this = $(this);
		setTimeout(function () {
			$this.html(original);
		}, 2000);
	})
});

let renderUrl = (url) => {
	$(".url-result-wrapper").show();
	var coloredHref = '';
	if(url.protocol != '') {
		coloredHref += "<span class='uf-protocol'>"+url.protocol+"</span><span class='uf-slash'>//</span>";
	}
	if(url.username != '') {
		coloredHref += "<span class='uf-username'>"+url.username+"</span>";
	}
	if(url.password != '') {
		coloredHref += "<span class='uf-colon'>:</span><span class='uf-password'>"+url.password+"</span><span class='uf-at'>@</span>";
	}

	if(url.host.indexOf(":") !== -1) {
		coloredHref += "<span class='uf-host'>"+url.host.substring(0, url.host.indexOf(":"))+"</span><span class='uf-colon'>:</span>";
		coloredHref += "<span class='uf-port'>"+url.port+"</span>";
	} else {
		coloredHref += "<span class='uf-host'>"+url.host+"</span>";
	}
	coloredHref += "<span class='uf-path'>"+url.pathname+"</span>";

	var queryString = '';
	var queryItemCount = 0;
	url.searchParams.forEach((value, key) => {
		if(queryItemCount === 0) {
			queryString += "<span class='uf-question-mark'>?</span>";
		} else {
			queryString += "<span class='uf-ampersand'>&</span>";
		}
		queryString += "<span class='uf-query-item'>"+key+"</span><span class='uf-equal-sign'>=</span><span class='uf-query-value'>"+encodeURIComponent(value)+"</span>";
		++queryItemCount;
	});

	coloredHref = coloredHref + queryString;

	if(url.hash != '') {
		coloredHref += "<span class='uf-hash'>" + url.hash + "</span>";
	}
	
	$(".url-result").html("<a href='" + encodeURI(url.href) + "' target='_blank' rel='noopener'>" + coloredHref + "</a>");
}

let ERROR = {
	INPUT_NULL: 0,
	INVALID_URL: 1,
}

let copyToClipboard = (str) => {
	var el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};