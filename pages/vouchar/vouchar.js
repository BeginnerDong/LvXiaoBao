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
		type: 0,
		mainData: [],
		submitData: {
			price: '',
			type: ''
		},
		buttonCanClick: true
	},

	onLoad(options) {
		const self = this;
	
		self.setData({
			web_submitData:self.data.submitData,
			web_buttonCanClick:self.data.buttonCanClick
		})
	},

	changeType(e) {
		const self = this;
		var type = api.getDataSet(e, 'type');
		if (self.data.submitData.type != type) {
			self.data.submitData.type = type;
			self.setData({
				web_submitData: self.data.submitData
			})
		}
	},

	submit() {
		const self = this;
		api.buttonCanClick(self, false);
		const pass = api.checkComplete(self.data.submitData);
		if (pass) {
			self.pay()
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	pay() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)

		const callback = (res) => {
			api.showToast(res.message,'none')
			api.buttonCanClick(self, true);
		};
		api.walletRecharge(postData, callback);
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
