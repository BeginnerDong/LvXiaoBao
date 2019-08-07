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
		postData:{}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.postData = {
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
		};			
		if(options.code){
			self.data.postData.lineTheme = options.code
		};
		if(options.keyword){
			self.data.postData.keyword = options.keyword
		};
		if(options.lineCategory){
			self.data.postData.lineCategory = options.lineCategory
		};
		self.getMainData()
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = api.cloneForm(self.data.postData)
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
			console.log('getMainData', self.data.mainData)
		};
		api.mshopProducts(postData, callback);
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
