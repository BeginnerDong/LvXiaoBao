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
		num:0,
		stateOne:'',
		stateTwo:'',
		peopleName:'',
		ssp:'',
		esp:'',
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_show:self.data.show
		})
	},
	
	isShow(e){
		const self = this;
		self.data.index = api.getDataSet(e,'index');
		
		self.data.show = !self.data.show;
		self.setData({
			web_index:self.data.index,
			web_show:self.data.show
		})
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
		};
		if(self.data.stateOne!=''){
			postData.stateOne = self.data.stateOne
		};
		if(self.data.stateTwo!=''){
			postData.stateTwo = self.data.stateTwo
		};
		const callback = (res) => {
			if(res.content.list.length>0){
				self.data.mainData.push.apply(self.data.mainData,res.content.list)
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.order(postData, callback);
	},
	
	menuClick: function(e) {
		const self = this;
		api.buttonCanClick(self);
		const num = e.currentTarget.dataset.num;
		self.changeSearch(num);
	},
	
	changeSearch(num) {
		const self = this;
		this.setData({
			num: num
		});
		self.data.searchItem = {}
		if (num == '0') {
	
		} else if (num == '1') {
			self.data.stateOne = '101';
	
		} else if (num == '2') {
			self.data.stateOne = '102';
		
		} else if (num == '3') {
			self.data.stateTwo = '108';
		} 
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
	},

	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.number++;
			self.getMainData();
		};
	},

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
