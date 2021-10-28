var GLOBAL={
  area_map_flag:false,
  num2dim:["x","y","z"],
  drag:{mousedown:false},
  opacity:0.9,
	iiarr:[90,107,90],
	fiber:{
		rotate:1,id:28,angle:0,mouse:{
			down:false,startloc:{x:-1,y:-1},startangle:-1
		}
	},
	treedata:{},
	regionCount:246,
	FC_chart:null,
	SC_chart:null,
	// fibtimer:window.setInterval(function(){
	// 	GLOBAL.fiber.angle=(GLOBAL.fiber.angle+10)%360;Update();
	// },500)
};
// var FC_chart = null;
// var SC_chart = null;
// var iiarr=[90,107,90];
window.addEventListener("load",function()
{
	GLOBAL.FC_chart = echarts.init(
        document.getElementById('container-fun'), 'white', {renderer: 'canvas1'});
	GLOBAL.SC_chart = echarts.init(
        document.getElementById('container-den'), 'white', {renderer: 'canvas2'});
	loadLabelMaps();
	// loadBarCharts();
	loadTreeViewData();

  
  $("#toggle-area-map").on("click",ToggleAreaMapHandler);
  $("#toggle-fiber").on("click",ToggleFiberHandler);
  $("#recoverOpacity").on("click",function(){
	var maters	=	document.getElementsByTagName('Material'); 
	var length = maters.length;
	for(var j = 0;j<length;j++){
			maters[j].setAttribute('transparency',0);
		};
	});
  $("#lessOpacity").on("click",function(){
			GLOBAL.opacity=Math.min(0.95,Math.max(0,GLOBAL.opacity-0.1));Update();
	});
  $("#moreOpacity").on("click",function(){
			GLOBAL.opacity=Math.min(0.95,Math.max(0,GLOBAL.opacity+0.1));Update();
	});
  
	$("#status").html("status: "+(GLOBAL.area_map_flag?"on":"off"));
	
	// String.prototype.padLeft = function (length, character) { 
 //    return new Array(length - this.length + 1).join(character || '0') + this; 
	// }

  function loadLabelMaps()
	{
		$.ajax("js/bnatlasviewer/labelmaps_new.txt").done(function(responseText){
			$("#map-container").html(responseText);

			$.ajax("images/imglist.txt").done(function(responseText2){
				$("#imglist").html(responseText2);
				// initializeFiber('fib');
				// initializeFiber('fun');
				$('#plugins4').jstree('select_node','1');
			});

			Update();
			// document.getElementById("display-splash").style.display='none';
		});
	}

	function loadTreeViewData(){
		var $treeview = $('#plugins4');
		// you should delete the 2nd subregion of the insula cortex and it makes self-reference.
		$treeview.jstree({
			'core' : {
				'data' : {
					"url" : "js/bnatlasviewer/mcqatlas_tree_new.json",//mcqatlas_tree.json
					"dataType" : "json" // needed only if you do not supply JSON headers
				}
			},
			"types" : {
				"file" : {"icon" : "jstree-default jstree-file"}
			},
			"plugins" : [ "search","types" ]
		}).on("select_node.jstree", function (e, data) { 
			var title = data.node.text;
			var id = data.node.id;
			// if (typeof GLOBAL_title2center[title] === 'undefined'){
			// 	console.error("typeof GLOBAL_title2center[title] === 'undefined'");return;
			// }
			//centeringAreasByTitle(title);
			Update();
			// highlightAreasByTitle(title);
			document.getElementById("log").innerHTML=data.node.text+','+data.node.id;
			if (data.node.data != undefined){
				select_material(id);
				select_fiber(id);
				document.getElementById("log2").innerHTML=data.node.data['full_name'];
				document.getElementById("log_area").innerHTML='MassCenter(RAS)\:<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + data.node.data['MassCenter(RAS)'];
			}
			else {
				document.getElementById("log_area").innerHTML='';
				document.getElementById("log").innerHTML='';}
			// console.log(data);console.log(e);
		}).on('loaded.jstree', function() {
			// $treeview.jstree('open_node','Frontal Lobe');
			// $treeview.jstree('open_node','SFG, Superior Frontal Gyrus');
		});// .on('model.jstree',function(e,nodes){
		// 	GLOBAL.treedata = nodes;
		// 	console.log(e);
		// 	console.log(nodes);
		// });
		$.jstree.reference('#plugins4').select_node("Frontal Lobe");
		
		var to = false;
		$('#plugins4_q').keyup(function () {
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
				var v = $('#plugins4_q').val();
				$('#plugins4').jstree(true).search(v);
			}, 250);
		});
		
	}

	function ToggleFiberHandler(e){
	var maters	=	document.getElementsByTagName('Material'); 
	var length = maters.length;
	var count = 0;
	var index = 0;
	for(var j = 0;j<length;j++){
		if(maters[j].getAttribute('transparency') == '0.0' || maters[j].getAttribute('transparency') == 0)
			{count ++;
			index = j+1;}
		};
	if(count == 1) select_fiber(String(index));
	}

	function initializeFiber(fibstr){
		var canvas=document.getElementById('display-'+fibstr);
		canvas.addEventListener('mousedown',fibMouse_down,false);
		canvas.addEventListener('mousemove',fibMouse_move,false);
		canvas.addEventListener('mouseup',  fibMouse_up,false);
		canvas.addEventListener('mouseout', fibMouse_up,false);
		canvas.addEventListener('mouseover',fibMouse_over,false);

		function fibMouse_down(e){
			var canvas=e.target;
			var offsetX=canvas.parentNode.offsetLeft;
			var posX=e.pageX-offsetX;
			GLOBAL.fiber.mouse.down=1;
			GLOBAL.fiber.mouse.startloc.x=posX;
			GLOBAL.fiber.mouse.startangle=GLOBAL.fiber.angle;
			fibMouse_move(e);
		}
		function fibMouse_move(e){
			var canvas=e.target;
			var offsetX=canvas.parentNode.offsetLeft;
			var posX=e.pageX-offsetX;
			if ((GLOBAL.fiber.mouse.down)&&
					(GLOBAL.fiber.mouse.startloc.x>0)&&
					(GLOBAL.fiber.mouse.startangle>=0))
			{
				GLOBAL.fiber.angle=
					((posX-GLOBAL.fiber.mouse.startloc.x)+GLOBAL.fiber.mouse.startangle+720)%360;
				document.getElementById("label").innerHTML=
					'dragging:'+GLOBAL.fiber.mouse.startangle+'->'+GLOBAL.fiber.angle;
			}else{
				fibMouse_up(e);
			}
			Update();
		}
		function fibMouse_up(e){
			GLOBAL.fiber.mouse.down=0;
			GLOBAL.fiber.mouse.startloc.x=-1;
			GLOBAL.fiber.mouse.startangle=-1;
		}
		function fibMouse_over(e){
			//clearInterval(GLOBAL.fibtimer);
		}
	}

  // -------------------------------------------------------
  // handle mouse wheel events
  // -------------------------------------------------------
  function handler(canvasid)
  {
  	var idcode=canvasid[canvasid.length-1];
  	var idx=((idcode=="x")?0:((idcode=="y")?1:2));
		var ii=GLOBAL.iiarr[idx];
		var canvas=document.getElementById(canvasid);
		var img=document.getElementById(canvas.id+"-img");
		var phony=document.getElementById(canvas.id+"-img-phony");

		canvas.width =parseFloat(canvas.parentNode.style.width );
		canvas.height=parseFloat(canvas.parentNode.style.height);
		var maxii=181*217/Math.max(canvas.width,canvas.height);
		GLOBAL.iiarr[idx]=Math.min(maxii,Math.max(0,ii));
		DrawImage(canvas,img,idx);

		var phonyid="map-"+idx+"-"+GLOBAL.iiarr[idx];
		phony.useMap="#"+phonyid;
		var areas=document.getElementById(phony.useMap.substr(1)).childNodes;
		for (var areaiter=0; areaiter < areas.length; areaiter++){
			areas[areaiter].addEventListener("click",MouseClickAreaHandler,false);
			areas[areaiter].addEventListener("mouseover",MouseOverAreaHandler,false);
			// areas[areaiter].addEventListener("mouseout", MouseOutAreaHandler ,false);
		}
		
		phony.addEventListener("mousedown",     MouseDraggingHandler_start,false);
		phony.addEventListener("mousemove",     MouseDraggingHandler_move ,false);
		phony.addEventListener("mouseup",       MouseDraggingHandler_stop ,false);

		phony.addEventListener("mousewheel",    MouseWheelHandler,false);
		phony.addEventListener("DOMMouseScroll",MouseWheelHandler,false);

		function MouseWheelHandler(e){
  	  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			var ii=GLOBAL.iiarr[idx];
  	  if (delta>0){ii+=1;}else{ii-=1;}
			GLOBAL.iiarr[idx]=Math.min(maxii,Math.max(0,ii));
			Update();

			if (GLOBAL.area_map_flag){
				var phonyid="map-"+idx+"-"+GLOBAL.iiarr[idx];
				phony.useMap="#"+phonyid;
				
				var areas=document.getElementById(phony.useMap.substr(1)).childNodes;
				for (var areaiter=0; areaiter < areas.length; areaiter++){
					areas[areaiter].addEventListener("mouseover",MouseOverAreaHandler,false);
					areas[areaiter].addEventListener("click",MouseClickAreaHandler,false);
					// areas[areaiter].addEventListener("mouseout", MouseOutAreaHandler ,false);
				}
			}
		} // function MouseWheelHandler
  }

  function MouseOverAreaHandler(e)
  {
  	// var title=e.target.title;
		// viewFiberByTitle(title);

		// DrawFiber('fib');
		// DrawFiber('den');
		// DrawFiber('fun');
  	// document.getElementById("label").innerHTML=title;
		// DrawBehaviorBar(title);
		// highlightAreasByTitle(title);
  }

  function MouseClickAreaHandler(e)
  {
		MouseOutAreaHandler(e);
		
  	var title=e.target.title;
		// viewFiberByTitle(title);
		// // DrawFiber('fib');
		// DrawFiber('den');
		// DrawFiber('fun');
		// DrawBehaviorBar(title,'BDf_FDR05');
		// DrawBehaviorBar(title,'PCf_FDR05');
		// highlightAreasByTitle(title);

		var idx=GLOBAL_title2ind[title];
		console.log(idx+1);
		var $treeview = $('#plugins4');
		$treeview.jstree('close_all');
		$treeview.jstree('deselect_all');
		$treeview.jstree('select_node',idx+1);
  }

  function MouseOutAreaHandler(e)
  {
  	var title=e.target.title;
  	var mapnodelist=document.getElementsByTagName("map");
		var targetmapid=["map-0-"+GLOBAL.iiarr[0],"map-1-"+GLOBAL.iiarr[1],"map-2-"+GLOBAL.iiarr[2]];
		for (var i=0;i<mapnodelist.length;i++)
		{
			if ((mapnodelist[i].id==targetmapid[0])||
					(mapnodelist[i].id==targetmapid[1])||
					(mapnodelist[i].id==targetmapid[2]))
			{
				var idx=mapnodelist[i].id.substr(4,1);
				var canvas=document.getElementById("display-"+GLOBAL.num2dim[idx]);
				var img=document.getElementById(canvas.id+"-img");
				DrawImage(canvas,img,idx);
			}
		}
		
		// document.getElementById("label").innerHTML="";
  }

  function MouseDraggingHandler_start(e)
  {
		var img=e.target;
		img.ondragstart=function(){return false;};
		var canvas=img.parentNode;
		var offsetX=canvas.offsetLeft;
		var offsetY=canvas.offsetTop;
		if (GLOBAL.area_map_flag){
			//document.getElementById("label").innerHTML="";
			return;
		}else{
			GLOBAL.drag.mousedown=true;
		}
		MouseDraggingHandler_move(e);
  }

  function MouseDraggingHandler_move(e)
  {
		var vlist=new Array;vlist[0]=[1,2];vlist[1]=[0,2];vlist[2]=[0,1];
		var img=e.target;
		var canvas=img.parentNode;
		var offsetX=parseInt(canvas.getBoundingClientRect().left);//canvas.offsetLeft;
		var offsetY=parseInt(canvas.getBoundingClientRect().top);//canvas.offsetTop;
		if (GLOBAL.area_map_flag){
			// document.getElementById("label").innerHTML="";
			return;
		}else{
			if (GLOBAL.drag.mousedown){
				// var posX=e.pageX-offsetX;
				// var posY=e.pageY-offsetY;
				var posX=parseInt(e.clientX-offsetX);
				var posY=parseInt(e.clientY-offsetY);
				document.getElementById("label").innerHTML="start:"+posX+","+posY;
				var idx=img.id.substr(8,1)=="x"?0:(img.id.substr(8,1)=="y"?1:2);
				var v=vlist[idx];
				switch(idx){
				case 0:{GLOBAL.iiarr[v[0]]=posX;GLOBAL.iiarr[v[1]]=posY;break;}
				case 1:{GLOBAL.iiarr[v[0]]=posX;GLOBAL.iiarr[v[1]]=posY;break;}
				case 2:{GLOBAL.iiarr[v[0]]=posX;GLOBAL.iiarr[v[1]]=217-posY;break;}
				}
				Update();
			}else{
				// document.getElementById("label").innerHTML="";
			}
		}
  }

  function MouseDraggingHandler_stop(e)
  {
		if (GLOBAL.area_map_flag){document.getElementById("label").innerHTML="";return;}
		else{
			GLOBAL.drag.mousedown=false;
			// document.getElementById("label").innerHTML="";
		}
  }

  function ToggleAreaMapHandler(e)
  {
		GLOBAL.area_map_flag = (!GLOBAL.area_map_flag);
		document.getElementById("status").innerHTML="status: "+(GLOBAL.area_map_flag?"on":"off");
		if (!GLOBAL.area_map_flag){
			for (var idx=0;idx<3;idx++){
				var canvas=document.getElementById("display-"+GLOBAL.num2dim[idx]);
				var phony=document.getElementById(canvas.id+"-img-phony");
				var areas=document.getElementById(phony.useMap.substr(1)).childNodes;
				for (var areaiter=0; areaiter < areas.length; areaiter++){
					areas[areaiter].addEventListener("click",MouseClickAreaHandler,false);
					areas[areaiter].removeEventListener("mouseover",MouseOverAreaHandler,false);
					// areas[areaiter].removeEventListener("mouseout", MouseOutAreaHandler ,false);
				}
				phony.useMap="";
			} // for loop
		}else{
			for (var idx=0;idx<3;idx++){
				var canvas=document.getElementById("display-"+GLOBAL.num2dim[idx]);
				var phony=document.getElementById(canvas.id+"-img-phony");
				phony.useMap="#map-"+idx+"-"+GLOBAL.iiarr[idx];
				var areas=document.getElementById(phony.useMap.substr(1)).childNodes;
				for (var areaiter=0; areaiter < areas.length; areaiter++){
					areas[areaiter].addEventListener("click",MouseClickAreaHandler,false);
					areas[areaiter].addEventListener("mouseover",MouseOverAreaHandler,false);
					// areas[areaiter].addEventListener("mouseout", MouseOutAreaHandler ,false);
				}
			} // for loop
		}
  }
});

