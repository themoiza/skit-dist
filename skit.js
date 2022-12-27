window.Skit = {

	virtualTop: 0,

	setConfig(c){

	},

	hasLoadLockScreen(){

		return SkitConfig.LoadLockScreen.allow ?? false;
	},

	hasPlusAnimations(){
		return true;
	},

	// NUMBER OF MAX WARNINGS TO DISPLAY
	getWaringLimit(){

		return SkitConfig.Warning.max ?? 5;
	}
};

if(typeof(SkitConfig) == 'undefined'){
	Skit.setConfig({});
}

window.startMVC = () => {

	if(SkitConfig.MVC.allow){

		window.mvc = new Mvc();
		mvc.init(SkitConfig.MVC.id);
	}
};

document.addEventListener('DOMContentLoaded', () => {

	startMVC();
	Darkmode.load();
});
window.Confirm = (obj) => {

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
				<button id="Confirm-ok" class="`+obj.okClass+`">`+obj.ok+`</button>
			</div>`;

		if(obj.no !== false){

			mask = `
				<div class="Confirm NoSelect">
					<div class="ConfirmTitle">`+obj.title+`</div>
					`+message+`
				</div>
				<div class="ConfirmActions">
					<button id="Confirm-ok" class="`+obj.okClass+`">`+obj.ok+`</button> <button id="Confirm-no" class="`+obj.noClass+`">`+obj.no+`</button> 
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

				if(obj.bdFn){
					obj.bdFn();
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

		if(document.getElementById('Confirm-no')){

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
	}
};
/**
 * COPY
 * 
 * REQUISITOS
 * - SER O MAIS NATIVO POSSÍVEL
 * - Copiar partes texto em código HTML.
 * - Copiar selecionando por um ID
 * - Copiar uma string
 */

window.Copy = {

	// COPY BY ID ELEMENT
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

	// COPY STRING
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


// LoadLockScreen is allowed, html exists, will be opened
if(document.getElementById('idLoadLockScreen') && Skit.hasLoadLockScreen()){

	var el = document.getElementById('idLoadLockScreen');

	document.addEventListener('DOMContentLoaded', () => {

		document.body.classList.add('NoScroll');

		window.setTimeout(() => {
			el.classList.add('LoadLockScreenIn');
			document.body.classList.remove('NoScroll');
		}, 1000);
	});

	window.addEventListener('unload', (e) => {

		window.requestAnimationFrame(() => {
			el.classList.remove('LoadLockScreenIn');
			el.classList.add('LoadLockScreenOut');
			document.body.classList.add('NoScroll');
		});
	});
}

// LoadLockScreen is not allowed but html exists, will be removed
if(document.getElementById('idLoadLockScreen') && !Skit.hasLoadLockScreen()){

	var el = document.getElementById('idLoadLockScreen');
	el.parentNode.removeChild(el);
}
window.LockScreen = {

	/**
	 * PARAMS
	 * blur: bool, blur body
	 * timeout: integer, mili seconds, not required, default 60000, 60 seconds
	 * spinner: bool
	 */

	title:  `Wait a moment`,
	timeout:  60000,
	blur:  false,
	spinner: '',

	lock: (config) => {

		var spinner = '';

		if(config){

			if(config.timeout){
				LockScreen.timeout = config.timeout;
			}
			if(config.title){
				LockScreen.title = config.title;
			}

			if(config.blur && config.blur === true){
				LockScreen.blur = true;
			}

			if(config.spinner && config.spinner === true){
				LockScreen.spinner = `<span class="LockScreenSpinner"></span>`;
			}
		}

		if(document.getElementById('IdLockScreen')){

			var div = document.getElementById('IdLockScreen');
			div.innerHTML = LockScreen.spinner+LockScreen.title;

		}else{

			var div = document.createElement('dialog');
			div.setAttribute('id', 'IdLockScreen');
			div.innerHTML = LockScreen.spinner+LockScreen.title;
			document.body.appendChild(div);
		}


		if(LockScreen.blur){
			document.body.style.filter = 'blur(3px)';
		}

		document.getElementById('IdLockScreen').showModal();

		if(LockScreen.timeout > -1){

			document.getElementById('IdLockScreen').style = `animation-duration: `+LockScreen.timeout+`ms`;

			Debounce(() => {
				LockScreen.unlock();
			}, LockScreen.timeout, 'IdLockScreen');

		}else{

			document.getElementById('IdLockScreen').style = null;
		}
	},
	unlock: () => {

		document.getElementById('IdLockScreen').close();
		document.body.style.filter = null;
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

		this._centered = false;

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
					<div class="Close"><button data-skit="close"></button></div>
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

		this._centered = true;
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

			if(this._centered === false){
				this.setCenter();
			}

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

		this._centered = false;
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
window.pages = new Object;
window.currentPage = '/';
window.classes = new Object;
window.listenPopEvent = null;
window.popStateScroll = {};
window.appName = SkitConfig.MVC.appName;

class Mvc{

	constructor(){

		this.id;
		this.router = new Router;
		this.pushHistory = new PushHistory;
		this.pushHistory.init(this);

		window.screenId = this._randId();

		document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
	}

	_randId(){

		return Math.random().toString(36).substring(2);
	}

	_scrollToElementByHash(){

		if(window.location.hash && document.getElementById(window.location.hash.replace('#', ''))){

			document.getElementById(window.location.hash.replace('#', '')).scrollIntoView();
		}else{

			document.body.scrollIntoView();
		}
	}

	verifyAuth(){

		return false;
	}

	confirmAuth(){

	}

	responseError(status){

		if(status == 401){

			this.logoffFront();

		}else if(status == 403){

			this.pushHistory.go('/403');

		}

		return false;
	}

	logoffFront(){

	}

	init(id){

		if(document.getElementById(id)){

			this.id = document.getElementById(id);

			var controller = this.router.getController();
			var jsClass = this.router.getRouterController(controller);

			// PLATFORM IS AUTHENTICATED
			if(this.verifyAuth() === true){

				this.loadController();

			// PLATFORM IS NOT AUTHENTICATED
			}else{

				// REDIRECET TO LOGIN
				if(jsClass.middleware === 'auth'){

					window.open('/login', '_self');

				// ALLOW ALL noAuth PAGES
				}else{

					this.loadController();
				}
			}
		}
	}

	getBackTo(backTo){

		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if(params.backTo && params.backTo != ''){

			return params.backTo;

		}else{

			return backTo;
		}
	}

	getUri(){

		const urlSearchParams = new URLSearchParams(window.location.search);
		return urlSearchParams.toString();
	}

	getCurrentPage(){

		const urlSearchParams = new URLSearchParams(window.location.search);
		return window.location.pathname+'?'+urlSearchParams.toString();
	}

	loadPage(controller, loadScript){

		if(typeof(appServices) !== 'undefined'){
			appServices.closeMegaMenu();
			appServices.closeMenu();
		}

		var jsClass = this.router.getRouterController(controller);

		StateLoading.setPercentage(1);

		// LOAD SCRIPT
		if(typeof(window.classes[jsClass.class]) === 'undefined' && typeof(loadScript) === 'undefined' && jsClass.js !== false){

			var spt = document.createElement('script');
			spt.setAttribute('src', jsClass.js+'?temp='+Math.random());
			spt.addEventListener('load', () => {

				this.loadPage(controller, true);
				StateLoading.setPercentage(100);
			});
			document.body.appendChild(spt);

		}else{

			/* CONTROLLER DON'T EXIST */
			if(jsClass.http === 404){

				pages['page404'] = new Page404(this);
				pages['page404'].render(this.id);

			/* CONTROLLER DON'T EXIST */
			}else if(jsClass.http === 403){

				pages['page403'] = new Page403(this);
				pages['page403'].render(this.id);

			/* CONTROLLER DON'T EXIST */
			}else if(jsClass.http === 500){

				pages['page503'] = new Page500(this);
				pages['page503'].render(this.id);

			/* CONTROLLER EXIST BUT JS CLASS CONTROLLER DON'T EXIST */
			}else if(typeof(classes[jsClass.class]) === 'undefined'){

				pages['page500'] = new Page500(this);
				pages['page500'].render(this.id);

			/* CONTROLLER OK */
			}else{

				var dynamicClass = jsClass.class.toLowerCase();
				if(currentPage != dynamicClass){

					pages[dynamicClass] = null;
					pages[dynamicClass] = new classes[jsClass.class](this);
					pages[dynamicClass].render(this.id);

					// REMOVE OBJECT FROM BEFORE CLASS
					pages[currentPage] = null;
				}

				currentPage = dynamicClass;
			}

			this._scrollToElementByHash();

			StateLoading.setPercentage(100);
		}
	}

	loadController(){

		var controller = this.router.getController();
		this.loadPage(controller);
	}

	triggerPopState(){

		if(listenPopEvent !== null && typeof(listenPopEvent.get()) !== 'undefined'){

			listenPopEvent.get();
		}
	}

	addPopListener(obj){

		listenPopEvent = obj;
	}

	updateTitle(t){

		document.title = t+` - `+appName;
		document.querySelector('meta[property="og:title"]').setAttribute('content', t);
	}

	updateDescription(d){

		document.querySelector('meta[name="description"]').setAttribute('content', d);
		document.querySelector('meta[property="og:description"]').setAttribute('content', d);
	}
}

class Page403{

	constructor(app){

		this.app = app;
	}

	page(){

		return `403`;
	}

	render(el){

		var page = this.page();

		el.innerHTML = page;
	}
}

class Page404{

	constructor(app){

		this.app = app;
	}

	page(){

		return `404`;
	}

	render(el){

		var page = this.page();

		el.innerHTML = page;
	}
}

class Page500{

	constructor(app){

		this.app = app;
	}

	page(){

		return `<div class="Flex">
			<div class="ColFlex">
				<h1 class="TxCenter">Error 500</h1>
			</div>
		</div>`;
	}

	render(el){

		var page = this.page();

		el.innerHTML = page;
	}
}

class PushHistory {

	init (app){

		this.app = app;

		history.scrollRestoration = 'manual';

		window.addEventListener('popstate', (e) => {

			var host = window.location.protocol+'//'+window.location.host;
			var controller = window.location.href.replace(host, '');

			this.app.loadController();

			this.app.triggerPopState();

		}, true);

		window.addEventListener('click', (e) => {

			var elemt = e.target;

			var expJs = new RegExp('javascript:', 'i');
			var expFTP = new RegExp('ftp:', 'i');
			var expMail = new RegExp('mailto:', 'i');
			var expWhatsapp = new RegExp('whatsapp:', 'i');

			var domain = window.location.hostname;

			if(elemt.nodeName !== 'BUTTON' && elemt.parentElement !== null && elemt.parentElement.nodeName === 'BUTTON'){
				elemt = elemt.parentElement;
			}

			if(elemt.nodeName === 'BUTTON' && elemt.getAttribute('data-href') && elemt.getAttribute('data-href') !== false && e.button == 0){

				var hrefDomain = elemt.getAttribute('data-href').replace('http://', '');
				hrefDomain = hrefDomain.replace('https://', '');

				var re = new RegExp('^\/', 'i'); 

				if(re.test(hrefDomain) === true){
					hrefDomain = domain+hrefDomain;
				}

				var urlIn = new RegExp('^'+domain, 'i');

				if(urlIn.test(hrefDomain) === true){
					this.go(elemt.getAttribute('data-href'));
				}else{
					var a = document.createElement('a');
					a.href = elemt.getAttribute('data-href');
					EvtTrigger('click', a);
				}
			}else if(e.button == 0){

				var wl = true;

				while(wl === true){

					if(elemt.parentNode !== null && elemt.nodeName !== 'A'){
						elemt = elemt.parentNode;
					}else{
						wl = false;

						if(elemt.href){

							var hrefDomain = elemt.href.replace('http://', '');
							hrefDomain = hrefDomain.replace('https://', '');

							var urlIn = new RegExp('^'+domain, 'i');

							if(urlIn.test(hrefDomain) === true && !elemt.getAttribute('data-href') && !elemt.getAttribute('download') && (!elemt.getAttribute('target') || elemt.getAttribute('target') != '_blank')){

								if(expJs.test(elemt.href) === false || 
									expFTP.test(elemt.href) === false || 
									expMail.test(elemt.href) === false || 
									expWhatsapp.test(elemt.href) === false || 
									!elemt.getAttribute('data-href')){

									if(e.stopPropagation){
										e.stopPropagation();
									}
									if(e.preventDefault){
										e.preventDefault();
									}
									this.go(elemt.href);
								}
							}
						}
					}
				}
			}

		}, true);

		window.addEventListener('beforeunload', (e) => {

			e.cancelBubble = true;

			if(e.stopPropagation){
				e.stopPropagation();
			}

			if(e.preventDefault){
				e.preventDefault();
			}

			return false;

		}, true);
	}

	go (controller){

		var host = window.location.protocol+'//'+window.location.host;
		var ctrlpage = window.location.href.replace(host, '');
		ctrlpage = ctrlpage.replace(/\?.*$/, '');

		popStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

		history.pushState(JSON.stringify({'page': controller}), '', controller);

		this.app.loadController();
	}

	goFront (controller){

		var host = window.location.protocol+'//'+window.location.host;
		var ctrlpage = window.location.href.replace(host, '');
		ctrlpage = ctrlpage.replace(/\?.*$/, '');

		popStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

		history.pushState(JSON.stringify({'page': controller}), '', controller);
	}
}

class Router{

	routersControllers(){

		return SkitConfig.MVC.routes;
	}

	getController(){

		var path = window.location.pathname;
		path = path.split('/');

		var makeCtrl = new Array();
		for(var p = 0; p < path.length; p++){

			if(path[p] != ''){
				makeCtrl.push(path[p]);
			}
		}

		var controller = '/';
		if(makeCtrl.length > 0){
			controller = makeCtrl.join('/');
		}

		return controller;
	}

	getPath(){

		var path = window.location.pathname;
		path = path.split('/');

		var makePath = new Array();
		for(var p = 0; p < path.length; p++){

			if(path[p] != ''){
				makePath.push(path[p]);
			}
		}

		return makePath;
	}

	getRouterController(controller){

		var routers = this.routersControllers();

		var http = 404;
		var jsClass = 'Index';
		var js = '/js/pages/index.js';
		var middleware = 'noAuth';
		
		if(controller == '500'){

			http = 500;
			jsClass = 'Page500';
			js = false;
			middleware = 'noAuth';

		}else if(controller == '403'){

			http = 403;
			jsClass = 'Page403';
			js = false;
			middleware = 'noAuth';

		}else if(routers['noAuth'][controller]){

			http = 200;
			jsClass = routers['noAuth'][controller].split('::')[0];
			js = routers['noAuth'][controller].split('::')[1];
			middleware = 'noAuth';

		}else if(routers['auth'][controller]){

			http = 200;
			jsClass = routers['auth'][controller].split('::')[0];
			js = routers['auth'][controller].split('::')[1];
			middleware = 'auth';
		}

		return {
			'middleware': middleware,
			'http': http,
			'class': jsClass,
			'js': js
		}
	}
}
class Pagination{

	constructor(ids){

		this.currentPage = 1;
		this.byPage = 100;
		this.totalData = 0;
		this.totalPages = Number((this.totalData / this.byPage).toFixed(0));

		this.comp = [];
		this.left = [];
		this.right = [];
		this.all = [];

		this.fn = false;

		ids.forEach((id, i) => {

			if(document.getElementById(id)){

				this.comp[i] = document.getElementById(id);

				if(this.comp[i].querySelector('.PagLeft')){
					this.left[i] = this.comp[i].querySelector('.PagLeft');
				}

				if(this.comp[i].querySelector('.PagAll')){
					this.all[i] = this.comp[i].querySelector('.PagAll');
				}

				if(this.comp[i].querySelector('.PagRight')){
					this.right[i] = this.comp[i].querySelector('.PagRight');
				}
			}

			if(this.left[i]){

				this.left[i].addEventListener('click', (e) => {

					if(e.ctrlKey && e.shiftKey){

						this.previous(1000);

					}else if(e.ctrlKey){

						this.previous(100);

					}else if(e.shiftKey){

						this.previous(10);

					}else{

						this.previous(1);
					}
				});
			}

			if(this.right[i]){

				this.right[i].addEventListener('click', (e) => {

					if(e.ctrlKey && e.shiftKey){

						this.next(1000);

					}else if(e.ctrlKey){

						this.next(100);

					}else if(e.shiftKey){

						this.next(10);

					}else{

						this.next(1);
					}
				});
			}

			if(this.all[i]){

				this.all[i].addEventListener('click', (e) => {

					console.log('all');
				});
			}
		});

		this.setPage(1);
	}

	setCallBack(fn){
		this.fn = fn;
	}

	setPage(p){

		this.all.forEach((all, i) => {

			this.all[i].textContent = this.currentPage+' de '+this.totalPages+', '+this.totalData;
		});

		if(this.fn && typeof(this.fn) === 'function'){

			Debounce(() => {

				let fn = this.fn;
				fn();

			}, 200, 'pagination');
		}
	}

	setByPage(p){

		this.byPage = Number(p);
		this.setPage(this.currentPage);
	}

	setTotal(t){

		this.totalData = Number(t);
		this.totalPages = Number((this.totalData / this.byPage).toFixed(0));

		this.setPage(this.currentPage);
	}

	previous(n){

		if(this.currentPage - n >= 1){
			this.currentPage = Number(this.currentPage) - n;
		}

		this.setPage(this.currentPage);
	}

	next(n){

		if(this.currentPage + n <= this.totalPages){
			this.currentPage = Number(this.currentPage) + n;
		}

		this.setPage(this.currentPage);
	}

	getByPage(){

		return this.byPage;
	}

	getTotal(){

		return this.totalData;
	}

	getPage(){

		return this.currentPage;
	}
}
window.Panic = {

	start(){

		document.body.classList.add('InPanic');

		Skit.virtualTop = 50;

		if(!document.getElementById('InPanic')){

			var p = document.createElement('div');
			p.setAttribute('id', 'InPanic');
			p.setAttribute('class', 'Panic');
			document.body.appendChild(p);
		}else{

			var p = document.getElementById('InPanic');
		}
		p.textContent = 'Estamos trabalhando para resolver os problemas...';
	},
	stop(){

		Skit.virtualTop = 0;

		document.body.classList.remove('InPanic');

		if(document.getElementById('InPanic')){
			var p = document.getElementById('InPanic');
			p.parentNode.removeChild(p);
		}
	}
};
window.StateLoading = {

	setPercentage(p){

		idStateLoading.style.width = p+'vw';

		Debounce(() => {

			if(p < 100){
				idStateLoading.style.height = null;
			}

			if(p == 100){
				idStateLoading.style.height = '0px';
			}

		}, 1500, 'StateLoading');
	}
};
/**
 * SUPER SELECT
 * 
 * REQUISITOS
 * - SER O MAIS NATIVO POSSÍVEL
 * - ABRIR COM EVENTO FOCUS
 * - FECHAR COM EVENTO BLUR
 * - ABRIR E FECHAR COM EVENTO CLICK
 * - ABRIR E FECHAR COM TAB DO TECLADO
 * - BUSCA
 * - BOTÃO PARA LIMPAR BUSCA
 * - SUPORTE DE GRUPOS
 * - AO ABRIR, ROLAR PARA O ITEM SELECIONADO
 * - SUPORTE COMPONENTE DISABLED
 * - SUPORTE A UM ITEM DISABLED
 * - SUPORTE MÚLTIPLAS SELECÕES
 * - FUNÇÕES
 * -- setValue()	sera valor selecionado (seleção única)
 * -- getValue()	retorna valor selecionado (seleção única)
 * -- setValues()	seta valores (modo de multiplas seleções)
 * -- getValues()	retorna os valores selecionados (modo de multiplas seleções)
 * -- addValue()	adiciona 1 valor
 * -- focus()		abre o componente e rola até o campo selecionado
 * -- reset() 		reseta componente para o estado inicial
 */


class Superselect{

	constructor(id, config){

		this.id = id;

		this.lastEvent = 'none';

		this.name = '';

		this.none = 'NONE';

		this.label = 'NONE';

		this.search = true;

		this.searchPlaceholder = 'search';

		this.list = [];

		this.value = '';

		this.active = null;

		if(config && config.list){

			if(config.name){
				this.name = config.name;
			}

			if(config.none){
				this.none = config.none;
			}

			if(config.list){
				this.list = config.list;
			}

			if(typeof(config.search) !== 'undefined' && config.search === false){
				this.search = false;
			}
		}

		this._computedList = this.list;

		if(document.getElementById(id)){

			this.comp = document.getElementById(id);

			this.comp.setAttribute('tabindex', '0');

			this._createLabel();
			this._createComp();

			this.labelComp = this.comp.querySelector('.SuperSelectLabel');
			this.labelComp.textContent = this.none;

			this.sComp = this.comp.querySelector('.SuperSelectComp');

			if(this.search){
				this._createSearch();
			}
			this._createList();

			this.searchComp = this.sComp.querySelector('input');

			this.searchComp.setAttribute('placeholder', this.searchPlaceholder);

			this.listComp = this.comp.querySelector('.SuperSelectList');

			this.labelComp.addEventListener('click', (e) => {

				if(this.lastEvent == 'click'){

					this.comp.blur();
					this.lastEvent = 'blur';
				}

				this.lastEvent = 'click';
				this.active.scrollIntoView();
			});

			this.comp.addEventListener('focus', (e) => {

				this.lastEvent = 'focus';
			});

			this.comp.addEventListener('focusin', (e) => {

				this.lastEvent = 'focusin';
			});

			this.listComp.addEventListener('input', (e) => {

				this.label = e.target.parentElement.querySelector('label').textContent;
				this.labelComp.textContent = this.label;

				this.value = e.target.value;
				this.active = e.target;
			});

			this.listComp.addEventListener('click', (e) => {

				if(e.target.nodeName == 'LABEL'){

					this.blur();
				}
			});

			if(this.search){

				this.searchComp.addEventListener('keyup', (e) => {

					Debounce(() => {

						this._filter(e.target.value);

					}, 500, 'superselect'+this.id);
				});
			}

			this._render();
			this._load();
		}
	}

	_load(){

		var rds = this.listComp.querySelectorAll('input');

		rds.forEach((rd) => {

			if(rd.checked === true){

				this.value = rd.value;
				this.active = rd;
				this.label = rd.parentElement.querySelector('label').textContent;
			}
		});

		this.labelComp.textContent = this.label;
	}

	_filter(f){

		if(f == ''){

			this._computedList = this.list;

		}else{

			var temp = [];

			var exp = new RegExp(f, 'i');

			this.list.forEach((item, key) => {

				if(item.group && item.list){

					var tempGroupList = [];

					item.list.forEach((itemGroup, key) => {

						if(exp.test(itemGroup.label)){
	
							tempGroupList.push(itemGroup);
						}
					});

					if(tempGroupList.length > 0){

						temp.push({
							'group': item.group,
							'list': tempGroupList
						});
					}

				}else{

					if(exp.test(item.label)){

						temp.push(item);
					}
				}
			});

			this._computedList = temp;
		}

		this._render();
	}

	_render(){

		var render = '';

		this._computedList.forEach((item, key) => {

			if(item.group && item.list){

				render += `<div class="SuperSelectGroup">
					<div class="SuperSelectGroupTitle">`+item.group+`</div>`;

				item.list.forEach((itemGroup, key) => {

					var id = this._randId();

					var checked = '';
					if(String(this.value) === String(itemGroup.value)){
						checked = ' checked="checked"';
					}

					var disabled = '';
					if(itemGroup.disabled || item.disabled){
						disabled = ' disabled="disabled"';
					}

					render += `<div class="Option"><input type="radio"`+checked+disabled+` name="`+this.name+`" value="`+itemGroup.value+`" id="`+id+`" /><label for="`+id+`">`+itemGroup.label+`</label></div>`;
				});

				render += `</div>`;

			}else{

				var id = this._randId();

				var checked = '';
				if(String(this.value) === String(item.value)){
					checked = ' checked="checked"';
				}

				var disabled = '';
				if(item.disabled){
					disabled = ' disabled="disabled"';
				}

				render += `<div class="Option">
					<input type="radio"`+checked+disabled+`  name="`+this.name+`" value="`+item.value+`" id="`+id+`" /><label for="`+id+`">`+item.label+`</label>
				</div>`;
			}
		});

		this.listComp.innerHTML = render;
	}

	_createLabel(){

		if(!this.comp.querySelector('.SuperSelectLabel')){

			var label = document.createElement('div');
			label.setAttribute('class', 'SuperSelectLabel');
			label.textContent = this.label;

			this.comp.appendChild(label);
		}
	}

	_createComp(){

		if(!this.comp.querySelector('.SuperSelectComp')){

			var scomp = document.createElement('div');
			scomp.setAttribute('class', 'SuperSelectComp');

			this.comp.appendChild(scomp);
		}
	}

	_createSearch(){

		if(!this.sComp.querySelector('.SuperSelectSearch')){

			var search = document.createElement('div');
			search.setAttribute('class', 'SuperSelectSearch');

			if(!this.sComp.querySelector('input')){

				var inpt = document.createElement('input');
				inpt.setAttribute('type', 'search');
				inpt.setAttribute('placeholder', this.searchPlaceholder);

				search.appendChild(inpt);
			}

			this.sComp.appendChild(search);
		}
	}

	_createList(){

		if(!this.sComp.querySelector('.SuperSelectList')){

			var list = document.createElement('div');
			list.setAttribute('class', 'SuperSelectList');

			var id = this._randId();

			list.innerHTML = '<div class="Option"><input type="radio" name="'+this.name+'" value="" id="'+id+'" /><label for="'+id+'">'+this.none+'</label></div>';

			this.sComp.appendChild(list);
		}
	}

	_randId(){

		return 'opt'+(Math.random()*1000000000).toFixed(0);
	}

	addValue(value, label){
		this.list.push({'value': value, 'label': label});
		this._render();
	}

	getValue(){
		return this.value;
	}

	setValue(v){

		var rds = this.listComp.querySelectorAll('input');

		rds.forEach((rd) => {

			if(String(rd.value) === String(v)){

				rd.checked = true;
				this.value = rd.value;
				this.active = rd;

			}else{

				rd.checked = false;
			}
		});
		this._load();
	}

	setValues(v){
	}

	getValues(){
		return this.value;
	}

	focus(){
		this.comp.focus();
		this.active.scrollIntoView();
	}

	blur(){

		this.comp.focus();
		this.comp.blur();
		this.lastEvent = 'blur';
	}

	reset(){
		
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

			var virtualTop = Skit.virtualTop ?? 0;

			var top = (rect.top - Number(virtualTop) - tip.clientHeight - 15).toFixed(0);
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
	 * timeout: integer, mili seconds, not required, default 10000
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

	if(obj.title && obj.title != ''){

		var title = String(obj.title);
		var message = String(obj.message ?? '');
		var color = String(obj.color ?? '');
		var timeout = obj.timeout ?? 10000;
		var position = obj.position ?? 8;

		// CREATE RANDOM ID
		var id = 'warning'+(Math.random()*1000000).toFixed(0);
		if(obj.id !== false){
			// prevent xss
			id = encodeURIComponent(obj.id);
		}

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
				<div><button class="WarningClose"></button></div>
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
			if(totalCanvas.length < Skit.getWaringLimit()){

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
				<div><button class="WarningClose"></button></div>`;
		}
	}
};