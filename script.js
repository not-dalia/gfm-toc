var tabLength = 2;
var tabCharacter = " ";

function generate() {
	document.getElementById('fetch-error').innerText = "";
	var inputText = document.getElementById("input").value;
	var regex = /^(\#\#+)\s(.+)$/gm;
	var matches;
	var toc = [];
	var parents = [parentLevel(0, -1)];
	var includeUnlinked = document.getElementById("include-unlinked").checked;

	do {
		matches = regex.exec(inputText);
		if (matches) {
			var hashCount = matches[1].length;

			var parent = findParent(parents, hashCount);
			var tabCount = parent.tabCount + 1;
			parents.unshift(parentLevel(hashCount, tabCount));

			var singleTab = new Array(tabLength + 1).join(tabCharacter);
			var whitespace = new Array(tabCount + 1).join(singleTab);
			var escapedText = escapeCodeblocks(matches[2]);
			console.log(escapedText);
			var elementsFromText = createElementFromHTML(escapedText);
			var text = "";
			var link = "";

			for (var i = 0; i < elementsFromText.length; i++) {
				var el = elementsFromText[i];
				if (!el.textContent) continue;
				if (el.nodeName == "A" && el.getAttribute("name")){
					text += generateLink(el.textContent, el.getAttribute("name"));
					link = generateLink(el.textContent, el.getAttribute("name"));
				}
				else text += el.textContent;
			}

			var line = whitespace + "* " + text.replace(/(^\d+\.)(\s)/, "$1\xa0"); //replace space after digit with nbsp to stop github from rendering it as a numbered list
			if (includeUnlinked || link) toc.push(line);
			
		}
	} while (matches);
	// console.log(toc.join('\n'));
	document.getElementById("output").value = toc.join("\n");
}

function generateLink(text, link) {
	if (!link) return text;
	return "[" + text + "](#" + link + ")";
}

function createElementFromHTML(htmlString) {
	var div = document.createElement("div");
	div.innerHTML = htmlString.trim();
	return div.childNodes;
}

function escapeCodeblocks(text) {
	var coderegex = /(`.+?`)/gm;
	var escapedText = text.replace(coderegex, encodeHTML);
	return escapedText;
}

function encodeHTML(htmlString) {
	var div = document.createElement("div");
	div.innerText = htmlString;
	return div.innerHTML;
}

function findParent(parents, hashCount) {
	return parents.filter(function (el) {
		return el.hashCount < hashCount;
	})[0];
}

function fetchText(url) {
	document.getElementById('fetch-error').innerText = "";
	document.getElementById('input').value = "";
	document.getElementById('output').value = "";
	
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

var parentLevel = function (hashCount, tabCount) {
	return {
		hashCount: hashCount,
		tabCount: tabCount
	};
};