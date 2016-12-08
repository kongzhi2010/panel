export default class Menu {
	constructor(panel, option = []) {
		//type 可应用的元素, 0：全局, 1：图形, 2：画布, 3：连线
		//0：始终可用，1、2：activeShape为空时自动禁用
		this.options = [
			{text: '连线', cb: this.drawLine, type: 1},
			// {text: '复制', cb: this.copyShape, type: 1},
			// {text: '粘贴', cb: this.pasteShape, type: 2},
			// {text: '剪切', cb: this.cuteShape, type: 1}, 
			{text: '删除', cb: this.deleteShape, type: 1},
			{text: '删除', cb: this.deleteLine, type: 3},
			{text: '保存为图片', cb: this.saveAsImage, type: 0},
			...option
		];

		this.panel = panel;
		// 右键菜单
	  	this.element = document.createElement('div');
	  	this.element.classList.add('xpanel-menu');
		let ul = document.createElement('ul'), frag = document.createDocumentFragment();
		for(let e of this.options){
			let li = document.createElement('li');
			li.innerHTML = e.text;
			li.addEventListener('click', this.actionWrapper.bind(this, e.type, e.cb));
			li.setAttribute('data-menutype', e.type);
			ul.appendChild(li);
		}
		frag.appendChild(ul);
		this.element.appendChild(frag);

		
	}
	disable(DOMElement, ...type) {
		if(type.indexOf(parseInt(DOMElement.getAttribute('data-menutype'))) !== -1){
			DOMElement.classList.add('disabled');
		}else{
			DOMElement.classList.remove('disabled');
		}
	}
	toggleGlobalOperation(e){
		if(e.getAttribute('data-menutype')==0){
			if(e.className.indexOf('disabled') == -1){
				e.classList.add('disabled');
			}else{
				e.classList.remove('disabled');
			}
		}
	}
	show({startX, startY}) {
		this.element.style.top=startY-window.scrollY+2+'px';
		this.element.style.left=startX-window.scrollX+2+'px';

		let onShape = this.panel.activedShape?true:false,
			onLine = this.panel.activedLine?true:false,
			hasShape = this.panel.hasShape();

		for(let e of this.element.children[0].children){
			if(onShape){
				this.disable(e, 2, 3);
			}else if(onLine){
				this.disable(e, 1, 2);
			}else{
				this.disable(e, 1, 2, 3);
			}
			// if(!hasShape){
			// 	this.toggleGlobalOperation(e);
			// }
		}
		this.element.classList.add('show');
	}
	hide() {
		this.element.classList.remove('show');
	}
	actionWrapper(actionType, action) {
		if(this.panel.activedShape){
			if(actionType == 1 || actionType == 0){// 执行全局和图形操作的动作
				action.call(this, this.panel, this.panel.activedShape);
				this.hide();
			}
		}else if(this.panel.activedLine){
			if(actionType == 3){// 执行连线操作的动作
				action.call(this, this.panel, this.panel.activedLine);
				this.hide();
			}
		}else{
			if(actionType === 0){// 只执行全局操作的动作
				action.call(this, this.panel);
				this.hide();
			}
		}
	}
	drawLine(panel, activedShape) {
		panel.frontCanvas.style.cursor='crosshair';
		panel.drawLine = true;
		// 记录连线的起始图形
		panel.pathStart.shape = activedShape;
		// panel.repaint();
		activedShape.drawDots();
	}
	deleteLine(panel, activedLine) {
		activedLine && panel.deleteLine(activedLine, true);

	}
	deleteShape(panel, activedShape) {
		activedShape && panel.deleteShape(activedShape);
	}
	copyShape(panel, activedShape) {
		alert('copyShape');
	}
	cuteShape(panel, activedShape) {
		alert('cuteShape');
	}
	pasteShape(panel, activedShape) {
		alert('pasteShape');
	}
	alterShape(panel, activedShape) {

	}
	saveAsImage() {
		this.hide();
		let imageName = window.prompt('请输入图片名');
		if(imageName){
			let div = document.createElement('div'),
					mention = document.createElement('div'),
					imgdiv = document.createElement('div'),
					img = this.panel.saveAsImage(),
					a = document.createElement('a'),
					frag = document.createDocumentFragment();

			div.classList.add('xpanel-saveimage-bg');
			mention.classList.add('xpanel-saveimage-mention');
			mention.innerHTML = `在图片上 
								<span style="font-weight:bold;">鼠标右键另存为</span> 
								或者 
								<span style="font-weight:bold;">点击图片</span> 
								下载, 
								<a href="javascript:void(0)" onclick="document.body.removeChild(this.parentNode.parentNode)">取消</a>
								`;
			img.setAttribute('alt', imageName);
			img.setAttribute('title', imageName);
			a.setAttribute('title', imageName);
			a.appendChild(img);
			a.setAttribute('download', imageName);
			a.setAttribute('href', img.src);
			a.setAttribute('onclick',"document.body.removeChild(this.parentNode.parentNode)");

			imgdiv.appendChild(a);
			div.appendChild(mention);
			div.appendChild(imgdiv);
			frag.appendChild(div)
			document.body.appendChild(frag);
		}
	}
}