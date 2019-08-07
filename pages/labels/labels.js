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
		labelData:[],
		submitData:{
			name:''
		}
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
		self.data.mainData = api.getStorageArray('labelData');
		console.log(self.data.mainData)
		self.setData({
			web_mainData:self.data.mainData
		})
	},
	

	
	
	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	


	getMainData() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
		}
		const callback = (res) => {
			if (res.code == 200) {
				self.data.labelData = res.content.list
			}
			self.setData({
				web_labelData:self.data.labelData
			})
			
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		
		};
		api.labels(postData, callback);
	},
	
	labelAdd() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token'),
				'Content-Type':'application/x-www-form-urlencoded'
			},
			name:self.data.submitData.name
		};
		const callback = (res) => {
			if (res.code == 200) {
				self.data.labelData.push({labelName:self.data.submitData.name});
				self.data.submitData.name = ''
			}
			self.setData({
				web_submitData:self.data.submitData,
				web_labelData:self.data.labelData
			})
			console.log(self.data.labelData)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);	
		};
		api.labelAdd(postData, callback);
	},

	select(e){
		const self = this;
		var name = api.getDataSet(e,'name');
		var position = self.data.mainData[0].indexOf(name);
		if(position >= 0){			
			self.data.mainData[0].splice(position, 1);					
		}else{
			self.data.mainData[0].push(name);		
		}
		console.log(self.data.mainData[0])
		self.setData({
			web_mainData:self.data.mainData
		})
	},
	
	confirm(){
		const self = this;
		
		api.setStorageArray('labelData', self.data.mainData[0], 'id', 999);
		api.getStorageArray('labelData')
		wx.navigateBack({
			delta: 1
		})
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
