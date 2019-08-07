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
		
		isFirstLoadAllStandard: ['getMainData'],
	
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

	
	},

	onShow() {
		const self = this;
		self.data.mainData = wx.getStorageSync('payFee');
		console.log('onShow', self.data.mainData);
		
		self.setData({
			web_mainData: self.data.mainData
		});
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
	},



	deleteShopping(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.mainData.splice(parseInt(index),1);
		wx.setStorageSync('payFee',self.data.mainData);
		self.setData({
			web_mainData: self.data.mainData
		})
	},


	

	intoPath(e) {
		const self = this;
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
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
