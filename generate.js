
var tabLength = 2;
var tabCharacter = " ";

let dom = null;
/**
 * For Node.js, make up a document
 */
function getDocument() {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    dom = new JSDOM("<html></html>");
    return dom.window.document;
}

var document = document || getDocument();

function generateGfmToc(inputText, opts) {
	var regex = /^(\#\#+)\s(.+)$/gm;
	var matches;
	var toc = [];
	var parents = [parentLevel(0, -1)];
	const {includeUnlinked, createLinks} = opts || {};
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

			if (!link && createLinks) {
				link = generateLink(text, linkify(text));
				text = generateLink(text, linkify(text));
			}
			var line = whitespace + "* " + text.replace(/(^\d+\.)(\s)/, "$1\xa0"); //replace space after digit with nbsp to stop github from rendering it as a numbered list
			if (includeUnlinked || link) toc.push(line);

		}
	} while (matches);
	return toc;
}

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

function linkify(text) {
	return text
	  .toLowerCase()
	  .replace(/\s/g, '-')
	  .replace(/[^0-9a-z.-]/g, '');
}

var parentLevel = function (hashCount, tabCount) {
	return {
		hashCount: hashCount,
		tabCount: tabCount
	};
};

// export, if we have a module
if ((typeof module) === 'object') {
    module.exports = { generateGfmToc };
}

