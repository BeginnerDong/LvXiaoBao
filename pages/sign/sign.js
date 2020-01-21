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
		show: false,
		isFirstLoadAllStandard: ['getCddTypeData', 'getCddClassifyData', 'getOrderDetail'],
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
		cddTypeData: [],
		cddClassifyData: [],
		touristsTypeData: [{
			name: '个人',
			value: 101
		}, {
			name: '委托他人',
			value: 102
		}, {
			name: '委托企业',
			value: 103
		}],
		insureBuyType: [{
			name: '放弃购买',
			value: 101
		}, {
			name: '委托旅行社购买',
			value: 102
		}, {
			name: '自行购买',
			value: 103
		}],
		payType: ['现金', '支票', '信用卡', '其他'],
		submitData: {
			orderCode: '',
			cddSource: '',
			cddType: '',
			touristsType: '',
			travelerRepresentName: '',
			travelerRepresentCard: '',
			travelerRepresentPhone: '',
			travelerRepresentEmail: '',
			peoples: [],
			productName: '',
			startDate: '',
			backDate: '',
			totalDay: 1,
			totalNight: 1,
			cddJourney: '',
			adultPrice: '',
			childPrice: '',
			tourGuideServicePrice: '',
			singleSupplement: '',
			travelPayDate: '',
			travelPayType: '',
			travelTotalPrice: '',
			travelPayRemark: '',
			insuranceChoose: '',
			insuranceName: '',
			lowestGroup: 1,
			notGroupChoose: '',
			isAgreeGroup: '',
			isAgreeGroupTravelName: '',
			methodChoose: '',
			arbitrationName: '',
			otherDeal: '',
			signPeoples: [],
			cddCheckType: 101,
			replenishs: [],
			intrustTravelName: '',
			accessorys: []
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.orderCode = options.orderCode;
		self.data.submitData.orderCode = self.data.orderCode;
		if(!wx.getStorageSync('payFee')){
			wx.setStorageSync('payFee',[])
		};
		if(!wx.getStorageSync('shopping')){
			wx.setStorageSync('shopping',[])
		};
		self.getOrderDetail();
		self.getCddTypeData();
		self.getCddClassifyData();
	},
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.submitData.accessorys.splice(index,1);
		self.setData({
			web_submitData:self.data.submitData
		})
	},
	
	onShow(){
		const self = this;
		var arr1 = wx.getStorageSync('payFee');
		arr1.push.apply(arr1,wx.getStorageSync('shopping'));
		self.data.submitData.replenishs = arr1;
	},

	upLoadImg() {
		const self = this;

		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.result == '0') {
				var url = res.fullPath;

				self.data.submitData.accessorys.push(
					{accUrl:url,accType:102,accClassify:101}
				)
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
			} else {
				api.showToast(res.msg, 'none')
			}

		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;
				api.uploadFile(tempFilePaths[0], 'file', {
					classify: 'T019',
					rwidth: 150,
					rheight: 150,
					file: tempFilePaths[0],
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
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
					self.data.submitData.productName = self.data.orderDetailData.pdtName,
					self.data.submitData.startDate = self.data.orderDetailData.startDate,
					self.data.submitData.backDate = self.data.orderDetailData.endDate
				    self.data.submitData.travelPayDate = self.data.orderDetailData.payDate,
					self.data.submitData.travelPayDate = self.data.orderDetailData.payDate

			};
			self.journery(self.data.orderDetailData.pdtId, self.data.orderDetailData.pdtPricetypeid)
			self.setData({
				web_submitData: self.data.submitData,
				web_orderDetailData: self.data.orderDetailData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getOrderDetail', self);
		};
		api.orderDetail(postData, callback);
	},

	journery(id, typeId) {
		const self = this;
		const postData = {
			pdtId: id,
			classifyId: typeId
		}
		const callback = (res) => {
			if (res.code == 200) {
				var totalContent = '';
				for (var i = 0; i < res.content.journeys.length; i++) {
					var basic = res.content.journeys[i];
					var content = '第' + basic.journeyDay + '天 ' + basic.endCity + '\n\n' + basic.journeyContent + '\n';
					totalContent += content;
				}
			}
			self.data.submitData.cddJourney = totalContent
		};
		api.journery(postData, callback);
	},

	goEditJournery() {
		const self = this;
		wx.setStorageSync('journery', self.data.submitData.cddJourney);
		api.pathTo('/pages/jounery/jounery', 'nav');
	},
	
	goOtherDeal() {
		const self = this;
		wx.setStorageSync('otherDeal', self.data.submitData.otherDeal);
		api.pathTo('/pages/otherDeal/otherDeal', 'nav');
	},

	getCddTypeData() {
		const self = this;
		const postData = {};
		const callback = (res) => {
			if (res.content.list) {
				self.data.cddTypeData.push.apply(self.data.cddTypeData, res.content.list)
			} else {
				api.showToast(res.message, 'none')
			}
			self.setData({
				web_cddTypeData: self.data.cddTypeData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getCddTypeData', self);
		};
		api.cddType(postData, callback);
	},

	getCddClassifyData() {
		const self = this;
		const postData = {

		};
		const callback = (res) => {
			if (res.content.list) {
				self.data.cddClassifyData.push.apply(self.data.cddClassifyData, res.content.list)
			} else {
				api.showToast(res.message, 'none')
			}
			self.setData({
				web_cddClassifyData: self.data.cddClassifyData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getCddClassifyData', self);
		};
		api.cddClassify(postData, callback);
	},


	submit(e) {
		const self = this;
		api.buttonCanClick(self);
		var type = api.getDataSet(e, 'type');
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.replenishs;
		delete newObject.accessorys;
		if (self.data.submitData.notGroupChoose != 101) {
			delete newObject.intrustTravelName
		};
		if (self.data.submitData.isAgreeGroup != 'true') {
			delete newObject.isAgreeGroupTravelName
		}
		if (self.data.submitData.methodChoose != '1') {
			delete newObject.arbitrationName
		}
		const pass = api.checkComplete(newObject);

		if (!pass) {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
			return
		};
		self.contractSign(type)
	},

	contractSign(type) {
		const self = this;
		if (type == 'jump') {
			self.data.submitData.cddCheckType = 102
		};
		const postData = api.cloneForm(self.data.submitData);
		postData.header = {
			'Authorization': wx.getStorageSync('token'),
			'Content-Type': 'application/x-www-form-urlencoded'
		};
		const callback = (res) => {
			if (res.content.contractCode) {
				api.buttonCanClick(self, true);
				wx.setStorageSync('contract', res.content)

				if (type == 'jump') {
					api.pathTo('/pages/electro/electro?url='+res.content.contractPdf, 'nav')
				} else if (type == 'next') {
					api.pathTo('/pages/orderDetail/orderDetail?orderCode=' + self.data.orderCode, 'nav')
				}
			} else {
				api.buttonCanClick(self, true);
				api.showToast(res.messgae, 'none');
				return
			}
		};
		api.contractSign(postData, callback);
	},

	counter(e) {
		const self = this;
		var key = api.getDataSet(e, 'key');
		var type = api.getDataSet(e, 'type');
		if (type == '-') {
			if (self.data.submitData[key] > 1) {
				self.data.submitData[key]--
			}
		} else {
			self.data.submitData[key]++
		}
		self.setData({
			web_submitData: self.data.submitData
		})
	},


	inputChange(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
	},



	cddTypeChange(e) {
		const self = this;
		self.data.submitData.cddSource = self.data.cddTypeData[e.detail.value].type;
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	cddClassifyChange(e) {
		const self = this;
		self.data.submitData.cddType = self.data.cddClassifyData[e.detail.value].type;
		self.data.submitData.otherDeal = self.data.cddClassifyData[e.detail.value].agreement
		self.setData({
			web_index1: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	touristsTypeChange(e) {
		const self = this;
		self.data.submitData.touristsType = self.data.touristsTypeData[e.detail.value].value;
		self.setData({
			web_index2: e.detail.value,
			web_submitData: self.data.submitData
		})
	},



	peopleChange(e) {
		const self = this;
		self.data.submitData.peoples = [];
		self.data.submitData.peoples.push(self.data.orderDetailData.peoples[e.detail.value].id);
		self.data.submitData.signPeoples.push(self.data.orderDetailData.peoples[e.detail.value].id);
		self.setData({
			web_index3: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	insureBuyTypeChange(e) {
		const self = this;
		self.data.submitData.insuranceChoose = self.data.insureBuyType[e.detail.value].value;
		self.setData({
			web_index4: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	payTypeChange(e) {
		const self = this;
		self.data.submitData.travelPayType = self.data.payType[e.detail.value];
		self.setData({
			web_index5: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	dateChangeStart(e) {
		const self = this;
		self.data.submitData.startDate = e.detail.value;
		self.setData({
			web_submitData: self.data.submitData
		})
	},


	dateChangeEnd(e) {
		const self = this;
		self.data.submitData.backDate = e.detail.value;
		self.setData({
			web_submitData: self.data.submitData
		})
	},



	payDateChange(e) {
		const self = this;
		self.data.submitData.travelPayDate = e.detail.value;
		self.setData({
			web_submitData: self.data.submitData
		})
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
