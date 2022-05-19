/*
	formsLog records all nested input ID's in an array.
	used primarily for form submission.
	formsLog = {
		[form_id]: [
			COMPONENT_IDs
		]
	}

	inputsLog records properties for each input as an object.
	Exists to allow for inputs not nested in form elements
	inputsLog = {
		[inputComponent_id]: {
			"component_id": [INPUTCOMPONENT_ID],
			"component_elm": [INPUTCOMPONENT ELEMENT],
			"input_id": [INPUT ELEMENT ID],
			"input_elm": [INPUT ELEMENT],
			"type": [INPUT ELEMENT TYPE],
			"initial_value": [INITIAL VALUE]
		}
	}
*/

function generateHash() {
	return Math.random().toString(36).substring(2, 8);
};

(($ROOT) => {
	// -- form element variables
	let formsLog = {};
	let inputsLog = {};
	let radioLog = {};
	let form, activeMenu, _root;

	// -- form input variables
	let baseClass = "f-input";

	//- select menu handler
    let menuActions = {
        init: function(obj) {
            this.list = obj.options;
			this.keywords = obj.keywords;
            this.currentIndex = -1;
        },
        next: function() {
            this.reset();
            this.currentIndex--;
            if(this.currentIndex<0) this.currentIndex = (this.list.length-1);
            this.list[this.currentIndex].classList.add(baseClass+"--option");
			this.list[this.currentIndex].parentNode.scrollTo({
				"top": this.list[this.currentIndex].offsetTop,
				"left": 0,
				"behavior": "smooth"
			});
        },
        prev: function() {
            this.reset();
            this.currentIndex++;
            if(this.currentIndex>=this.list.length) this.currentIndex = 0;
            this.list[this.currentIndex].classList.add(baseClass+"--option");
			this.list[this.currentIndex].parentNode.scrollTo({
				"top": this.list[this.currentIndex].offsetTop,
				"left": 0,
				"behavior": "smooth"
			});
        },
		highlight: function(key) {
			this.reset();
			key = key.toLowerCase();
			let index = this.keywords.lastIndexOf(key);
			if(index>=0) {
				this.currentIndex = index;
				this.list[index].classList.add(baseClass+"--option");
				this.list[index].parentNode.scrollTo({
					"top": this.list[index].offsetTop,
					"left": 0,
					"behavior": "smooth"
				});
			}
		},
        select: function() {
            this.list[this.currentIndex].click();
        },
        reset: function() {
            let a = this.list.length-1;
            for(a; a>=0; a--) this.list[a].classList.remove(baseClass+"--option");
        }
    }

	function Form() {
		let forms = document.getElementsByTagName("form");
		let a = forms.length-1;
		_root = this;

		for (a; a >= 0; a--) {
			form = forms[a];
			form.id = (form.id) ? form.id : "form_"+generateHash();
			form.noValidate = true;
			form.addEventListener("submit", formSubmit);
			form.addEventListener("reset", formReset);

			formsLog[form.id] = {};
			formsLog[form.id]['inputs'] = FormInputs(form);
		}

		FormInputs();
		disableInvisible();
	}

	// === events === //
	function formSubmit(e) {
		e.preventDefault();

		/*
			Get the form element and gather the inputs
			set "a" for the loop based on the inputs
		*/
		let formObj = formsLog[this.id];
		let formInputs = formObj.inputs;
		let a = formInputs.length-1;

		/*
			Set an object to prepare for submission (dataObj)
			one object for linking input names to their IDs (nameMap)
			and an array to store any failed validation messages (failedValidation)
		*/
		let dataObj = {};
		let nameMap = {};
		let failedValidation = {};
		let _inputElm,
			_componentID,
			_componentObj,
			_componentElm,
			_inputType,
			_isCheckbox,
			prevName;

		for(a; a>=0; a--) {
			_componentID = formInputs[a];
			_componentObj = inputsLog[_componentID];
			_componentElm = _componentObj.component_elm;
			_inputElm = _componentObj.input_elm;
			_inputType = _componentObj.type;
			_isCheckbox = false;

			// handle select menus differently since <select> tags are disabled by default
			if(_inputType=="select") {
				if(_componentElm.classList.contains(baseClass+"--disabled")) continue;
			} else if(_inputElm.disabled) continue;

			// handle checkboxes and radio buttons independently
			if(_inputType == "checkbox") {
				_isCheckbox = true;
				dataObj[_inputElm.name] = _inputElm.checked;
			} else if(_inputType == "radio") {
				if(!dataObj[_inputElm.name]) dataObj[_inputElm.name] = "";
				if(_inputElm.checked) dataObj[_inputElm.name] = _inputElm.value;
			} else dataObj[_inputElm.name] = _inputElm.value;

			if(prevName!=_inputElm.name) nameMap[_inputElm.name] = _componentID;
			prevName = _inputElm.name;
		}

		// - pre validation
		let keys = Object.keys(dataObj);
		let key, dataValidation;
		for(a=keys.length-1; a>=0; a--) {
			key = keys[a];
			if(typeof dataObj[key] != 'string') continue;
			// base validation
			if(!/.{1,}/.test(dataObj[key])) {
				if(!failedValidation[nameMap[key]]) {
					if(!failedValidation[nameMap[key]]) failedValidation[nameMap[key]] = [];
					failedValidation[nameMap[key]].push("This field is empty");
				}
			}
			if(formObj._validate[key]){
				dataValidation = formObj._validate[key](dataObj[key], dataObj);
				if(typeof dataValidation == 'string') {
					if(!failedValidation[nameMap[key]]) failedValidation[nameMap[key]] = [];
					failedValidation[nameMap[key]].push(dataValidation);
				}
			}
		}

		// - submit or send alerts
		let validationKeys = Object.keys(failedValidation);
		let b, validationElm, validationBlock, validationTxt;
		if(validationKeys.length) {
			for(a=validationKeys.length-1; a>=0; a--) {
				_componentID = validationKeys[a];
				_componentObj = inputsLog[_componentID];
				_componentElm = _componentObj.component_elm;
				if(_componentElm.getElementsByClassName(baseClass+"__validation")[0]) {
					validationElm = _componentElm.getElementsByClassName(baseClass+"__validation")[0];
				} else {
					validationElm = document.createElement("ul");
					validationElm.classList.add(baseClass+"__validation");
				}
				for(b=failedValidation[_componentID].length-1; b>=0; b--) {
					validationTxt = document.createTextNode(failedValidation[_componentID][b]);
					validationBlock = document.createElement("li");
					validationBlock.appendChild(validationTxt);
					validationElm.appendChild(validationBlock);
					_componentElm.appendChild(validationElm);
				}
			}
			return;
		} else {
			console.log('SUBMITTING:', dataObj);
			return;
		}

		console.log(tmpObj);
        _ajax_.getData({
            "method": this.method,
            "url": this.action
        }, (data)=>{
            console.log("FIN:", data);
        })
		return false;
	}
	function formReset(e) {
		e.preventDefault();
		
		let formInputs = formsLog[this.id]['inputs'];
		let a = formInputs.length-1;
		
		for(a; a>=0; a--) _root.reset(formInputs[a])
	}

	// ### PUBLIC METHODS ### //
	Form.prototype.disable = function (inputID) {
		let inputObj = inputsLog[inputID];
		if(inputObj.type.indexOf("select")<0) {
        	if(!inputObj.input_elm.disabled) inputObj.input_elm.disabled = true;
		}
		inputObj.component_elm.classList.add("f-input--disabled");
	};
	Form.prototype.enable = function (inputID) {
		let inputObj = inputsLog[inputID];
		if(inputObj.type.indexOf("select")<0) {
        	if(inputObj.input_elm.disabled) inputObj.input_elm.disabled = false;
		}
		inputObj.component_elm.classList.remove("f-input--disabled");
	};
	Form.prototype.require = function (inputID) {
		let inputObj = inputsLog[inputID];
		inputObj.component_elm.classList.add("f-input--required");
	};
	Form.prototype.reset = function (inputID) {
		let inputObj = inputsLog[inputID];

		inputObj.component_elm.classList.remove(baseClass + "--changed");
		
		if(inputObj.type=="checkbox") {
			if(inputObj.input_elm.checked != inputObj.initial_value) inputObj.component_elm.click();
		} else if(inputObj.type=="radio") {
			inputObj.input_elm.checked = false;
		} else inputObj.input_elm.value = inputObj.initial_value;
	};
	Form.prototype.validation = function(formID, obj) {
		let _form = formsLog[formID];
		_form._validate = obj;
	}


	// ### PRIVATE METHODS ### //
	function FormInputs(form) {
		let inputsList = [];
		let checkedQueue = [];
		let event = new Event('change');
		let inputComponents,
			inputComponent,
			input,
			inputLabel,
			inputType,
			fauxSpanLabel,
			genMenu;

		if(form) inputComponents = form.getElementsByClassName(baseClass);
		else inputComponents = document.getElementsByClassName(baseClass);

		let a = inputComponents.length-1;
		for (a; a>=0; a--) {
			inputComponent = inputComponents[a];
			if(inputComponent.dataset.active=="true") continue;

			inputComponent.dataset.active = true;
			inputComponent.id = (inputComponent.id) ? inputComponent.id : "fc_"+generateHash();
			input = inputComponent.querySelector("input,textarea,select"); // return the active input
			input.id = (input.id) ? input.id : input.name;
			input.dataset.parent = inputComponent.id;

			// solidify input type
			inputType = input.hasAttribute("type") ? input.type : input.tagName.toLowerCase();
			inputComponent.dataset.type = inputType;
			
			inputsList.push(inputComponent.id);
			inputsLog[inputComponent.id] = {
				"component_id": inputComponent.id,
				"component_elm": inputComponent,
				"input_id": input.id,
				"input_elm": input,
				"type": inputType,
				"initial_value": (inputType=="radio" || inputType=="checkbox") ? input.checked : input.value
			}
			
			

			if (input.disabled) _root.disable(inputComponent.id);
			if (input.required) _root.require(inputComponent.id);

			// sets up input to be a toggle switch
			if (inputComponent.classList.contains(baseClass + "--toggle")) {
				inputComponent.insertAdjacentElement(
					"beforeend",
					newDummyElement(baseClass + "__toggle")
				);
			}

			if (inputType === "select") {
				//- build markup object for drop menu
				genMenu = buildSelectMenu(inputComponent.id);

				//- attach menu markup in the HTML Object
				inputComponent.insertAdjacentElement("beforeend", genMenu.markup);

				//- activate preselected option
				genMenu.preselected.click();

				//- get faux select (span created in "buildSelectMenu")
				fauxSpanLabel = document.getElementById(inputComponent.id);
				fauxSpanLabel.tabIndex = input.disabled ? (a + 1) * -1 : a + 1; // set proper tab indexes based on markup placement

				//- set proper attributes if input is enabled/disabled
				if (!input.disabled) {
					input.dataset.active = true;
					input.disabled = true;
				} else input.dataset.active = false;

				input.tabIndex = (a + 1) * -1; // prevent tabbing directly into select item
				inputComponent.addEventListener("click", selectClickFocus);

				fauxSpanLabel.dataset.parent = inputComponent.id; // link faux select to parent label
				fauxSpanLabel.addEventListener("focus", selectFocus);
				fauxSpanLabel.addEventListener("blur", selectBlur);
			} else {
				inputLabel = inputComponent.getElementsByTagName("span")[0];
				input.tabIndex = a + 1; // set proper tab indexes based on markup placement
				input.addEventListener("focus", inputFocus);
				input.addEventListener("change", inputChange);
				input.addEventListener("blur", inputBlur);

				if (input.type == "radio" || input.type == "checkbox") {
					// input.insertAdjacentElement("afterend", buildFauxInputs(input.type, inputComponent.id));
				} else {
					if (!input.required) inputLabel.dataset.text = "Optional";
				}

				if(input.type=="checkbox") {
					if(input.checked) checkedQueue.push(input);
					if(inputComponent.dataset.expand) {
						inputsLog[inputComponent.id]['action'] = "expand";
						inputsLog[inputComponent.id]['initial_value'] = input.checked
					}
					if(inputComponent.dataset.unhide) {
						inputsLog[inputComponent.id]['action'] = "unhide";
						inputsLog[inputComponent.id]['initial_value'] = input.checked
					}
					if(inputComponent.dataset.show) {
						inputsLog[inputComponent.id]['action'] = "show";
						inputsLog[inputComponent.id]['initial_value'] = input.checked
					}
				}
			}
		}

		window.addEventListener('load', ()=>{
			let a = checkedQueue.length-1;
			for(a; a>=0; a--) checkedQueue[a].dispatchEvent(event);
		})

		return inputsList;
	}
	function disableInvisible() {
		let invisibleBlocks = document.querySelectorAll(".u-invisible, .u-collapsed, .u-hidden");
		let a = invisibleBlocks.length-1;
		let _inputArray = [];
		let b, invisibleBlock, _inputs, _input;

		for(a; a>=0; a--) {
			invisibleBlock = invisibleBlocks[a];
			if(invisibleBlock.classList.contains(baseClass)) {
				_root.disable(invisibleBlock.id);
				continue;
			}
			_inputs = invisibleBlock.getElementsByClassName(baseClass);
			for(b=_inputs.length-1; b>=0; b--) _inputArray.push(_inputs[b]);
		}
		for(a=_inputArray.length-1; a>=0; a--) _root.disable(_inputArray[a]['id']);
	}


	// === generators === //
	function newDummyElement(className) {
		let element = document.createElement("div");
		element.classList.add(className);
		return element;
	}
	//- build (FAUX) radio button
	function buildFauxInputs(type, inputID) {
		let inputObj = inputsLog[inputID];
		let span = document.createElement("span");
		inputObj['lottie'] = lottie.loadAnimation({
			container: span,
			path: '/lottie/' + type + '-anime.json',
			renderer: 'svg',
			loop: false,
			autoplay: false,
			name: type + " Animation"
		});
		span.classList.add(baseClass + "__" + type);
		return span;
	}
	//- build menu markup
	function buildSelectMenu(inputID) {
		let inputRef = inputsLog[inputID];
        let input = inputRef.input_elm;
		let options = input.getElementsByTagName("option"); // gather all options in select menu
		let a = options.length - 1;
		let option, listItem, svgIcon, selectedOption;

		let selectMenu = document.createElement("div");
		let selectTextSpan = document.createElement("span");
		let selectMenuList = document.createElement("ul");

        inputRef["select_label"] = selectTextSpan;
        inputRef["options"] = [];
		inputRef["keywords"] = [];

		// attach classes
		selectMenu.classList.add(baseClass + "__select");
		selectTextSpan.classList.add(baseClass + "__select__text");
		selectMenuList.classList.add(baseClass + "__select__menu");

		// append children to select menu
		selectMenu.appendChild(selectTextSpan);
		selectMenu.appendChild(selectMenuList);

		for (a; a >= 0; a--) {
			option = options[a];

			// set icon markup
			if (option.dataset.icon && option.dataset.icon != "") {
				svgIcon = "<img src=\"https://styleguide.kingston.com/icons/" + option.dataset.icon + "/16/\" alt=\"icon\" />";
			} else svgIcon = null;

			// build li markup
			listItem = document.createElement("li");
			listItem.dataset.index = a;
			listItem.dataset.parent = inputID;
			listItem.addEventListener("click", selectOptionClick);

			if (option.hidden) listItem.hidden = true;
            else {
				inputRef["options"].push(listItem);
				inputRef["keywords"].push(option.textContent.charAt(0).toLowerCase());
			}
			if (svgIcon) listItem.innerHTML = svgIcon; // attach icon

			listItem.insertAdjacentText("beforeend", option.textContent); // append text from option tag
			selectMenuList.insertAdjacentElement("afterbegin", listItem); // prepend all "li" items
			if (option.selected) selectedOption = listItem; // preselect item
		}

		// code above outputs:
		/*
            <div class="f-input__select">
                <span class="f-input__select__text" id=[[spanID]]>...</span>
                <ul class="f-input__select__menu">
                    <li data-index="X" data-target=[[input.id]]>...</li>
                </ul>
            </div>
        */

		return { markup: selectMenu, preselected: selectedOption };
	}

	
	// === states === //
	//- input focus state (attached to input, textarea, checkboxes, radios)
	function inputFocus() {
		if (this.disabled) return;

		let inputObj = inputsLog[this.dataset.parent];

		activeMenu = null;
		inputObj.component_elm.classList.add(baseClass + "--active");
	}
	//- input change state (attached to input, textarea, checkboxes, radios)
	function inputChange() {
		let inputRef = inputsLog[this.dataset.parent];
		// let lottieAnimation = inputRef.lottie;
		let formComponent = inputRef.component_elm;
		if(!this.value) {
            _root.reset(this.dataset.parent);
            return;
        }
		if (this.type == "checkbox") {
			let elmID = formComponent.dataset.unhide || formComponent.dataset.expand || formComponent.dataset.show;
			let elm;
			if(elmID) {
				elm = document.getElementById(elmID);
				
				if(inputRef.hasOwnProperty("initial_value")) {
					if(this.checked != inputRef.initial_value) {
						if(!elm.classList.contains("f-input")) {
							let targetInputs = elm.getElementsByClassName("f-input");
							let a = targetInputs.length-1;
							for(a; a>=0; a--) _root.enable(targetInputs[a]["id"]);
						} else _root.enable(elm.id);
						switch(inputRef.action) {
							case "show":
								elm.classList.remove("u-invisible");
								break;
							case "expand":
								elm.classList.remove("u-collapsed");
								break;
							default:
								elm.classList.remove("u-hidden")
						}
					} else {
						if(!elm.classList.contains("f-input")) {
							let targetInputs = elm.getElementsByClassName("f-input");
							let a = targetInputs.length-1;
							for(a; a>=0; a--) _root.disable(targetInputs[a]["id"]);
						} else _root.disable(elm.id);
						switch(inputRef.action) {
							case "show":
								elm.classList.add("u-invisible");
								break;
							case "expand":
								elm.classList.add("u-collapsed");
								break;
							default:
								elm.classList.add("u-hidden")
						}
					}
				}
			}
			if (this.checked) {
				// lottieAnimation.playSegments([0, 15], true);
				formComponent.classList.add(baseClass + "--changed");
			} else {
				// lottieAnimation.playSegments([16, 30], true);
				formComponent.classList.remove(baseClass + "--changed");
			}
		} else formComponent.classList.add(baseClass + "--changed");

		/*
		if(this.type == "radio") {
			if(radioLog[this.name] && this != radioLog[this.name]) {
				let prevTarget = radioLog[this.name];
				let prevLottieAnimation = inputsLog[prevTarget.dataset.parent]['lottie'];
				prevLottieAnimation.playSegments([16, 30], true);
			}
			radioLog[this.name] = this;
			lottieAnimation.playSegments([0, 15], true);
		}
		*/
	}
	//- input blur state (attached to input, textarea, checkboxes, radios)
	function inputBlur() {
		let inputComponent = inputsLog[this.dataset.parent]['component_elm'];
		inputComponent.classList.remove(baseClass + "--active");
	}
	//- select focus state (typically on tab)
	function selectFocus(e) {
        let inputComponent = inputsLog[this.id]['component_elm'];
        optionIndex = 0;
        e.preventDefault();

        menuActions.init(inputsLog[this.id]);
        menuActions.reset();
		
        if (inputComponent.classList.contains(baseClass + "--disabled")) return;
		if (inputComponent.classList.contains(baseClass + "--active")) {
			inputComponent.classList.remove(baseClass + "--active");
			document.removeEventListener("keydown", keyDown);
			this.blur();
		} else {
			inputComponent.classList.add(baseClass + "--active");
			document.addEventListener("keydown", keyDown);
		}
	}
	//- select focus on click
	function selectClickFocus() {
		console.log('click focus');
        let inputComponent = inputsLog[this.id]['component_elm'];

        if (inputComponent.classList.contains(baseClass + "--disabled")) return;
		if (activeMenu) {
			if (this != activeMenu) {
				activeMenu.classList.remove(baseClass + "--active");
				activeMenu = this;
				inputComponent.focus();
			} else activeMenu = null;
		} else {
			activeMenu = this;
			inputComponent.focus();
		}
	}
	//- select blur state ()
	function selectBlur() {
		let inputComponent = inputsLog[this.dataset.parent]['component_elm'];
		inputComponent.classList.remove(baseClass + "--active");
		document.removeEventListener("keydown", keyDown);
	}
	

	// === actions === //
	//- click state for select menu option
	function selectOptionClick() {
		let inputRef = inputsLog[this.dataset.parent];
		let input = inputRef['input_elm'];
		let span = inputRef['select_label'];
		let inputComponent = inputRef['component_elm'];

        input.selectedIndex = this.dataset.index;
		if (input.value) inputComponent.classList.add(baseClass + "--changed");
		span.innerHTML = this.innerHTML;
        inputComponent.blur();
	}
	function keyDown(e) {
		if(/^[a-zA-Z0-9]$/.test(e.key)) {
			menuActions.highlight(e.key);
			return;
		}
		switch (e.code) {
			case "ArrowUp":
				e.preventDefault();
                menuActions.prev();
				break;
			case "ArrowDown":
				e.preventDefault();
                menuActions.next();
				break;
			case "Space":
			case "Enter":
				e.preventDefault();
                menuActions.select();
				break;
		}
	}

	// -- INITIATOR
	if(!$ROOT.forms) $ROOT.forms = new Form();
})(Rexus);