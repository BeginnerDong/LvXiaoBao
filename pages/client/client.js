import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		isFirstLoadAllStandard:['getMainData'],
		show:false,
		mainDataC:{},
		alphbate:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_show:self.data.show
		})
	},
	
	isShow(){
		const self = this;
		
		
		self.data.show = !self.data.show;
		self.setData({
			
			web_show:self.data.show
		})
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			
		};
		
		const callback = (res) => {
			if(res.content.list.length>0){
				/* self.data.mainData.push.apply(self.data.mainData,res.content.list) */
				for (var i = 0; i < res.content.list.length; i++) {
					
						if(!self.data.mainDataC[res.content.list[i].firstLetter]){
							self.data.mainDataC[res.content.list[i].firstLetter] = [];
						};
						self.data.mainDataC[res.content.list[i].firstLetter].push(res.content.list[i])
						/* if(res.content.list[i].firstLetter==self.data.web_mainDataC[self.data.web_mainDataC.length-1].tag){
							self.data.web_mainDataC[self.data.web_mainDataC.length-1].data.push(res.content.list[i]);
						}else{
							self.data.web_mainDataC.push({
								tag: res.content.list[i].firstLetter,
								
								data:[res.content.list[i]]
							});
						}; */
					
				};
				
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_mainDataC:self.data.mainDataC
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			
		};
		api.travelers(postData, callback);
	},

	
/* 	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.number++;
			self.getMainData();
		};
	}, */

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})