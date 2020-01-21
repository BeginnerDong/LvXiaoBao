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
		cardData: [{
				key: '身份证',
				value: 101
			}, {
				key: '护照',
				value: 102
			}, {
				key: '军官证',
				value: 103
			}, {
				key: '学生证',
				value: 104
			}, {
				key: '老年证',
				value: 105
			}, {
				key: '台湾通行证',
				value: 106
			},
			{
				key: '港澳通行证',
				value: 107
			}
		],
		orderPost: {},	
		show_fee:false,
		showMore:false,
		lineFee:0,
		peopleData:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
	},

	isShowFee(){
		const self = this;
		self.data.show_fee = !self.data.show_fee;
		self.setData({
			show_fee:self.data.show_fee
		})
	},
	
	isShowMore(){
		const self = this;
		self.data.showMore = !self.data.showMore;
		self.setData({
			showMore:self.data.showMore
		})
	},

	onShow() {
		const self = this;
		self.data.allPeopleCount=0;
		self.data.lineFee = wx.getStorageSync('lineFee');
		self.data.peopleData = api.getStorageArray('peopleData');
		
		self.data.orderPost = wx.getStorageSync('orderPost');
		self.data.orderPost.peopleIds = [];
		for (var i = 0; i < self.data.peopleData.length; i++) {
			for (var j = 0; j < self.data.cardData.length; j++) {
				if (self.data.peopleData[i].cdtype == self.data.cardData[j].value) {
					self.data.peopleData[i].cdtype = self.data.cardData[j].key
				}
			}	
			if(self.data.peopleData[i].isSelect){
				self.data.orderPost.peopleIds.push(self.data.peopleData[i].id)
			}	
		};
		for (var i = 0; i < self.data.orderPost.bills.length; i++) {
			self.data.allPeopleCount += self.data.orderPost.bills[i].amount
		};
		self.setData({
			web_lineFee:self.data.lineFee,
			web_allPeopleCount:self.data.allPeopleCount,
			web_orderPost: self.data.orderPost,
			web_peopleData: self.data.peopleData
		});
		wx.setStorageSync('orderPost',self.data.orderPost)	
	},
	
	cancelPeople(e) {
		const self = this;
		const index = api.getDataSet(e, 'index');
		if (self.data.peopleData[index].isSelect) {
			self.data.peopleData[index].isSelect = false;
			var position = self.data.orderPost.peopleIds.indexOf(self.data.peopleData[index].id);
			console.log(position)
			self.data.orderPost.peopleIds.splice(parseInt(position),1)
		} else {
			self.data.peopleData[index].isSelect = true;
		};
		api.setStorageArray('peopleData', self.data.peopleData[index], 'id', 999);
		self.setData({
			web_orderPost:self.data.orderPost,
			web_peopleData: self.data.peopleData
		});
	},
	
	
	
	

	getMainData() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			url: 'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/' + wx.getStorageSync('orderPost').pdtId
		};
		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData = res.content;
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.supplierpProductsDetail(postData, callback);
	},

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'orderPost');
		self.setData({
			web_orderPost: self.data.orderPost,
		});
		wx.setStorageSync('orderPost',self.data.orderPost)
	},
	
	submit(e){
		const self = this;
		api.buttonCanClick(self);
		var type=api.getDataSet(e,'type');
	
		if(self.data.orderPost.reservationAddress==''||self.data.orderPost.reservationCompany==''||self.data.orderPost.reservationName==''||self.data.orderPost.reservationPhone==''){
			api.buttonCanClick(self,true);
			api.showToast('请补充预定人信息','none');
			return
		};
		if(self.data.orderPost.peopleIds.length>0&&self.data.orderPost.peopleIds.length!=self.data.allPeopleCount){
			api.buttonCanClick(self,true);
			api.showToast('出行人数不符','none');
			return
		}
		
		self.addOrder(type)
	},


	addOrder(type) {
		const self = this;
		const postData = api.cloneForm(self.data.orderPost);
		postData.header = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': wx.getStorageSync('token')
		};
		const callback = (res) => {
			console.log(res)
			wx.removeStorageSync('peopleData');
			wx.removeStorageSync('orderPost');
			if (res.content.orderCode) {
				if(type=='jump'){
					api.pathTo('/pages/orderDetail/orderDetail?orderCode=' + res.content.orderCode, 'nav')
				}else if(type=='next'){
					api.pathTo('/pages/insurance/insurance?orderCode=' + res.content.orderCode, 'nav')
				}			
			}else{
				api.buttonCanClick(self,true);
				api.showToast(res.messgae,'none');
				return
			}
		};
		api.addOrder(postData, callback);
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
