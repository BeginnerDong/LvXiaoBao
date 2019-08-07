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
		show: false,
		provinces:[],
		mainData:[]
	},

	onLoad(options) {
		const self = this;	
		api.commonInit(self);

		self.getMainData();
		self.setData({
			web_show: self.data.show
		})
	},

	getMainData() {
		const self = this;
		const postData = {

		};
		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData.push.apply(self.data.mainData,res.content.list)
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.supperProvince(postData, callback);
	},
	
	supperProvinceUpdate() {
		const self = this;
		const postData = {
			provinces:self.data.provinces
		};
		const callback = (res) => {
			
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.supperProvinceUpdate(postData, callback);
	},

	select(e) {
		const self = this;
		
		var index = api.getDataSet(e,'index');
		var text = self.data.mainData[index];
		var position = self.data.provinces.indexOf(text);
		if (position >= 0) {
			self.data.provinces.splice(position, 1);
		} else {
			self.data.provinces.push(text);
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
