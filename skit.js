window.Confirm = function(obj){

	if(obj.ok){

		let message = '';
		if(obj.message){
			message = `<div class="ConfirmMessage">`+obj.message+`</div>`;
		}

		let mask = `
			<div class="Confirm NoSelect">
				<div class="ConfirmTitle">`+obj.title+`</div>
				`+message+`
			</div>
			<div class="ConfirmActions">
				<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button>
			</div>`;

		if(obj.no !== false){

			mask = `
				<div class="Confirm NoSelect">
					<div class="ConfirmTitle">`+obj.title+`</div>
					`+message+`
				</div>
				<div class="ConfirmActions">
					<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button> <button id="Confirm-no" class="`+obj.noclass+`">`+obj.no+`</button> 
				</div>`;
		}

		if(document.getElementById('Confirm')){
			var div = document.getElementById('Confirm');
			div.innerHTML = mask;
		}else{
			var div = document.createElement('dialog');
			div.setAttribute('id', 'Confirm');
			div.innerHTML = mask;
			document.body.appendChild(div);
		}

		document.getElementById('Confirm').showModal();
		document.body.classList.add('NoScroll');

		if(document.getElementById('Confirm-ok')){
			document.getElementById('Confirm-ok').focus();
		}

		div.addEventListener('click', (e) => {

			if(div === e.target){

				document.getElementById('Confirm').close();
				document.body.classList.remove('NoScroll');

				if(obj.cancelFn){
					obj.cancelFn();
				}
			}
		});

		document.getElementById('Confirm-ok').addEventListener('click', (e) => {

			document.getElementById('Confirm').close();
			document.body.classList.remove('NoScroll');

			if(obj.okFn){
				obj.okFn();
			}
		});

		document.getElementById('Confirm-ok').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){

				document.getElementById('Confirm').close();
				document.body.classList.remove('NoScroll');

				if(obj.okFn){
					obj.okFn();
				}
			}
		});

		document.getElementById('Confirm-no').addEventListener('click', (e) => {

			document.getElementById('Confirm').close();
			document.body.classList.remove('NoScroll');

			if(obj.noFn){
				obj.noFn();
			}
		});

		document.getElementById('Confirm-no').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){

				document.getElementById('Confirm').close();
				document.body.classList.remove('NoScroll');
				obj.noFn();
			}
		});
	}
};


window.Copy = {

	id: (id) => {

		if(document.getElementById(id)){

			var el = document.getElementById(id);

			var tx = document.createElement('textarea');
			tx.textContent = el.value ?? el.textContent.replace(/\s+$/, '').replace(/^\s+/, '');
			tx.focus();
			tx.classList.add('hidden');
			tx.style.width = '1px';
			tx.style.height = '1px';
			document.body.appendChild(tx);
			tx.select();
			document.execCommand('copy');
		
			window.setTimeout(() => {
				tx.parentNode.removeChild(tx);
			}, 10);
		}
	},

	string: (t) => {

		var tx = document.createElement('textarea');
		tx.textContent = t;
		tx.focus();
		tx.classList.add('hidden');
		tx.style.width = '1px';
		tx.style.height = '1px';
		document.body.appendChild(tx);
		tx.select();
		document.execCommand('copy');
	
		window.setTimeout(() => {
			tx.parentNode.removeChild(tx);
		}, 10);
	}
};
window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
	Darkmode.load();
});

window.Darkmode = {

	options: ['1', '2', '3'],

	set: (dark) => {

		if(dark){
			document.body.classList.add('DarkMode');
			document.body.classList.remove('LightMode');
		}else{
			document.body.classList.remove('DarkMode');
			document.body.classList.add('LightMode');
		}

		Darkmode._listen(localStorage.getItem('skitConfigTheme'), dark);
	},

	_listen: (c, dark) => {

		var els = document.querySelectorAll('[data-skit-listen=darkmode]');
		els.forEach((el) => {

			if(el.nodeName == 'SELECT'){
				el.value = c;
			}

			if(el.nodeName == 'INPUT' && el.type == 'checkbox'){
				el.checked = dark;
			}
		});
	},

	load: () => {

		if(!localStorage.getItem('skitConfigTheme')){

			Darkmode.config('3');

		}else{

			Darkmode.config(localStorage.getItem('skitConfigTheme'));
		}
	},

	config: (c) => {

		var dark = true;

		if(Darkmode.options.includes(c)){

			localStorage.setItem('skitConfigTheme', c);

			// DARK
			if(c == '1'){

				dark = true;
				localStorage.setItem('skitDarkMode', 'true');
			}

			// LIGHT
			if(c == '2'){

				dark = false;
				localStorage.setItem('skitDarkMode', 'false');
			}

			// SYSTEM
			if(c == '3'){

				// SYSTEM DARK
				if(window.matchMedia('(prefers-color-scheme: dark)').matches == true){
					dark = true;
				}

				// SYSTEM LIGHT
				if(window.matchMedia('(prefers-color-scheme: light)').matches == true){
					dark = false;
				}
				localStorage.setItem('skitDarkMode', 'system');
			}
		}

		Darkmode.set(dark);

		Darkmode._listen(c, dark);
	}
};

