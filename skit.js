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
				<div class="Confirm-actions">
					<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button>
				</div>
			</div>`;

		if(obj.no !== false){

			mask = `
				<div class="Confirm no-select">
					<div class="Confirm-title">`+obj.title+`</div>
					`+message+`
					<div class="Confirm-actions">
						<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button> <button id="Confirm-no" class="`+obj.noclass+`">`+obj.no+`</button> 
					</div>
				</div>`;
		}

		if(document.getElementById('Confirm')){
			var div = document.getElementById('Confirm');
			div.innerHTML = mask;
		}else{
			var div = document.createElement('div');
			div.setAttribute('id', 'Confirm');
			div.innerHTML = mask;
			document.body.appendChild(div);
		}

		div.classList.remove('hidden');

		if(document.getElementById('Confirm-ok')){
			document.getElementById('Confirm-ok').focus();
		}

		div.addEventListener('click', (e) => {

			if(div === e.target){

				div.classList.add('hidden');

				if(obj.cancelFn){
					obj.cancelFn();
				}
			}
		});

		document.getElementById('Confirm-ok').addEventListener('click', (e) => {

			div.classList.add('hidden');

			if(obj.okFn){
				obj.okFn();
			}
		});

		document.getElementById('Confirm-ok').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){

				div.classList.add('hidden');

				if(obj.okFn){
					obj.okFn();
				}
			}
		});

		document.getElementById('Confirm-no').addEventListener('click', (e) => {

			div.classList.add('hidden');

			if(obj.noFn){
				obj.noFn();
			}
		});

		document.getElementById('Confirm-no').addEventListener('keyup', (e) => {

			if(e.keyCode == 13){
				div.classList.add('hidden');
				obj.noFn();
			}
		});
	}
};


window.Copy = (id) => {

	var el = document.getElementById(id);

	if(el){

		var tx = document.createElement('textarea');
		tx.textContent = el.textContent.replace(/\s+$/, '').replace(/^\s+/, '');
		tx.focus();
		tx.classList.add('hidden');
		tx.style.width = '1px';
		tx.style.height = '1px';
		el.appendChild(tx);
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

		if(!document.getElementById('boss-dialog')){
			var dialog = document.createElement('div');
			dialog.setAttribute('id', 'boss-dialog');

			var area = document.createElement('div');
			area.classList.add('boss-dialog-area');
			area.innerHTML = obj.html;

			dialog.appendChild(area);
			document.body.appendChild(dialog);

		}else{

			var dialog = document.getElementById('boss-dialog');
			dialog.classList.remove('hidden');
			dialog.innerHTML = '';

			var area = document.createElement('div');
			area.classList.add('boss-dialog-area');
			area.innerHTML = obj.html;

			if(obj.close){
				area.appendChild(c);
			}

			dialog.appendChild(area);

		}

		if(obj.invisible){
			area.classList.add('boss-dialog-invisible');
		}

		Boss.evts.add(Boss.evtTouchUp(), document.getElementById('boss-dialog-close'), function(evts){

			Boss.dialog.close();

			if(obj.callBack && typeof(obj.callBack) === 'function'){
				obj.callBack();
			}
		});
	},
	close: function(){

		if(document.getElementById('boss-dialog')){

			var dialog = document.getElementById('boss-dialog');
			dialog.classList.add('hidden');
			dialog.innerHTML = '';

		}
	}
};

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
				<div class="sk-tabs-btns">
					<div v-for="(t, i) in tabs" :class="t.active"><button @click="setTab(i)">{{t.tab}}</button></div>
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

			var vW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			var atual = e.target.getAttribute('data-title-for');

			var tip = document.getElementById(atual);

			var rect = e.target.getBoundingClientRect();

			var position = e.target.getAttribute('data-title-position') ?? 'top';

			var top = (rect.top - tip.clientHeight - 10).toFixed(0);
			var left = (rect.left+(rect.width / 2)-(tip.clientWidth / 2)).toFixed(0);

			if(top < 5 || position == 'bottom'){
				top = (rect.top + rect.height + 10).toFixed(0);
				position = 'bottom';

			}else if(position == 'right'){
				top = (rect.top + (rect.height / 2) - 10).toFixed(0);
				left = (rect.left + rect.width + 10).toFixed(0);
				position = 'right';
			}else if(position == 'left'){
				top = (rect.top + (rect.height / 2) - 10).toFixed(0);
				left = (rect.left - (rect.width * 2) - 10).toFixed(0);
				position = 'left';
			}else{
				var top = (rect.top - tip.clientHeight - 10).toFixed(0);
				position = 'top';
			}

			/*var colisionRight = (rect.left+(rect.width / 2) + tip.clientWidth).toFixed(0);
			if(colisionRight > vW){
				left = (vW - 40 - tip.clientWidth).toFixed(0);
			}*/

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
window.Warning = {

	show: function(obj){

		if(obj.title){

			var color = '';
			if(obj.color){

				if(obj.color == 'danger'){
					color = 'Warning-danger';
				}

				if(obj.color == 'pri'){
					color = 'Warning-pri';
				}

				if(obj.color == 'sec'){
					color = 'Warning-sec';
				}

				if(obj.color == 'dark'){
					color = 'Warning-dark';
				}

				if(obj.color == 'light'){
					color = 'Warning-light';
				}
			}

			var warn;
			var warningDelay = 8000;
			var id = 'warning';

			if(obj.timeout){
				warningDelay = obj.timeout;
			}

			var mask = `<div style="animation-duration: `+warningDelay+`ms" class="Warning `+color+`" data-id="{{id}}">
					<div>
						<div class="title">`+obj.title+`</div>
						<div>`+obj.message+`</div>
					</div>
					<div><button class="Warning-close">⨉</button></div>
				</div>`;

			if(obj.id){
				id = obj.id.replace('"', '');
			}

			mask = mask.split('{{id}}').join(id);

			if(document.getElementById('Warning')){

				warn = document.getElementById('Warning');

			}else{

				warn = document.createElement('div');
				warn.setAttribute('id', 'Warning');
				document.body.appendChild(warn);

				warn.addEventListener('click', (e) => {

					var el = e.target;
					if(e.target.nodeName == 'I'){
						el = el.parentElement;
					}

					if(el.nodeName == 'BUTTON'){

						var warnline = el.parentElement.parentElement;

						var parent = warnline.parentElement;
						parent.removeChild(warnline);
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

			var warnline = warn.querySelector('div[data-id="'+id+'"]');

			var tcanvas = warn.querySelectorAll('div[data-id]');

			if(!warnline){

				// LIMIT OF WARNS
				if(tcanvas.length < 5){

					var warnline = document.createElement('div');
					warnline.setAttribute('class', 'Warning-canvas');
					warnline.innerHTML = mask;

					warn.appendChild(warnline);

					Debounce(() => {

						if(typeof(warnline) !== 'undefined' && typeof(warnline.parentElement) !== 'undefined'){

							try{

								warnline.parentElement.removeChild(warnline);
							}catch{

							}
						}
					}, warningDelay, id);
				}

			/* UPDATE WARNING */
			}else if(warnline){

				warnline.setAttribute('class', `Warning `+color);

				warnline.innerHTML = `
					<div>
						<div class="title">`+obj.title+`</div>
						<div>`+obj.message+`</div>
					</div>
					<div><button class="Warning-close">⨉</button></div>`;
			}
		}
	}
};