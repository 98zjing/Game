function Obstacle(){
	this.runways = [$('#runway1'),$('#runway2'),$('#runway3')];
	this.isAdd = true;/*是否继续创建*/
	this.nub = 0;/*创建了多少次*/
	this.index = 0;
	this.maxLeft = P($('#game').css('width')) - 1 * P($('body').css('width'));
	this.maxMs = 2000;/*最迟创建时间*/
}
Obstacle.prototype = {
	/*添加障碍物*/
	add:function(){
		let _span = document.createElement("span");
		let _left = -P($('#game').css('left')) + P($('body').css('width'));
		$(_span).attr('class','obstacle').css('left',_left);
		if(this.nub%2 == 0 ){
			/*按照规律*/
			if(this.index > this.runways.length - 1){this.index = 0}
			var _index = this.index;
			this.index++;
		}else {
			/*随机选取跑道*/
			var _index = P(Math.random() *  this.runways.length);
		}
		this.runways[_index].append(_span);
		this.nub++; 
	},
	openAdd:function(){
		if(!this.isAdd){return;}
		let _left = -P($('#game').css('left')) + P($('body').css('width'));
		if(_left > this.maxLeft){
			/*停止创建*/
			this.isAdd = false;
		}
		let _ms = P(Math.random() * this.maxMs);
		this.add();
		let _setIime = setTimeout( ()=>{
			this.openAdd();
		}, _ms);
	},
	start:function(){
		/*游戏开始跑道清空*/
		for(let val of this.runways){
			val.html("");
		}
		this.isAdd = true;
		this.openAdd();
	}
}