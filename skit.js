window.Confirm = function(obj){

	if(obj.ok){

		let message = '';
		if(obj.message){
			message = `<div class="Confirm-message">`+obj.message+`</div>`;
		}

		let mask = `
			<div class="Confirm no-select">
				<div class="Confirm-title">`+obj.title+`</div>
				`+message+`
			</div>
			<div class="Confirm-actions">
				<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button>
			</div>`;

		if(obj.no !== false){

			mask = `
				<div class="Confirm no-select">
					<div class="Confirm-title">`+obj.title+`</div>
					`+message+`
				</div>
				<div class="Confirm-actions">
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
		document.body.classList.add('No-scroll');

		if(document.getElementById('Confirm-ok')){
			document.getElementById('Confirm-ok').focus();
		}

		div.addEventListener('click', (e) => {

			if(div === e.target){

				document.getElementById('Confirm').close();
				document.body.classList.remove('No-scroll');

				if(obj.cancelFn){
					obj.cancelFn();
				}
			}
		});

		document.getElementById('Confirm-ok').addEventListener('click', (e) => {

			document.getElementById('Confirm').close();
			document.body.classList.remove('No-scroll');

			if(obj.okFn){
				obj.okFn();
			}
		});

		document.getElementById('Confirm-ok').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){

				document.getElementById('Confirm').close();
				document.body.classList.remove('No-scroll');

				if(obj.okFn){
					obj.okFn();
				}
			}
		});

		document.getElementById('Confirm-no').addEventListener('click', (e) => {

			document.getElementById('Confirm').close();
			document.body.classList.remove('No-scroll');

			if(obj.noFn){
				obj.noFn();
			}
		});

		document.getElementById('Confirm-no').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){

				document.getElementById('Confirm').close();
				document.body.classList.remove('No-scroll');
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
window.Dialog = {

	open: (obj) => {

		obj.html = obj.html.split('{{dialogs}}').join('');

		if(!document.getElementById('dialog')){

			var dialog = document.createElement('div');
			dialog.setAttribute('id', 'dialog');

			var area = document.createElement('div');
			area.classList.add('dialog-area');
			area.innerHTML = obj.html;

			dialog.appendChild(area);
			document.body.appendChild(dialog);

		}else{

			var dialog = document.getElementById('dialog');
			dialog.classList.remove('hidden');
			dialog.innerHTML = '';

			var area = document.createElement('div');
			area.classList.add('dialog-area');
			area.innerHTML = obj.html;

			if(obj.close){
				area.appendChild(c);
			}

			dialog.appendChild(area);

		}

		if(obj.invisible){
			area.classList.add('dialog-invisible');
		}

		Boss.evts.add(Boss.evtTouchUp(), document.getElementById('dialog-close'), function(evts){

			Boss.dialog.close();

			if(obj.callBack && typeof(obj.callBack) === 'function'){
				obj.callBack();
			}
		});
	},
	close: function(){

		if(document.getElementById('dialog')){

			var dialog = document.getElementById('dialog');
			dialog.classList.add('hidden');
			dialog.innerHTML = '';

		}
	}
};
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

	constructor(id){

		this.currentX = 0;
		this.currentY = 0;

		this.lastX = 0;
		this.lastY = 0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.canMove = false;

		this.comp = document.getElementById(id);

		this.move = this.comp.querySelector('.Move');

		this.initMove();

		this.comp.addEventListener('click', () => {
			this.setFocus();
		});
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

		document.addEventListener('mousedown', (evt) => {

			if(evt.target == this.move){

				this._setZIndex(this._getZIndex());

				this.canMove = true;

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

			if(evt.target == this.move){

				this._setZIndex(this._getZIndex());

				this.canMove = true;

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

			this.canMove = false;

			document.removeEventListener('mousemove', this.handleMove);
		});

		document.addEventListener('touchend', (evt) => {

			this.canMove = false;

			document.removeEventListener('touchmove', this.handleMove);
		});
	}

	handleMove = (evt) => {

		if(this.canMove === true){

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

		this.title = t.substring(0, 50);
		this.comp.querySelector('.Move').textContent = this.title;
	}

	setContent(h){

		this.comp.querySelector('.ModalContent').innerHTML = h;
	}

	setFocus(){

		this._setZIndex(this._getZIndex());
	}

	open(){

		this.comp.show();

		this._setZIndex(this._getZIndex());

		this.setCenter();
	}

	close(){

		this.comp.close();

		this.currentX = 0;
		this.currentY = 0;
		this.comp.style.transform = null;
		this.comp.style.zIndex = null;
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
				<div class="Tabs-btns">
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

					dv.classList.remove('inactive');
					dv.classList.add('active');

				}else{

					dv.classList.add('inactive');
					dv.classList.remove('active');
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
				div.classList.add('tooltip');
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
				position = 'bottom';

			}else if(position == 'right'){
				top = (rect.top + (rect.height / 2) - 15).toFixed(0);
				left = (rect.left + rect.width + 15).toFixed(0);
				position = 'right';
			}else if(position == 'left'){
				top = (rect.top + (rect.height / 2) - 15).toFixed(0);
				left = (rect.left - (rect.width * 2) - 15).toFixed(0);
				position = 'left';
			}else{
				var top = (rect.top - tip.clientHeight - 15).toFixed(0);
				position = 'top';
			}

			tip.classList.remove('tooltip-top');
			tip.classList.remove('tooltip-left');
			tip.classList.remove('tooltip-right');
			tip.classList.remove('tooltip-bottom');
			tip.classList.add('tooltip-'+position);

			if(tip.getAttribute('data-apply') == null){

				toolTips[atual] = atual;
				lastTooltip = atual;

				if(left < 5){
					left = 5;
				}

				tip.style.top = top+'px';
				tip.style.left = left+'px';

				tip.setAttribute('data-apply', 'true');
				tip.classList.add('tooltip-active');
			}
		}else{

			lastTooltip = '';
		}

		// hide tooltips
		for(var x in toolTips){

			if(document.getElementById(x) && x != lastTooltip){

				var tt = document.getElementById(x);
				tt.removeAttribute('data-apply');
				tt.classList.remove('tooltip-active');
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
		1: 'Warning-Left-Bottom',
		2: 'Warning-Center-Bottom',
		3: 'Warning-Right-Bottom',
		4: 'Warning-Left-Center',
		6: 'Warning-Right-Center',
		7: 'Warning-Left-Top',
		8: 'Warning-Center-Top',
		9: 'Warning-Right-Top'
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

			color = 'Warning-'+colors[colors.indexOf(color)];

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
					<div class="title">`+title+`</div>
					<div>`+message+`</div>
				</div>
				<div><button class="Warning-close">⨉</button></div>
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
		var removes = warn.querySelectorAll('.Warning-canvas');
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
				warnLine.setAttribute('class', 'Warning-canvas');
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
					<div class="title">`+title+`</div>
					<div>`+message+`</div>
				</div>
				<div><button class="Warning-close">⨉</button></div>`;
		}
	}
};