function centeringAreasByTitle(title)
{
	// var idx=GLOBAL_title2ind[title];
	// document.getElementById('log').innerHTML='centering: '+idx;
	// for (var i=0;i<3;i++){GLOBAL.iiarr[i]=GLOBAL_gv_center[idx*3+i];}
	// var idx=GLOBAL_title2ind[title];
	// document.getElementById('log').innerHTML='centering: '+idx;
	for (var i=0;i<3;i++){GLOBAL.iiarr[i]=GLOBAL_title2center[title][i];}
}

function viewFiberByTitle(title)
{
	var ind=GLOBAL_title2ind[title];
	GLOBAL.fiber.id=ind+1;
	document.getElementById("log2").innerHTML=title+','+GLOBAL.fiber.id;
}

function highlightAreasByTitle(title)
{
  var mapnodelist=document.getElementsByTagName("map");
  var targetmapid=["map-0-"+GLOBAL.iiarr[0],"map-1-"+GLOBAL.iiarr[1],"map-2-"+GLOBAL.iiarr[2]];
  for (var i=0;i<mapnodelist.length;i++)
  {
		if ((mapnodelist[i].id==targetmapid[0])||
				(mapnodelist[i].id==targetmapid[1])||
				(mapnodelist[i].id==targetmapid[2]))
		{
			var idx=mapnodelist[i].id.substr(4,1);
			var ctx=document.getElementById("display-"+GLOBAL.num2dim[idx]).getContext("2d");
			var areas=mapnodelist[i].childNodes;
			for (var j=0;j<areas.length;j++)
			{
				if (areas[j].title==title){
					var c=areas[j].coords.split(",");
					for (var k in c){c[k]=parseInt(c[k],10);}
					ctx.strokeStyle="#ff0000";
					ctx.lineWidth=1.5;
					ctx.beginPath();
					ctx.moveTo(c[0],c[1]);
					for (var k=2;k<c.length;k+=2){ctx.lineTo(c[k],c[k+1]);}
					ctx.closePath();
					ctx.stroke();
					ctx.lineWidth=1;
				}
			}
		}
  }
}

