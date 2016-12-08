import Panel from './Panel';

new Panel({
	container: '#panel',
	width: 800,
	height: 600,
	menuOption: [
		{text: '导出元数据', cb: (panel)=>{
			localStorage.setItem("xpanel",JSON.stringify(panel.exportCanavsData()));
		}, type: 0},
		{text: '导入元数据', cb: (panel)=>{
			let data = JSON.parse(localStorage.getItem("xpanel"));
			data && panel.importCanvasData(data);
		}, type: 0},
		{text: '修改', cb: (panel, activeShape)=>{
					// console.log(activeShape)
			// 图形修改框
			let alterModalBg = document.querySelector("#xpanelMenuAlter");
			if(alterModalBg){
				alterModalBg.style.display="block";
			}else{
				alterModalBg = document.createElement('div');
				alterModalBg.classList.add('xpanel-saveimage-bg');
				alterModalBg.setAttribute('id','xpanelMenuAlter');
				document.body.appendChild(alterModalBg);
			}
			let dataHTML='';
			for(let p in activeShape.data.properties){
				dataHTML+=`<div>${p}: ${activeShape.data.properties[p]}</div>`;
			}
			alterModalBg.innerHTML=`
			<div class="xpanel-menu-alter">
				<h4>图形属性修改</h4>
				<div>
					<span>显示文本</span><input type="text" value="${activeShape.text}" name="text">
				</div>
				<div>
					<span>字体大小</span><input type="range" value="${activeShape.font.size}" onchange="this.nextSibling.innerHTML=this.value+'px'" name="font.size" min="14" max="20" step="1"><small style="vertical-align: super;">${activeShape.font.size}px</small>
				</div>
				<div>
					<span>背景颜色</span><input type="color" value="${activeShape.backgroundColor}" name="backgroundColor">
				</div>
				<div>
					<span>前景颜色</span><input type="color" value="${activeShape.color}" name="color">
				</div>
				<hr/>
				<div>
					<span style="float:left;">外部数据</span>
					<span>${dataHTML}</span>
				</div>
				<div>
					<button id="confirmAlter">确定</button>
					<button onclick="this.parentNode.parentNode.parentNode.style.display='none'">取消</button>
				</div>
			</div>
			`;

			document.querySelector("#confirmAlter").onclick=function (){
				var inputs = document.querySelectorAll("#xpanelMenuAlter input");
				for(var i of inputs){
					let name = i.getAttribute('name');
					let path = name.split('.'), propertyPath='activeShape';
					for(var p of path){
						propertyPath+=`['${p}']`;
					}
					// console.log(propertyPath)
					eval('('+propertyPath+'=i.value)');
				}
				panel.repaint();
				document.querySelector("#xpanelMenuAlter").style.display='none';
			}
			// console.log(activeShape)
		}, type: 1}
	]
});