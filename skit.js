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
						<button id="Confirm-ok" class="`+obj.okclass+`">`+obj.ok+`</button><button id="Confirm-no" class="`+obj.noclass+`">`+obj.no+`</button> 
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