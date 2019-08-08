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
		week: ['日', '一', '二', '三', '四', '五', '六'],
		day: [{}, {}, {}, {
				days: 1
			}, {
				days: 2
			}, {
				days: 3
			}, {
				days: 4
			}, {
				days: 5
			}, {
				days: 6
			}, {
				days: 7
			}, {
				days: 8
			}, {
				days: 9
			}, {
				days: 10
			}, {
				days: 11
			}, {
				days: 12
			}, {
				days: 13
			}, {
				days: 14
			}, {
				days: 15
			},
			{
				days: 16
			}, {
				days: 17
			}, {
				days: 18
			}, {
				days: 19
			}, {
				days: 20
			}, {
				days: 21
			}, {
				days: 22
			}, {
				days: 23
			}, {
				days: 24
			}, {
				days: 25
			}, {
				days: 26
			}, {
				days: 27
			}, {
				days: 28
			}, {
				days: 29
			}, {
				days: 30
			}
		]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.data.classifyId = options.classifyId;
		self.getMainData()
	},

	getMainData() {
		const self = this;
		
		const postData = {
			'Authorization': wx.getStorageSync('token'),
			classifyId:self.data.id,
			url:'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/+self.data.id'+self.data.id+'/prices'
		};
		
		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData.push.apply(self.data.mainData, res.content.list.prices)
			}
			self.setData({
				web_mainData: self.data.mainData
			})
		
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.datePrice(postData, callback);
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)

	},

	tab(e) {
		const self = this;
		api.buttonCanClick(self);
		var currentId = api.getDataSet(e, 'id');
		if (currentId == 0) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['招生政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		} else if (currentId == 1) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['批次录取政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		} else if (currentId == 2) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['加分政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		}
		self.setData({
			currentId: api.getDataSet(e, 'id')
		});
		self.getMainData(true);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
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
