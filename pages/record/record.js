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
		type:101,
		mainData:[],
		num:0
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
			type:self.data.type,
			header:{
				'Authorization':wx.getStorageSync('token')
			}
		};
		
		const callback = (res) => {
			if(res.content.list.length>0){
				self.data.mainData.push.apply(self.data.mainData,res.content.list)
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.walletDeals(postData, callback);
	},
	
	menuClick(e) {
		const self = this;
		api.buttonCanClick(self);
		const num = e.currentTarget.dataset.num;
		self.changeSearch(num);
	},
	
	changeSearch(num) {
		const self = this;
		this.setData({
			num: num
		});
		self.data.searchItem = {}
		if (num == '0') {
			self.data.type = '101'
		} else if (num == '1') {
			self.data.type = '102';
	
		} else if (num == '2') {
			self.data.type = '105';
		
		} else if (num == '3') {
			self.data.type = '103';
		} else if (num == '4') {
			self.data.type = '106';
		} 
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
	},
	
	
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.number++;
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