function Update()
{
	var maters	=	document.getElementsByTagName('Material'); 
	var length = maters.length;
	for(var j = 0;j<length;j++){
		if(maters[j].getAttribute('transparency') == '0.0' || maters[j].getAttribute('transparency') == 0)
			maters[j].setAttribute('transparency',0);
			
		else
			{maters[j].setAttribute('transparency',GLOBAL.opacity);
			//console.log(names[parseInt(maters[j].getAttribute('id').slice(-3),10)-1].Name);
			}
		};
}

function DrawImage(canvas,img,idx)
{
	var vlist=new Array;vlist[0]=[1,2];vlist[1]=[0,2];vlist[2]=[0,1];
  document.getElementById("log").innerHTML=GLOBAL.iiarr;
	var ctx=canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	var ww=canvas.width; var hh=canvas.height;
	var xloc=Math.floor((GLOBAL.iiarr[idx]-1)%10);
	var yloc=Math.floor((GLOBAL.iiarr[idx]-1)/10);
	ctx.globalAlpha=1;//-GLOBAL.opacity;
	ctx.drawImage(document.getElementById(img.id+"-bg"),ww*xloc,hh*yloc,ww,hh,0,0,ww,hh);
	ctx.globalAlpha=GLOBAL.opacity;
	ctx.drawImage(img,ww*xloc,hh*yloc,ww,hh,0,0,ww,hh);
	ctx.globalAlpha=1;//-GLOBAL.opacity;
	ctx.font="16px Arial";
	ctx.fillStyle="#ff0000";
	ctx.strokeStyle="#00ffff";
	var v=vlist[idx];
	ctx.globalAlpha=1;
	ctx.beginPath();
	if (idx==0){
		ctx.fillText("S",105,16);ctx.fillText("P",2,100);
		ctx.moveTo(0,GLOBAL.iiarr[v[1]]-.5);ctx.lineTo(217,GLOBAL.iiarr[v[1]]-.5);
		ctx.moveTo(GLOBAL.iiarr[v[0]]-.5,0);ctx.lineTo(GLOBAL.iiarr[v[0]]-.5,181);
	}
	if (idx==1){
		ctx.fillText("S",85,16); ctx.fillText("L",2,100);
		ctx.moveTo(0,GLOBAL.iiarr[v[1]]-.5);ctx.lineTo(181,GLOBAL.iiarr[v[1]]-.5);
		ctx.moveTo(GLOBAL.iiarr[v[0]]-.5,0);ctx.lineTo(GLOBAL.iiarr[v[0]]-.5,181);
	}
	if (idx==2){
		ctx.fillText("A",85,16); ctx.fillText("L",2,110);
		ctx.moveTo(0,217-GLOBAL.iiarr[v[1]]-.5);ctx.lineTo(181,217-GLOBAL.iiarr[v[1]]-.5);
		ctx.moveTo(GLOBAL.iiarr[v[0]]-.5,0);ctx.lineTo(GLOBAL.iiarr[v[0]]-.5,217);
	}
	ctx.closePath();
	ctx.stroke();
}

