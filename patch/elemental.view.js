// Elemental.JS by Ryan Wans
// Copyright (C) 2020 Ryan Wans Development
// Licensed with MIT Software License

!(function(initializer) {
	window.elemental = window.elemental || initializer();
})(() => {
	var StateObj = new Object();
	StateObj.version = "1.0.0";
	StateObj.Elements = new Object();
	StateObj.retrieveElements = function(PATH) {
			var _xhr = new XMLHttpRequest();
			_xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				var RAW = _xhr.responseText;
				window.elemental.parseStorage(RAW);
				}
			};
			_xhr.open("GET", PATH, true);
			window.elemental.aquiredElements = "waiting";
			_xhr.send();
	},
	StateObj.parseStorage = function(RawFile) {
		window.elemental.aquiredElements = "done";
		// Replace all whitespace and newlines with a single space
		RawFile = RawFile.replaceAll(/\s\s+/g," ");
		// Ensure elemental tags remain in string
		var SplitStream = RawFile.replaceAll("<", "|=|-<");
		SplitStream = SplitStream.replaceAll('>', ">|=|-");
		// Funnel into array of elements
		SplitStream = SplitStream.split("|=|-")
		// Parse through to contentify Elemental Object
		var onElement = false, counter = 0, pusher = {}, currentName = "";
		for(var i=0; i<SplitStream.length; i++) {
			var that = SplitStream[i];
			var thatSplit = that.split(/<|>|\s/g);
			if(thatSplit.includes("!!element")) {
				onElement = true;
				pusher[thatSplit[2]] = "";
				currentName = thatSplit[2];
			} else if(thatSplit.includes("/!!element")) {
				onElement = false;
				counter++;
				currentName = "";
			} else if(onElement) {
				pusher[currentName] += that;
			}
		}
		// Convert entried to HTML objects instead of Strings
		for(var i=0; i<Object.keys(pusher).length; i++) {
			var temp = document.createElement('div');
			temp.innerHTML = Object.values(pusher)[i];
			var name = Object.keys(pusher)[i];
			var element = temp;
			if(typeof element == "object" && element != null) {
				element.setAttribute("elemental-rid", btoa(Date.now()));
			}
			pusher[name] = element;
		}
		window.elemental.Elements = pusher;
	},
	StateObj.getElement = function(ElementName) {return window.elemental.Elements[ElementName];}
	return StateObj;
})