Darkmode.load();
window.Debounce = (function(fn, ms, id){

	if(typeof(debounceInstance) === 'undefined'){
		window.debounceInstance = {};
	}

	return function(fn, ms, id){

		clearTimeout(debounceInstance[id]);
		debounceInstance[id] = setTimeout(fn, ms);
	};
}());

/* USAGE

Debounce(() => {

}, 1000, id);
*/
window.Dualrange = {
	unsetDisabled: (id) => {

		if(document.getElementById(id)){

			var el = document.getElementById(id);
			el.parentElement.classList.remove('disabled');

			var ranges = el.querySelectorAll('input[type=range]');

			ranges.forEach((range) => {
				range.removeAttribute('disabled');
			});
		}
	},
	setDisabled: (id) => {

		if(document.getElementById(id)){

			var el = document.getElementById(id);
			el.parentElement.classList.add('disabled');

			var ranges = el.querySelectorAll('input[type=range]');

			ranges.forEach((range) => {
				range.setAttribute('disabled', 'disabled');
			});
		}
	},
	toggleDisabled: (id) => {

		if(document.getElementById(id)){

			var el = document.getElementById(id);
			if(el.parentElement.classList.contains('disabled')){
				Dualrange.unsetDisabled(id);
			}else{
				Dualrange.setDisabled(id);
			}
		}
	},
	getValue: (id) => {

		var min = null;
		var max = null;

		if(document.getElementById(id)){

			var el = document.getElementById(id);
			var ranges = el.querySelectorAll('input[type=range]');

			var tempMin = Number(ranges[0].value);
			var tempMax = Number(ranges[1].value);

			if(tempMin == tempMax){

				min = tempMin;
				max = tempMax;

				return [min, max];
			}

			if(tempMin < tempMax){

				min = tempMin;
				max = tempMax;

				return [min, max];
			}

			if(tempMin > tempMax){

				min = tempMax;
				max = tempMin;

				return [min, max];
			}
		}

		return [min, max];
	}
};

class Modal{

	constructor(id, opts){

		this.currentX = 0;
		this.currentY = 0;

		this.lastX = 0;
		this.lastY = 0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.calls = [];

		this.data = new Object;

		// OPTIONS
		this.options = {
			'id': id,
			'canMove': true,
			'size': 'free',
			'title': 'MODAL',
			'html': ''
		};

		if(opts){

			if(opts.title){
				this.options.title = opts.title.substring(0, 50);
			}

			if(typeof(opts.canMove) === 'boolean'){
				this.options.canMove = opts.canMove;
			}
		}

		this._canMove = false;

		// EXIST DIALOG IN HTML
		if(document.getElementById(id)){

			this.comp = document.getElementById(id);

		// CREATE NEW DIALOG
		}else{

			this.comp = document.createElement('dialog');
			this.comp.classList.add('Modal');
			this.comp.setAttribute('id', id);

			document.body.appendChild(this.comp);

			this.options.html = `
				<div class="TopBar">
					<div class="Move">`+this.options.title+`</div>
					<div class="Close"><button data-skit="close">⨉</button></div>
				</div>
				<div class="ModalContent">
					<div class="pd1">
						<p>...<p>
					</div>
				</div>`;

			this.comp.innerHTML = this.options.html;
		}

		this.move = this.comp.querySelector('.Move');

		this.initMove();

		this.comp.addEventListener('click', () => {
			this.setFocus();
		});

		if(this.comp.querySelector('[data-skit="close"]')){

			this.comp.querySelector('[data-skit="close"]').addEventListener('click', (e) => {
				this.close();
			});
		}
	}

	setData(o){

		if(typeof(o) === 'object'){

			for(var index in o) {

				this.data[index] = o[index];
			};
		}
	}

