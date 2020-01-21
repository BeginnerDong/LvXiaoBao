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
		mainData:[],
		isFirstLoadAllStandard: ['getMainData'],
		type:1
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self)
		self.getMainData();
		self.setData({
			web_type:self.data.type,
		})
	},
	
	changeType(e){
		const self = this;
		self.data.type=api.getDataSet(e,'type');
		self.setData({
			web_type:self.data.type,
		})
	},
	
	
	chooseType(e){
		const self = this;
		self.data.id = api.getDataSet(e,'id');
		self.data.price = api.getDataSet(e,'price');
		self.setData({
			web_id:self.data.id,
			web_price:self.data.price
		})
	},

	
	getMainData() {
		const self = this;
		
		const postData = {
			header:{
				'Authorization':wx.getStorageSync('token')
			}
		};
	
		const callback = (res) => {
			if (res.content.list.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.content.list);
				self.data.id  = self.data.mainData[0].id;
				self.data.price = self.data.mainData[0].salePrice;
			} else {
				self.data.isLoadAll = true
			};
			self.setData({
				web_id:self.data.id,
				web_price:self.data.price,
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.vipList(postData, callback);
	},
	
	buy() {
		const self = this;
		api.buttonCanClick(self);
		const postData = {
			header:{
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization':wx.getStorageSync('token')
			},
			id:self.data.id
		};
		const callback = (res) => {
			if (res.code == 200) {
				api.buttonCanClick(self, true);
				if (res.content) {
					const payCallback = (payData) => {
						if (payData == 1) {
							
							api.buttonCanClick(self, true);
						}else{
							api.showToast(res.msg, 'none')
						}
					};
					api.realPay(res.content, payCallback);
				}
			} else {
				api.buttonCanClick(self, true);
				api.showToast(res.msg, 'none')
			}
		};
		api.vipPay(postData, callback);
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
