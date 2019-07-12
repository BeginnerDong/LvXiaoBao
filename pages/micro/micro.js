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
		submitData: {
			phone: '',
			code: ''
		}
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
				self.data.mainData = res.content
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.myInfo(postData, callback);
	},

	bind() {
		const self = this;
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
	},

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	bindPhone() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)

		const callback = (res) => {
			if(res.code==200){
				api.showToast(res.message, 'none');
				self.bind();
			}else{
				api.showToast(res.errmsg, 'none')
			}
			

		};
		api.bindPhone(postData, callback);
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
