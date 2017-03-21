var nums=new Array();//定义一个新的数组

$(function(){//页面加载时调用函数
	newGame();
});
//开始新游戏
function newGame(){
	//初始化页面
	init();//调用函数
	//在随机的两个格子中产生随机数
	generateNumber();
	generateNumber();
}
//初始化
function init(){  
	//初始化单元格的位置  初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();//定义一个二维数组
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i));//给单元格定位
			gridCell.css("left",getPosLeft(j));
			nums[i][j]=0;//给二维数组设初始化值0
		}
	}
	updateView();
}

//在随机位置上产生一个随机数
function generateNumber(){
	//判断是否还有空间，如果没有
	if(noSpace()){
		return;
	}

	//随机一个位置，思路：把所有空位置取出来存放到数组中，
	//然后在数组中随机选一个
	var temp=new Array();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){//i和j的范围在0-3
				temp.push(i*4+j); //3,1   3*4+1=13
			}
		}
	}
	var pos=Math.floor(Math.random()*(temp.length)); 
	//假如是长度是6   【0，6）  向下取整【0，5】
	var x=Math.floor(temp[pos]/4);  //13/4=3
	var y=Math.floor(temp[pos]%4);	//13%4=1

	//随机一个数字
	var randNumber=Math.random()>0.5?2:4;
	nums[x][y]=randNumber;
	showNumberWithAnimation(x,y,randNumber);
}

//更新视图
function updateView(){
	//将上层的元素清空
	$(".number-cell").remove();

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
			//定义的新的一层添加到上面
			var numberCell=$("#number-cell-"+i+"-"+j);
			if(nums[i][j]!=0){
				numberCell.css("width","100px");
				numberCell.css("height","100px");
				numberCell.css("top",getPosTop(i));
				numberCell.css("left",getPosLeft(j));
				numberCell.css("background-color",getNumberBackgroundColor(nums[i][j]));
				numberCell.css("color",getNumberColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}else{
				numberCell.css("width","0px");
				numberCell.css("height","0px");
				numberCell.css("top",getPosTop(i)+50);
				numberCell.css("left",getPosLeft(j)+50);
			}
		}
	}
}

//实现键盘响应
$(document).keydown(function(event){
	event.preventDefault();//阻止事件的默认动作，否则会出现按上下方向键时滚动条跟着动
	switch(event.keyCode){
		case 37://left
			if(canMoveLeft(nums)){//判断是否可以向左移动
				moveLeft();
				setTimeout(generateNumber,200);
				isGameOver();
			}
				break;
		case 38: //up
			if(canMoveUp(nums)){
				moveUp();
				setTimeout(generateNumber,200);
				isGameOver();
			}
			break;
		case 39: //right
			if(canMoveRight(nums)){
				moveRight();
				setTimeout(generateNumber,200);
				isGameOver();
			}
			break;
		case 40: //down
			if(canMoveDown(nums)){
				moveDown();
				setTimeout(generateNumber,200);
				isGameOver();
			}
			break;
	}
});


//向左移动
//需要对每个数字的左边进行判断，选择落脚点，落脚点有两种情况：
//1.落脚点没有数字，并且移动路径中没有障碍物
//2.落脚点数字和自己相等，并且移动路径中没有障碍物
function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){//从最左边开始遍历左边的所以元素，进行判断
					if(nums[i][k]==0&&noBlockHorizontal(i,k,j,nums)){
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j]&&noBlockHorizontal(i,k,j,nums)){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						break;
					} 
				}
			}
		}
	}
	//更新页面上的16个单元格，将原来的删除，重新添加，此处才是正真的更新显示移动后的结果
	setTimeout(updateView,200); //等待200ms，让移动的动画效果显示完，在更新
}

function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0&&noBlockHorizontal(i,j,k,nums)){
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j]&&noBlockHorizontal(i,j,k,nums)){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}

function moveUp(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j]&&noBlockVertical(j,k,i,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}

function moveDown(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j]&&noBlockVertical(j,i,k,nums)){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						break;

					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}











