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
		show:false
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
	
	close(){
		const self = this;	
		self.data.show = false;
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
		api.sales(postData, callback);
	},
	
	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.mainData[self.data.index].phone,
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
