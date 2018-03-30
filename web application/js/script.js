let runnerConfig = {
		runnerDom:$('#runner'),
		runnerImg:$('#runner>img'),
		runnerImgSrc:'./imgs/running2_Flamme.png',
		runnerStyle:[
						{height:104,width:100,bottom:60},
						{height:83,width:80,bottom:100},
						{height:62,width:60,bottom:120}
					],
		runnerStyleIdex:0,/*运动员采用的样式索引*/
		runnerAction:true,/*运动员是否执行动作*/
		returnDist:1,/*运动员跳跃时的高度*/
		returnMs:0.3,/*运动员跳跃消费的时间*/
		returnKeyDown:true,/*开启跳跃*/
		returSwitch:true,/*开启跑到切换*/
		returSpeedBottom:null,
		returWitch:true,/*开启监听*/
		//
		returDist:78,/*每次动作切换运动员跑的距离*/
		returDistMs:10,/*运动员跑的总时间*/
		returMaxDist:5100/*运动员跑的总距离*/,
		returClimbing:4700/*运动员上坡*/

}
const START_BTN = $('#startButton');/*开始游戏按钮*/
const START = $('#start');
const RUNWAYS = [$('#runway3'),$('#runway2'),$('#runway1')];/*所有的跑道*/
const OBSTACLE = new Obstacle();
const panels = [
				{Panel:$('#amazonPanel'),point:$('#amazon')},
				{Panel:$('#bahiaPanel'),point:$('#bahia')},
				{Panel:$('#paranaPanel'),point:$('#parana')},
				{Panel:$('#saopauloPanel'),point:$('#saopaulo')},
				{Panel:$('#rioPanel'),point:$('#rio')},
			];
let ANIMATES = ['scale','show','drop','blind','clip'];
START_BTN.on("click",function(){
	startGame();/*调用开始游戏函数*/
	START.hide();
	OBSTACLE.start();
	return false;
});

/*新游戏开始数据初始化*/
function news(){
	runnerConfig = {
		runnerDom:$('#runner'),
		runnerImg:$('#runner>img'),
		runnerImgSrc:'./imgs/running2_Flamme.png',
		runnerStyle:[
						{height:104,width:100,bottom:60},
						{height:83,width:80,bottom:100},
						{height:62,width:60,bottom:120}
					],
		runnerStyleIdex:0,/*运动员采用的样式索引*/
		runnerAction:true,/*运动员是否执行动作*/
		returnDist:1,/*运动员跳跃时的高度*/
		returnMs:0.3,/*运动员跳跃消费的时间*/
		returnKeyDown:true,/*开启跳跃*/
		returSwitch:true,/*开启跑到切换*/
		returSpeedBottom:null,
		returWitch:true,/*开启监听*/
		//
		returDist:78,/*每次动作切换运动员跑的距离*/
		returDistMs:10,/*运动员跑的总时间*/
		returMaxDist:5100/*运动员跑的总距离*/,
		returClimbing:4700/*运动员上坡*/
	}
}
function hide(){
	ANIMATES = ['fold','shake','drop','pulsate','clip'];
	for(let val of panels){
		val.Panel.hide();
		val.point.hide();
	}
}
/**/
function show(index){
	let _index = index || 0;
	let _runnerLeft = P($('#runner').css('left'));
	let _left = P(panels[0].point.css('margin-left'));
	for(var i = 0;i<_index;i++){
		_left += P(panels[i].point.css('width'));
	}
	_left +=  P(panels[_index].point.css('width'))/2;
	if(_runnerLeft > _left){
		let __index = P(Math.random() * ANIMATES.length);
		panels[_index].point.toggle(ANIMATES[__index]);
		panels[_index].Panel.toggle(ANIMATES[__index]);
		ANIMATES.splice(__index,1);
		console.log(__index,ANIMATES);
		_index++;
	}
	if(_index >= 5)return;
	let _setTimer = setTimeout(function(){
		clearTimeout(_setTimer);
		show(_index);
	},100);
}
/*游戏开始*/
function startGame(){
	hide();
	show();
	news();/*初始化*/
	open();/*背景与运动员的移动*/
	openKeyDown()/*开启键盘事件*/;
	runnerStyle();/*运动员获取样式*/
	runnerAction(0);/*运动员跑步动作*/
	openWitch();/*监听*/
}
/*背景与运动员的移动*/
function open(){
	let _max = P($('#game').css('width')) - P($('body').css('width'));
	$('#game').css('left','0px').animate({left:-_max},13500,'linear');
	$('#runner').css('left','0px').animate({left:_max},13500,'linear',function(){
		let _speed = P($('body').css('width')) - 880 + _max;
		$('#runner').animate({left:_speed},2000,'linear',function(){
			/*爬坡*/
			runnerClimbing();
			$(document).off("keydown");
		});
	});
}
/*碰撞监听*/
function openWitch(){
	if(!runnerConfig.returWitch){return;}
	let _doms = RUNWAYS[runnerConfig.runnerStyleIdex].children();
	for(var i=0;i<_doms.length;i++){
		let val = _doms[i];
		let _valLeft = P($(val).css('left'));
		let _valLeftWidth = P($(val).css('left')) + P($(val).css('width'));
		let _runnerLeftWidth = P($('#runner').css('left'))  + P($('#runner').css('width')) - P($('#runner').css('width'))/3;
		let _runnerLeft = P($('#runner').css('left')) + P($('#runner').css('width'))/3;
		if(_runnerLeftWidth >= _valLeft && _runnerLeft <= _valLeftWidth){
			let _btm = P($('#runner').css('bottom')) - P($('#runner').attr('btm')) +  P($('#runner').css('height'))/3;
			let _valHeight = P($(val).css('height'));
			if( _btm <= _valHeight){
				delAll();
				alert('死亡！');
				runnerConfig.returWitch = false;
				return;
			}
		}
	}
	let _setTimer = setTimeout(function(){
		clearTimeout(_setTimer);
		openWitch();
	}, 20);
}
/*游戏死亡*/
function gmove(){
	delAll();
}
/*停止所有定时器*/
function delAll(){
	$(document).off("keydown");
	$('#game').stop();
	$('#runner').stop();
	let _timer = setInterval(function(){},0);
	for(let i=0;i<_timer;i++){
		clearTimeout(i);
		clearInterval(i);
	}
	START.show();
}
/*开键盘事件*/
function openKeyDown(){
	$(document).on('keydown',function(e){
		let _e = e || window.event;
		let _key = _e.keyCode;
		if(_key == 38){
			/*上*/
			if(!runnerConfig.returSwitch){return;}
			runnerConfig.runnerStyleIdex++;
			runnerStyle();
		}
		if(_key == 40){
			/*下*/
			if(!runnerConfig.returSwitch){return;}
			runnerConfig.runnerStyleIdex--;
			runnerStyle();
		}
		if(_key == 32){
			runnerJump();
		}
	});
}
/**/
function runnerStyle(w){
	if(!runnerConfig.returSwitch){return;}
	if(runnerConfig.runnerStyleIdex > runnerConfig.runnerStyle.length -1){
		runnerConfig.runnerStyleIdex = runnerConfig.runnerStyle.length -1;
	}
	if(runnerConfig.runnerStyleIdex < 0){
		runnerConfig.runnerStyleIdex = 0;
	}
	runnerConfig.returnKeyDown = false;
	runnerConfig.runnerDom.attr('btm',runnerConfig.runnerStyle[runnerConfig.runnerStyleIdex].bottom).
							css('width',runnerConfig.runnerStyle[runnerConfig.runnerStyleIdex].width).
							css('height',runnerConfig.runnerStyle[runnerConfig.runnerStyleIdex].height).
							css('bottom',runnerConfig.runnerStyle[runnerConfig.runnerStyleIdex].bottom);
	runnerConfig.returnKeyDown = true;
	runnerConfig.returSwitch = true;
}

