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
	
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		//self.getMainData();
		
	},
	
	onShow() {
	  const self = this;
	  self.data.mainData = api.getStorageArray('salesData');
	 self.data.selectSale = wx.getStorageSync('selectSale');
	  self.setData({
		  web_selectSale:self.data.selectSale,
	    web_mainData:self.data.mainData
	  });
	  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
	},
	
	
	choose(e) {
		const self = this;
		const index = api.getDataSet(e, 'index');
		
		var selectSale = self.data.mainData[0][index];
		wx.setStorageSync('selectSale',selectSale);
		
		wx.navigateBack({
			delta:1
		});
		self.setData({
			web_mainData: self.data.mainData
		});
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