	unsetData(index){

		if(typeof(this.data[index]) !== 'undefined'){

			delete this.data[index];
		}
	}

	setCenter(){

		var viewX = document.documentElement.clientWidth || document.body.clientWidth;
		var viewY = document.documentElement.clientHeight || document.body.clientHeight;

		var rect = this.comp.getBoundingClientRect();

		this.currentX = (viewX / 2) - (rect.width / 2);
		this.currentY = (viewY / 2) - (rect.height / 2);

		this.lastX = this.currentX;
		this.lastY = this.currentY;

		this.comp.style.left = this.currentX+'px';
		this.comp.style.top = this.currentY+'px';
	}

	initMove(){

		if(!this.options.canMove){

			this.move.style.cursor = 'no-drop';
			return false;
		}

		document.addEventListener('mousedown', (evt) => {

			if(this.move && evt.target == this.move){

				this._setZIndex(this._getZIndex());

				this._canMove = true;

				this.mouseX = evt.x;
				this.mouseY = evt.y;

				this.currentX = this.lastX;
				this.currentY = this.lastY;

				this.currentX = Number(this.comp.style.left.replace('px', ''));
				this.currentY = Number(this.comp.style.top.replace('px', ''));

				document.addEventListener('mousemove', this.handleMove);
			}
		});

		document.addEventListener('touchstart', (evt) => {

			if(this.move && evt.target == this.move){

				this._setZIndex(this._getZIndex());

				this._canMove = true;

				this.mouseX = evt.touches[0].pageX;
				this.mouseY = evt.touches[0].pageY;

				this.currentX = this.lastX;
				this.currentY = this.lastY;

				this.currentX = Number(this.comp.style.left.replace('px', ''));
				this.currentY = Number(this.comp.style.top.replace('px', ''));

				document.addEventListener('touchmove', this.handleMove);
			}
		});

		document.addEventListener('mouseup', (evt) => {

			this._canMove = false;

			document.removeEventListener('mousemove', this.handleMove);
		});

		document.addEventListener('touchend', (evt) => {

			this._canMove = false;

			document.removeEventListener('touchmove', this.handleMove);
		});
	}

	handleMove = (evt) => {

		if(!this.options.canMove){
			return false;
		}

		if(this._canMove === true){

			window.requestAnimationFrame(() => {

				var evtX = evt.x ?? evt.touches[0].pageX;
				var evtY = evt.y ?? evt.touches[0].pageY;

				this.lastX = (this.currentX + evtX - this.mouseX).toFixed(0)
				this.lastY = (this.currentY + evtY - this.mouseY).toFixed(0);

				this.comp.style.left = this.lastX+'px';
				this.comp.style.top = this.lastY+'px';
			});
		}
	}

	_getZIndex(){

		var diags = document.querySelectorAll('dialog');

		var zIndex = 0;

		diags.forEach((diag) => {

			if(this.comp != diag){

				var temp = Number(window.document.defaultView.getComputedStyle(diag).getPropertyValue('z-index'));

				if(temp >= zIndex){
					zIndex = temp;
				}
			}
		});

		if(zIndex <= 99){
			zIndex = 99;
		}

		zIndex++;

		return zIndex;
	}

	_setZIndex(z){
		this.comp.style.zIndex = z;
	}

	setTitle(t){

		this.options.title = t.substring(0, 50);
		this.comp.querySelector('.Move').textContent = this.options.title;
	}

	setContent(h){

		this.comp.querySelector('.ModalContent').innerHTML = h;
	}

	setFocus(){

		this._setZIndex(this._getZIndex());
	}

	open(){

		Debounce(() => {
			this.comp.show();

			this.setCenter();

			this._call();

			this._setZIndex(this._getZIndex());
		}, 50, 'modal');
	}

	close(){

		this.comp.close();

		this.currentX = 0;
		this.currentY = 0;
		this.comp.style.transform = null;
		this.comp.style.zIndex = null;
	}

	_call(){

		this.calls.forEach((call) => {

			call();
		});
	}

	done(fn){

		if(typeof(fn) == 'function'){

			this.calls.push(fn);
		}
	}
}
class Tabs{

