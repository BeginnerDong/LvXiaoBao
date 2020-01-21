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
		show_bx: false,
		show_date: false,
		show_tips: true,
		isFirstLoadAllStandard: ['getInsuranceData'],
		mainData: [],
		insuranceData: [],
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
		showMore: false,
		showMoreBx: false,
		peopleData: [],
		insuresData: {
			companyId: '',
			orderCode: '',
			peopleIds: [],
			insureId: '',
			startDate: '',
			endDate: ''
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.orderCode = options.orderCode;
		self.getInsuranceData();
		self.getOrderDetail()
	},


	isShowFee() {
		const self = this;
		self.data.show_fee = !self.data.show_fee;
		self.setData({
			show_fee: self.data.show_fee
		})
	},
	close_tips() {
		const self = this;
		self.setData({
			show_tips: false
		})
	},
	isShowMore() {
		const self = this;
		self.data.showMore = !self.data.showMore;
		self.setData({
			showMore: self.data.showMore
		})
	},

	isShowMoreBx() {
		const self = this;
		self.data.showMoreBx = !self.data.showMoreBx;
		self.setData({
			showMoreBx: self.data.showMoreBx
		})
	},

	onShow() {
		const self = this;
		var insureCode = wx.getStorageSync('insureCode');
		if (insureCode) {
			self.data.insuresData.insureCode = insureCode
		};
		var array = api.getStorageArray('peopleData');
		self.data.peopleData = [];

		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < self.data.cardData.length; j++) {
				if (array[i].cdtype == self.data.cardData[j].value) {
					array[i].cdtype = self.data.cardData[j].key
				}
			}
			if (array[i].isSelect) {
				self.data.peopleData.push(array[i])
			}
		};

		self.setData({
			web_peopleData: self.data.peopleData
		});
	},

	choosePeople(e) {
		const self = this;
		const index = api.getDataSet(e, 'index');
		if (self.data.peopleData[index].isBx) {
			self.data.peopleData[index].isBx = false;
		} else {
			self.data.peopleData[index].isBx = true;
		};
		for (var i = 0; i < self.data.peopleData.length; i++) {
			if (self.data.peopleData[i].isBx) {
				self.data.insuresData.peopleIds.push(self.data.peopleData[i].id)
			}
		}
		api.setStorageArray('peopleData', self.data.peopleData[index], 'id', 999);
		self.setData({
			web_peopleData: self.data.peopleData
		});
	},

	chooseBx(e) {
		const self = this;
		api.buttonCanClick(self);

		if (self.data.insuresData.peopleIds.length > 0) {
			const id = api.getDataSet(e, 'id');
			if (self.data.insuresData.insureId != id) {
				self.data.insuresData.insureId = id
			}
			self.setData({
				web_insuresData: self.data.insuresData
			});
			api.buttonCanClick(self, true);
			/* self.getInsuranceFee() */
		} else {
			api.buttonCanClick(self, true);
			api.showToast('先选择投保游客', 'none')
		}

	},

	getOrderDetail(e) {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			url: 'http://yapi.lxbtrip.cn/mock/19/odr/v1/order/' + self.data.orderCode
		}
		const callback = (res) => {
			if (res.content) {
				self.data.orderDetailData = res.content,
					self.data.insuresData.orderCode = self.data.orderDetailData.orderCode,
					self.data.insuresData.startDate = self.data.orderDetailData.startDate,
					self.data.insuresData.endDate = self.data.orderDetailData.endDate,
					self.data.totalNum = self.data.orderDetailData.totalNum[0] + self.data.orderDetailData.totalNum[1] + self.data.orderDetailData
					.totalNum[2] + self.data.orderDetailData.totalNum[3]
			};
			self.setData({
				web_totalNum: self.data.totalNum,
				web_orderDetailData: self.data.orderDetailData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getOrderDetail', self);
		};
		api.orderDetail(postData, callback);
	},

	submit(e) {
		const self = this;
		api.buttonCanClick(self);
		var type = api.getDataSet(e, 'type');
		const pass = api.checkComplete(self.data.insuresData);
		if (!pass) {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
			return
		};
		/* 	if(self.data.peopleData.length!=self.data.totalNum){
				api.buttonCanClick(self,true);
				api.showToast('出行人数不符','none');
				return
			} */

		self.insureBuy(type)
	},



	getInsuranceData() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
		};
		const callback = (res) => {
			if (res.code == 200) {
				self.data.insuranceData.push.apply(self.data.insuranceData, res.content.list)
			};
			self.setData({
				web_insuranceData: self.data.insuranceData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getInsuranceData', self);
		};
		api.insures(postData, callback);
	},

	insureBuy(type) {
		const self = this;
		const postData = api.cloneForm(self.data.insuresData);
		postData.header = {
			'Authorization': wx.getStorageSync('token'),
			'Content-Type': 'application/x-www-form-urlencoded'
		};
		const callback = (res) => {
			if (res.content.orderCode) {
				api.buttonCanClick(self, true);
				wx.setStorageSync('insureCode', res.content.orderCode);
				if (type == 'jump') {
					api.pathTo('/pages/orderDetail/orderDetail?orderCode=' + self.data.orderCode, 'nav')
				} else if (type == 'next') {
					api.pathTo('/pages/sign/sign?orderCode=' + self.data.orderCode, 'nav')
				}
			} else {
				api.buttonCanClick(self, true);
				api.showToast(res.messgae, 'none');
				return
			}
		};
		api.insureBuy(postData, callback);
	},



	insuranceChange(e) {
		const self = this;
		var index = e.detail.value;
		self.setData({
			web_index: index
		});
		self.data.insuresData.companyId = self.data.insuranceData[index].companyId,
			self.getMainData(self.data.insuranceData[index].companyId);
	},

	getMainData(id) {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			companyId: id
		};

		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData.push.apply(self.data.mainData, res.content.list)
			};
			self.setData({

				web_mainData: self.data.mainData
			})

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.insuresPdt(postData, callback);
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
