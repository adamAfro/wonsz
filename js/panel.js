function sleep (time) {
	
  return new Promise((resolve) => setTimeout(resolve, time));
}

var Panel = {
	
	menu: document.querySelector("#Menu"),
	wonsz: document.querySelector("#Wonsz"),
	
	buttons: {
		
		restart: document.querySelector("#Menu .button.restart"),
	},
	
	hide: function() {
		
		
	},
	
	toogle: function() {
		
		this.wonsz.classList.toggle("hide");
		this.menu.classList.toggle("hide");
	},
	
	restart: function() {
		
		if (wonsz)
			wonsz.clear();

		wonsz = new Wonsz(document.getElementById("Wonsz"));

		wonsz.start();
	},
	
}

Panel.buttons.restart.addEventListener("click", () => {
	
	Panel.toogle();
	Panel.restart();
	
});