	constructor(id, area, conf){

		this.id = id;

		this.area = area;

		this.conf = conf;

		for(let x in this.conf){

			this.conf[x]['active'] = 'active';
		}

		this.vue = new Vue({
			el: '#'+this.id,
			template: `
				<div class="TabsBtns">
					<div v-for="(t, i) in tabs" :class="t.active"><button type="button" @click="setTab(i)" v-html="t.tab"></button></div>
				</div>`,
			data: {
				tabs: this.conf,
				component: this
			},
			methods: {

				setTab(i){

					for(let x in this.tabs){

						if(x == i){

							this.tabs[x]['active'] = 'active';

							this.component.setTab(this.tabs[x].for);

							localStorage.setItem('tab-'+this.component.id, i);

						}else{

							this.tabs[x]['active'] = '';
						}
					}
				}
			},
			created: function() {

				let i = 0;

				if(localStorage.getItem('tab-'+this.component.id)){

					i = localStorage.getItem('tab-'+this.component.id);

				}

				this.setTab(i);
			}
		});
	}

	setTab(index){

		let el = document.getElementById(this.area);

		if(el){

			let tabs = el.querySelectorAll('div[data-tab]');

			for(let dv of tabs){

				if(index == dv.getAttribute('data-tab')){

					dv.classList.remove('TabsInactive');
					dv.classList.add('TabsActive');

				}else{

					dv.classList.add('TabsInactive');
					dv.classList.remove('TabsActive');
				}
			}
		}
	}
}
window.Tooltip = {

	handle: (e) => {

		if(!window.lastTooltip){
			window.lastTooltip = '';
		}
		if(!window.toolTips){
			window.toolTips = {};
		}

		// CREATE NON HTML TOOLTIP DIV
		if(e.target && e.target !== document && e.target !== window && typeof(e.target.getAttribute('data-title')) == 'string'){

			if(typeof(e.target.getAttribute('data-title-for')) !== 'string'){

				var randomId = 'tip'+(Math.random()*1000000).toFixed(0);

				var div = document.createElement('div');
				div.classList.add('Tooltip');
				div.setAttribute('id', randomId);
				div.textContent = e.target.getAttribute('data-title');

				e.target.setAttribute('data-title-for', randomId);
				e.target.parentElement.appendChild(div);
			}
		}

		// HTML TOOLTIP
		if(e.target && e.target !== document && e.target !== window && typeof(e.target.getAttribute('data-title-for')) == 'string'){

			var atual = e.target.getAttribute('data-title-for');

			var tip = document.getElementById(atual);

			var rect = e.target.getBoundingClientRect();

			var position = e.target.getAttribute('data-title-position') ?? 'top';

			var top = (rect.top - tip.clientHeight - 15).toFixed(0);
			var left = (rect.left+(rect.width / 2)-(tip.clientWidth / 2)).toFixed(0);

			if(top < 5 || position == 'bottom'){
				top = (rect.top + rect.height + 5).toFixed(0);
				position = 'Bottom';

			}else if(position == 'right'){
				top = (rect.top + (rect.height / 2) - 15).toFixed(0);
				left = (rect.left + rect.width + 15).toFixed(0);
				position = 'Right';
			}else if(position == 'left'){
				top = (rect.top + (rect.height / 2) - 15).toFixed(0);
				left = (rect.left - (rect.width * 2) - 15).toFixed(0);
				position = 'Left';
			}else{
				var top = (rect.top - tip.clientHeight - 15).toFixed(0);
				position = 'Top';
			}

			tip.classList.remove('TooltipTop');
			tip.classList.remove('TooltipLeft');
			tip.classList.remove('TooltipRight');
			tip.classList.remove('TooltipBottom');
			tip.classList.add('Tooltip'+position);

			if(tip.getAttribute('data-apply') == null){

				toolTips[atual] = atual;
				lastTooltip = atual;

				if(left < 5){
					left = 5;
				}

				tip.style.top = top+'px';
				tip.style.left = left+'px';

				tip.setAttribute('data-apply', 'true');
				tip.classList.add('TooltipActive');
			}
		}else{

			lastTooltip = '';
		}

		// hide tooltips
		for(var x in toolTips){

			if(document.getElementById(x) && x != lastTooltip){

				var tt = document.getElementById(x);
				tt.removeAttribute('data-apply');
				tt.classList.remove('TooltipActive');
				delete toolTips[x];
			}
		}
	},

	update: (el, t) => {

		if(el){

			if(el.getAttribute('data-title-for') && document.getElementById(el.getAttribute('data-title-for'))){

				var tg = document.getElementById(el.getAttribute('data-title-for'));
				tg.textContent = t;

				window.setTimeout(() => {

					tg.textContent = el.getAttribute('data-title');
				}, 1000);
			}
		}
	}
};

