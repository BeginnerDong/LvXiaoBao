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
		mainData:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_type:self.data.type
		});
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			header:{
				'Authorization': wx.getStorageSync('token'),
			},
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
		};
		
		postData.type = self.data.type;
		const callback = (res) => {
			api.buttonCanClick(self,true);
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
		api.coupons(postData, callback);
	},
	
	changeType(e){
		const self = this;
		api.buttonCanClick(self);
		var type = api.getDataSet(e,'type');
		if(self.data.type!=type){
			self.data.type=type;
			self.setData({
				web_type:self.data.type
			});
			self.getMainData(true)
		}
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
