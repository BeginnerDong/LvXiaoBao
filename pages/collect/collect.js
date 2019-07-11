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
		
		num:0,
		mainData:[],
		mainDataTwo:[]
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getMainDataTwo();
		
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
		api.collectProducts(postData, callback);
	},
	
	getMainDataTwo(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
		};
	
		const callback = (res) => {
			if(res.content.list.length>0){
				self.data.mainDataTwo.push.apply(self.data.mainDataTwo,res.content.list)
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_mainDataTwo:self.data.mainDataTwo
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainDataTwo)
		};
		api.collectSuppliers(postData, callback);
	},
	
	menuClick(e) {
		const self = this;
		const num = e.currentTarget.dataset.num;
		self.setData({
			num:num
		})
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
