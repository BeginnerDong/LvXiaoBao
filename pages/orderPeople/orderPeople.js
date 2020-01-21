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
		self.data.mainData = wx.getStorageSync('orderPeople');
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