function x3d_onload(){
	$("#canvas-container").show();
	document.getElementById("display-splash").style.display='none';
	document.getElementById("display-container").style.display='none';
	document.getElementById("x3dElem").style.width='400px';
	document.getElementById("x3dElem").style.height='300px';
	document.getElementById("description").style.display='show';
	document.getElementById("figure-name").style.display='show';
	$("#figure-name").show();
	$("#description").show();

	$.ajax("mcqatlas/FC/1.json").done(function(data){
			data = $.parseJSON(data);
			GLOBAL.FC_chart.setOption(data);
		});
	$("#container-den").show();
	$.ajax("mcqatlas/SC/1.json").done(function(data){
			data = $.parseJSON(data);
			GLOBAL.SC_chart.setOption(data);
		});
	$("#container-fun").show();
	var group 	=	document.getElementsByTagName('Group');
	var maters	=	document.getElementsByTagName('Material'); 
	var length 	=	group.length;
	for(var i = 0;i < length;i++){
		var obj = group[i];
		var mater = maters[i];
		// mater.setAttribute('title',names[parseInt(mater.getAttribute('id').slice(-3),10)-1].Name);
		//鼠标悬停事件
		obj.onmouseover = function(){

		};
		//鼠标离开事件
		obj.onmouseout = function(){

		};
		//鼠标点击事件
		obj.ondblclick = function(){
			console.log('The double clicked!');
		};
		//鼠标双击事件
		obj.onclick = function(){
			var id = this.getAttribute('id');
			// console.log(id);
			// console.log(parseInt(id.slice(-3),10));
			for(var j = 0;j<length;j++){
				if(group[j].getAttribute('id') != id)
					maters[j].setAttribute('transparency',GLOBAL.opacity);
				else
					{maters[j].setAttribute('transparency','0.0');
					console.log(j+1);
					 var $treeview = $('#plugins4');
					$treeview.jstree('close_all');
					$treeview.jstree('deselect_all');
					 $treeview.jstree('select_node',j+1);
					//console.log(names[parseInt(maters[j].getAttribute('id').slice(-3),10)-1].Name);
				}
			};
		}
	}
}

function select_material(id){
	var mater = 'macaque__MA_' + id;
	var maters	=	document.getElementsByTagName('Material'); 
	var length = maters.length;
	for(var j = 0;j<length;j++){
		if(maters[j].getAttribute('id') != mater)
			maters[j].setAttribute('transparency',GLOBAL.opacity);
		else
			{maters[j].setAttribute('transparency','0.0');
			//console.log(names[parseInt(maters[j].getAttribute('id').slice(-3),10)-1].Name);
			}
		};
}

function select_fiber(id){
	var fc_name = "mcqatlas/FC/" + id + ".json";
	var sc_name = "mcqatlas/SC/" + id + ".json";
	$.ajax(fc_name).done(function(data){
			data = $.parseJSON(data);
			GLOBAL.FC_chart.setOption(data);
		});
	$.ajax(sc_name).done(function(data){
			data = $.parseJSON(data);
			GLOBAL.SC_chart.setOption(data);
		});
}