/*运动员跑步动作切换*/
function runnerAction(l){
	if(!runnerConfig.runnerAction){return;}
	let _left = P(runnerConfig.runnerDom.css('left'));
	if(l>3){l=1}
	let _marginLeft = P(runnerConfig.runnerDom.css('width')) * l;
	runnerConfig.runnerImg.attr('src',runnerConfig.runnerImgSrc).css('margin-left',-_marginLeft);
	let _timer = setTimeout(function(){
		runnerAction(l+1);
		clearTimeout(_timer);
	}, 160)
}
/*跳跃*/
function runnerJump(){
	if(!runnerConfig.returnKeyDown) return;
	runnerConfig.runnerAction = false;
	runnerConfig.returSwitch = false;
	runnerConfig.returnKeyDown = false;
	let _startBtm = P(runnerConfig.runnerDom.css('bottom'));
	let _btm = P(runnerConfig.runnerDom.css('bottom')) + P(runnerConfig.runnerDom.css('height')) * runnerConfig.returnDist;
	let _speed = P(runnerConfig.runnerDom.css('height')) / runnerConfig.returnDist / runnerConfig.returnMs / 60;
	let _timer = setInterval(function(){
		let __btm = P(runnerConfig.runnerDom.css('bottom'));
		if(__btm > _btm){
			_speed *= -1;
		}
		if(__btm < _startBtm){
			runnerConfig.runnerDom.css('bottom',_startBtm);
			runnerConfig.runnerAction = true;
			runnerConfig.returSwitch = true;
			runnerConfig.returnKeyDown = true;
			clearInterval(_timer);
			runnerAction(0);
			return;
		}
		runnerConfig.runnerDom.css('bottom',__btm + _speed);
	}, 16);
}
/*爬坡*/
function runnerClimbing(){
	let _x = 1;
	let _startLeft = P($('#runner').css('left'));
	let _startBottom = P($('#runner').css('bottom'));
	let _timer = setInterval(function(){
		if(_x > 200){
			if(_x > 400){
				clearInterval(_timer);
				delAll();
				alert('你赢了！');
				return;
			}
			$('#runner').css('left',_startLeft + _x);
		}else{
			/*
				先算出对应的幅度数
				再计算对应的sin的值 就成一个弧线在调整其他的值来调整弧线的弧度
			*/
			let _y = 45 * Math.sin((Math.PI * _x/360)) + _x * 0.45;
			$('#runner').css('left',_startLeft + _x).css('bottom',_startBottom + _y);
		}
		_x += 4;
	}, 10);
}