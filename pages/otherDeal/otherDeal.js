
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

		submitData:{
			content:''
		},
		disabled:true
	},

	onLoad(options) {
		const self = this;
		self.data.submitData.content = wx.getStorageSync('otherDeal');
		self.setData({
			web_disabled:self.data.disabled,
			web_submitData:self.data.submitData
		})
	},

	edit(){
		const self = this;
		console.log(111)
		self.data.disabled = false;
		self.setData({
			web_disabled:self.data.disabled
		})
	},

	save(){
		const self = this;
		wx.setStorageSync('otherDeal',self.data.submitData.content);
		wx.navigateBack({
			delta: 1
		})
	},




	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
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
