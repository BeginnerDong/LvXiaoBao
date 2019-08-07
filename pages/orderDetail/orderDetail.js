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
		showPay:false,
		orderInsurePeople:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.orderCode = options.orderCode;
		self.getMainData();
		
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
