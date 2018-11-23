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

				var html = '';
				var count = 0;
				inputUrl.searchParams.forEach((value, key) => {
					html += "<div class='query-item-row' data-key='" + key + "'>";

					html += "<div class='query-count'>" + (++count) + "</div>";
					html += "<div class='query-key'> <input type='text' value='" + key + "' ><a href='#' class='action-copy copy-trigger'>copy</a> </div>";
					html += "<div class='query-value'> <input type='text' value='" + value + "' ><a href='#' class='action-copy copy-trigger'>copy</a> </div>";
					html += "<div class='query-controls'> <a href='#' class='action-remove'>remove</a></div>";

					html += "</div>";
				});

				if (count === 0) {
					html += "<div class='query-item-row'>";
					html += "<div class='query-empty'>url contains no query/search parameters</div>";
					html += "</div>";
				}

				$(".query-table").html(html);
				renderUrl(url);

			} catch (e) {
				error = ERROR.INVALID_URL;
				$(".url-result-wrapper").hide();

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
		$(this).html("copied!");
		var $this = $(this);
		setTimeout(function () {
			$this.html("copy");
		}, 2000);
	})
});

let renderUrl = (url) => {
	$(".url-result-wrapper").show();
	$(".url-result").html("<a href='" + url.href + "' target='_blank'>" + url.href + "</a>");
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