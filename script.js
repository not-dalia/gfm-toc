const { generateGfmToc } = require("./generate");

marked.setOptions({
	gfm: true
});

function generate() {
	document.getElementById('fetch-error').innerText = "";
	var inputText = document.getElementById("input").value;
	var includeUnlinked = document.getElementById("include-unlinked").checked;
	var createLinks = document.getElementById("create-links").checked;

	const toc = generateGfmToc(inputText, {includeUnlinked, createLinks});

	document.getElementById("output").value = toc.join("\n");
	document.getElementById("preview").innerHTML =
	marked(toc.join("\n"));
}

function fetchText(url) {
	document.getElementById("fetch-error").innerText = "";
	document.getElementById("input").value = "";
	document.getElementById("output").value = "";
	document.getElementById("preview").innerHTML = "";

	var request = new XMLHttpRequest();
	url = url || document.getElementById('url-field').value;
	if (!url) return;
	document.getElementById('input').value = "Loading...";
	request.open(
		"GET",
		url,
		true
	);
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			populateText(request.responseText);
		} else if (request.status !== 200) {
			showFetchError();
			document.getElementById('input').value = "";
		}
	};
}

function populateText(text) {
	document.getElementById('input').value = text;
}

function showFetchError() {
	document.getElementById('fetch-error').innerText = "Error loading URL"
}

function copyToClipboard(id) {
	const el = document.createElement('textarea');
	el.value = document.getElementById(id || "output").value;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	const selected =
		document.getSelection().rangeCount > 0 ?
		document.getSelection().getRangeAt(0) :
		false;
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
	if (selected) {
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(selected);
	}
};


