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
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		
		self.setData({
			web_show: self.data.show
		})
	},

	onShow() {
		const self = this;
		self.data.mainData = api.getStorageArray('peopleData');
		for (var i = 0; i < self.data.mainData.length; i++) {
			for (var j = 0; j < self.data.cardData.length; j++) {
				if (self.data.mainData[i].cdtype == self.data.cardData[j].value) {
					self.data.mainData[i].cdtype = self.data.cardData[j].key
				}
			}
		};
		self.setData({
			web_mainData: self.data.mainData
		});
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
	},

	choose(e) {
		const self = this;
		const index = api.getDataSet(e, 'index');
		if (self.data.mainData[index].isSelect) {
			self.data.mainData[index].isSelect = false;
		} else {
			self.data.mainData[index].isSelect = true;
		};
		api.setStorageArray('peopleData', self.data.mainData[index], 'id', 999);
		self.setData({
			web_mainData: self.data.mainData
		});
	},
	
	
	deletePeople(e) {
		const self = this;
		var index = api.getDataSet(e,'index');
		const postData = {};
		postData.header = {
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization':wx.getStorageSync('token')
		};
		postData.url = 'http://yapi.lxbtrip.cn/mock/19/odr/v1/people/'+self.data.mainData[index].id
		const callback = (data) => {
			if (data) {
				if(data.code==200){
					
					
					api.delStorageArray('peopleData',self.data.mainData[index],'index');
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}
				self.setData({
					web_mainData: self.data.mainData
				});
			};
		};
		api.deletePeople(postData, callback);
	},
	
	

	add() {
		const self = this;
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
	},



	intoAdd(e) {
		const self = this;
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
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
