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
			typeId: '',
			accountId:''
		},
		
	},

	onLoad(options) {
		const self = this;
		self.getMainData()
		self.setData({
			web_submitData:self.data.submitData,
		})
	},

	changeType(e) {
		const self = this;
		console.log(e)
		var type = api.getDataSet(e, 'type');
		if (self.data.submitData.typeId != type) {
			self.data.submitData.typeId = type;
			self.setData({
				web_submitData: self.data.submitData
			})
		}
	},
	
	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			header:{
				'Authorization':wx.getStorageSync('token')
			}
		};
		const callback = (res) => {
			if(res.code==200){
				self.data.mainData = res.content;
				self.data.submitData.accountId = res.content.accounts[0].id
			}
			self.setData({
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.withdrawInfo(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self, false);

		const pass = api.checkComplete(self.data.submitData);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
			self.withdraw();
			
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	withdraw() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)
		postData.header={
			
			'Authorization':wx.getStorageSync('token'),
			'Content-Type':'application/x-www-form-urlencoded'
		};
		const callback = (res) => {
			api.buttonCanClick(self, true);
			self.data.submitData = {
				price:'',
				typeId:''
			}
			api.showToast(res.message,'none')
			
		};
		api.withdraw(postData, callback);
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