document.addEventListener('mousemove', (e) => {
	Tooltip.handle(e);
});

window.addEventListener('scroll', (e) => {
	Tooltip.handle(e);
});
window.Warning = (obj) => {

	/**
	 * PARAMS
	 * title: string required
	 * message: string not required
	 * color: string not required
	 * timeout: integer, mili seconds, not required, default 8000
	 * id: string not required
	 * position: not required default 8
	 * - 1: left bottom,
	 * - 2: center bottom,
	 * - 3: right bottom,
	 * - 4: left center,
	 * - 6: right center,
	 * - 7: top left,
	 * - 8: top center, default,
	 * - 9: top right
	 */

	var colors = ['danger', 'pri', 'sec', 'dark', 'light'];
	var positions = {
		1: 'WarningLeftBottom',
		2: 'WarningCenterBottom',
		3: 'WarningRightBottom',
		4: 'WarningLeftCenter',
		6: 'WarningRightCenter',
		7: 'WarningLeftTop',
		8: 'WarningCenterTop',
		9: 'WarningRightTop'
	};

	var warnLimit = 5;

	if(obj.title && obj.title != ''){

		var title = String(obj.title);
		var message = String(obj.message ?? '');
		var color = String(obj.color ?? '');
		var timeout = obj.timeout ?? 8000;

		// encodeURIComponent is for security, prevent xss
		var id = encodeURIComponent(String(obj.id ?? 'warning-id-1'));
		var position = obj.position ?? 8;

		// VALIDATE COLORS
		if(colors.includes(color)){

			var cl = colors[colors.indexOf(color)];
			cl = cl.charAt(0).toUpperCase() + cl.slice(1);

			color = 'Warning'+cl;

		// NOT VALID COLORS
		}else{
			color = '';
		}

		// VALIDATE POSITIONS
		if(positions[position]){

			position = positions[position];

		// NOT VALID COLORS
		}else{
			position = positions[8];
		}

		var warn;

		var mask = `<div style="animation-duration: `+timeout+`ms" class="Warning `+color+`" data-id="`+id+`">
				<div>
					<div class="WarningTitle">`+title+`</div>
					<div>`+message+`</div>
				</div>
				<div><button class="WarningClose">⨉</button></div>
			</div>`;

		// WARNING EXISTS
		if(document.getElementById('Warning')){

			warn = document.getElementById('Warning');
			warn.setAttribute('class', position);

		// WARNING NOT EXISTS
		}else{

			warn = document.createElement('div');
			warn.setAttribute('id', 'Warning');
			warn.setAttribute('class', position);
			document.body.appendChild(warn);

			warn.addEventListener('click', (e) => {

				var el = e.target;
				if(e.target.nodeName == 'I'){
					el = el.parentElement;
				}

				if(el.nodeName == 'BUTTON'){

					var warnLine = el.parentElement.parentElement;

					var parent = warnLine.parentElement;
					parent.removeChild(warnLine);
				}

			}, true);
		}

		/* REMOVE EMPTY CANVAS */
		var removes = warn.querySelectorAll('.WarningCanvas');
		removes.forEach(function(el){

			if(el.innerHTML == ''){
				var parent = el.parentElement;
				parent.removeChild(el);
			}
		});

		var warnLine = warn.querySelector('div[data-id="'+id+'"]');

		var totalCanvas = warn.querySelectorAll('div[data-id]');

		// CREATE NEW WARNING
		if(!warnLine){

			// LIMIT OF WARNS
			if(totalCanvas.length < warnLimit){

				var warnLine = document.createElement('div');
				warnLine.setAttribute('class', 'WarningCanvas');
				warnLine.innerHTML = mask;

				warn.appendChild(warnLine);

				Debounce(() => {

					if(typeof(warnLine) !== 'undefined' && typeof(warnLine.parentElement) !== 'undefined'){

						try{

							warnLine.parentElement.removeChild(warnLine);
						}catch{

						}
					}
				}, timeout, id);
			}

		/* UPDATE WARNING */
		}else if(warnLine){

			warnLine.setAttribute('class', `Warning `+color);

			warnLine.innerHTML = `<div>
					<div class="WarningTitle">`+title+`</div>
					<div>`+message+`</div>
				</div>
				<div><button class="WarningClose">⨉</button></div>`;
		}
	}
};