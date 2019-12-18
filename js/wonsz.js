
var Wonsz = class {
	
	constructor(container, {
		width = 44, // imię jego
		height = 44
	} = {}) {
		
		this.street = 1;
		this.unit = "em";
	
		
		this.plansza = document.createElement('div');
		this.plansza.id = "Plansza";
		
		container.appendChild(this.plansza);
		
		this.plansza.style.width = (width * this.street) + this.unit;
		this.plansza.style.height = (height * this.street) + this.unit;
		
		
		this.head = document.createElement('div');
		this.head.classList.add("element");
		this.head.classList.add("head");
		
		this.plansza.appendChild(this.head);
		
		
		this.segments = [];
		
		
		this.food = 0;
		this.dir = null;
		
		this.lost = false;
	}
	
	_isHeadColiding(element) {
		
		let isColiding = (element.style.top == this.head.style.top) && (element.style.left == this.head.style.left);
		
		let isHead = (element === this.head);
		
		return (isColiding && !isHead);
	}
	
	_addElement(top, left) {
		
		let element = document.createElement('div');
		
		element.classList.add("element");
		
		element.style.top = top;
		
		element.style.left = left;
		
		this.plansza.appendChild(element);
		
		return element;
	}
	
	_addSegment({top, left}) {
		
		let segment = this._addElement(top, left);
		
		segment.classList.add("segment");
		
		this.segments.push(segment);
		
		this.food--;
		
		return segment;
	}
	
	_goDown(segment) {
		
		let position = parseFloat(segment.style.top || 0) + this.street;
	
		segment.style.top = position + this.unit;
	
		return {top: segment.style.top, left: segment.style.left};
	}
	
	_goUp(segment) {
		
		let position = parseFloat(segment.style.top || 0) - this.street;
		
		segment.style.top = position + this.unit;
		
		return {top: segment.style.top, left: segment.style.left};
	}
	
	_goLeft(segment) {
		
		let position = parseFloat(segment.style.left || 0) - this.street;
		
		segment.style.left = position + this.unit;
		
		return {top: segment.style.top, left: segment.style.left};
	}
	
	_goRight(segment) {
		
		let position = parseFloat(segment.style.left || 0) + this.street;
		
		segment.style.left = position + this.unit;
		
		return {top: segment.style.top, left: segment.style.left};
	}
	
	_moveHead() {
		
		this.lastHeadPos = {
			
			top: this.head.style.top, 
			left: this.head.style.left
		};
		
		switch (this.dir.toLocaleLowerCase()) {
			
			case "up": this._goUp(this.head);
				break;
				
			case "down": this._goDown(this.head);
				break;
				
			case "left": this._goLeft(this.head);
				break;
				
			case "right": this._goRight(this.head);
				break;
		}
	}
	
	_moveSegments() {
		
		let top, left;
		
		top = this.lastHeadPos.top;
		
		left = this.lastHeadPos.left;
		
		
		let topLast, leftLast;
			
		for (let i = 0; i < this.segments.length; i++) {

			topLast = this.segments[i].style.top;

			leftLast = this.segments[i].style.left;

			this.segments[i].style.top = top;

			this.segments[i].style.left = left;

			top = topLast;

			left = leftLast;

		}

		return {top, left};
	}
	
	_isHeadOutside() {
		
		let isOutside =
			(parseFloat(this.head.style.top || 0) < 0) + 
			(parseFloat(this.head.style.top || 0) >= parseFloat(this.plansza.style.width)) +
			(parseFloat(this.head.style.left || 0) < 0) + 
			(parseFloat(this.head.style.left || 0) >= parseFloat(this.plansza.style.height));
		
		return isOutside;
	}
	
	_colide() {
		
		let obstacles = Array.from(this.plansza.children);
		
		if (obstacles.some((obs) => this._isHeadColiding(obs)))
			return true;	
	}
	
	go() {
		
		this._moveHead();
		
		let lastPos = this._moveSegments();
		
		if (this.food)
			this._addSegment(lastPos);
		
		if (this._colide() || this._isHeadOutside())
			this.lose();
	}
	
	lose() {
		
		this.head.classList.add("dead");
		
		this.lost = true;
	}
	
	tryGo() {
		
		if (this.dir && !this.lost) {
			
			this.go();
			
			return true;
		} else 
			return false;
	}
	
	changeDir(dir) {
		
		dir = dir.toLowerCase();
		
		switch (dir) {
			case "up":  
				if (this.dir != "down")
					this.dir = dir;
				break;
				
			case "down":  
				if (this.dir != "up")
					this.dir = dir;
				break;
				
			case "left":  
				if (this.dir != "right")
					this.dir = dir;
				break;
				
			case "right":  
				if (this.dir != "left")
					this.dir = dir;
				break;
		}
	}
	
	onKey(click) {
	
		let isArrowClicked = (click.code == "ArrowUp") + (click.code == "ArrowDown") + (click.code == "ArrowLeft") + (click.code == "ArrowRight");

		if (isArrowClicked) {

			let dir = click.code.replace("Arrow", "");

			wonsz.changeDir(dir);

		} else if (click.key == "Control") {
			
			wonsz.food++;
		} else {
			
			return false;
		}
		
		return true;
	}
	
	start() {
		
		setInterval(() => this.tryGo(), 100);

		document.body.addEventListener('keydown', click => this.onKey(click));
		
	}
	
	clear() {
		
		this.plansza.remove();
	}
}
