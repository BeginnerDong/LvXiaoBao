import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
const qrcodeWidth = rpx2px(300)
Page({
	data: {
		isFirstLoadAllStandard: ['getMainData'],
		showPay:false,
		orderInsurePeople:[],
		orderContractsPeople:[],
		show:false,
		qrcodeWidth: qrcodeWidth,
		showQr:false
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.orderCode = options.orderCode;
		self.getMainData();
		
	},
	
	showQr(e){
		const self = this;
		self.data.cIndex = api.getDataSet(e,'index');
		console.log(self.data.cIndex)
		for (var i = 0; i < self.data.mainData.contracts[self.data.cIndex].signs.length; i++) {
			for (var j = 0; j < self.data.mainData.peoples.length; j++) {
				if(self.data.mainData.contracts[self.data.cIndex].signs[i].touristId==self.data.mainData.peoples[j].id){
					self.data.mainData.contracts[self.data.cIndex].signs[i].name=self.data.mainData.peoples[j].name
					self.data.mainData.contracts[self.data.cIndex].signs[i].phone=self.data.mainData.peoples[j].phone
				}
			}
		};
		console.log(self.data.mainData.contracts[self.data.cIndex].signs)
		self.setData({
			web_mainData:self.data.mainData,
			web_index:self.data.cIndex,
			web_show:true
		})	
	},
	
	cavans(e){
		const self = this;
		var pIndex = api.getDataSet(e,'index');
		qrcode = new QRCode('canvas', {
			// usingIn: this,
			text: self.data.mainData.contracts[self.data.cIndex].signs[pIndex].qrcode,
			
			width: qrcodeWidth,
			height: qrcodeWidth,
			colorDark: "#1CA4FC",
			colorLight: "white",
			correctLevel: QRCode.CorrectLevel.H,
		});
		self.setData({
			showQr:true
		})
	},
	
	closeQr(){
		const self = this;
		self.setData({
			showQr:false
		})
	},
	
	/* previewImg(e) {
		const self = this;
		var pIndex = e.currentTarget.dataset.index;
		self.data.qrUrl = self.data.mainData.contracts[cIndex].signs[pIndex].qrcode
		console.log('self.data.originData.mainImg', self.data.originData.mainImg)
		wx.previewImage({
			current: self.data.originData.mainImg[index].url,
			urls: self.data.urlSet,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	}, */
	
	close(){
		const self = this;
		self.data.show = false;
		self.setData({
			web_show:self.data.show
		})
	},
	
	
	getMainData(e) {
		const self = this;
		
		const postData = {
			header:{
				'Authorization':wx.getStorageSync('token')
			},
			url:'http://yapi.lxbtrip.cn/mock/19/odr/v1/order/'+self.data.orderCode
		}
		const callback = (res) => {
			if(res.content){
				self.data.mainData = res.content
				self.data.planCode = self.data.mainData.plans[0].planCode
			};
			self.setData({
				web_planCode:self.data.planCode,
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.orderDetail(postData, callback);
	},
	
	
	checkInsurePeople(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		for (var i = 0; i < self.data.mainData.insures[index].tourists.length; i++) {
			for (var j = 0; j < self.data.mainData.peoples.length; j++) {
				if(self.data.mainData.insures[index].tourists[i].touristId==self.data.mainData.peoples[j].id){
					self.data.orderInsurePeople.push(self.data.mainData.peoples[j]);
				}
			}
		};
		wx.setStorageSync('orderPeople',self.data.orderInsurePeople)
		api.pathTo('/pages/orderPeople/orderPeople','nav')
	},
	
	
	checkContractsPeople(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		for (var i = 0; i < self.data.mainData.contracts[index].signs.length; i++) {
			for (var j = 0; j < self.data.mainData.peoples.length; j++) {
				if(self.data.mainData.contracts[index].signs[i].touristId==self.data.mainData.peoples[j].id){
					self.data.orderContractsPeople.push(self.data.mainData.peoples[j]);
				}
			}
		};
		wx.setStorageSync('orderPeople',self.data.orderContractsPeople)
		api.pathTo('/pages/orderPeople/orderPeople','nav')
	},
	
	
	
	submit(){
		const self = this;
		console.log(111)
		if(self.data.mainData.plans.length>1){
			self.data.showPay = !self.data.showPay
			self.setData({
				showPay:self.data.showPay
			})
		}else{
			self.pay()
		}	
	},
	
	choose(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.planCode = self.data.mainData.plans[index].planCode;
		self.setData({
			web_planCode:self.data.planCode
		})
	},
	
	pay(e) {
		const self = this;
		api.buttonCanClick(self);
		const postData = {
			header:{
				'Authorization':wx.getStorageSync('token')
			},
			orderCode:self.data.orderCode,
			planCode:self.data.planCode	
		}
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
		api.orderPay(postData, callback);
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
