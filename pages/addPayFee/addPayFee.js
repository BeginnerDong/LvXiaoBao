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

		submitData: {
			repDate:'',
			repType:102,
			repAddress:'',
			repItem:'',
			repFee:'',
			repDuration:'',
			otherExplain:''
		},
		
	},

	onLoad(options) {
		const self = this;
		self.data.mainData = wx.getStorageSync('payFee');
		if(!self.data.mainData){
			self.data.mainData = []
		}
		if(options.index){
			self.data.index = options.index,
			self.data.submitData.repDate = self.data.mainData[self.data.index].repDate,
			self.data.submitData.repAddress = self.data.mainData[self.data.index].repAddress,
			self.data.submitData.repItem = self.data.mainData[self.data.index].repItem,
			self.data.submitData.repFee = self.data.mainData[self.data.index].repFee,
			self.data.submitData.repDuration = self.data.mainData[self.data.index].repDuration,
			self.data.submitData.otherExplain = self.data.mainData[self.data.index].otherExplain
		};
		self.setData({
			web_submitData:self.data.submitData
		})
		console.log(self.data.mainData)
	},

	dateChange(e) {
		const self = this;
		console.log(e)
		self.data.submitData.repDate = e.detail.value;
		self.setData({
			web_submitData:self.data.submitData
		})
	},


	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	updateShopping(){
		const self = this;
		self.data.mainData[self.data.index].repDate = self.data.submitData.repDate;
		self.data.mainData[self.data.index].repAddress =self.data.submitData.repAddress,
		self.data.mainData[self.data.index].repItem =self.data.submitData.repItem,
		self.data.mainData[self.data.index].repFee =self.data.submitData.repFee,
		self.data.mainData[self.data.index].repDuration =self.data.submitData.repDuration,
		self.data.mainData[self.data.index].otherExplain =self.data.submitData.otherExplain
		
		wx.setStorageSync('payFee',self.data.mainData);
		setTimeout(function() {
			wx.navigateBack({
				delta: 1
			});
		}, 300);
	},

	addShopping() {
		const self = this;
		self.data.mainData.push(self.data.submitData);
		
		wx.setStorageSync('payFee',self.data.mainData);
		setTimeout(function() {
			wx.navigateBack({
				delta: 1
			});
		}, 300);
	},


	submit() {
		const self = this;
		const pass = api.checkComplete(self.data.submitData);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
			if(self.data.index){
				self.updateShopping()
			}else{
				self.addShopping()
			}
			
		} else {

			api.showToast('请补全信息', 'none');

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
