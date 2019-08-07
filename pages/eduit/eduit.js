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
			name:'',
			sex:'',
			birth:'',
			phone:'',
			cdtype:'',
			card:'',
			orderType:101
		},
		cardData:[{key:'身份证',value:101},{key:'护照',value:102},{key:'军官证',value:103},{key:'学生证',value:104},{key:'老年证',value:105},{key:'台湾通行证',value:106},
		{key:'港澳通行证',value:107}],
		sexData:[{key:'男',value:101},{key:'女',value:102},{key:'保密',value:103}]
	},

	onLoad(options) {
		const self = this;
	

	},

	cardChange(e){
		const self = this;
		var index = e.detail.value;
		self.data.submitData.cdtype = self.data.cardData[index].value;
		self.setData({
			web_index:index,
			web_submitData:self.data.submitData
		})
	},
	
	
	sexChange(e){
		const self = this;
		var index = e.detail.value;
		self.data.submitData.sex = self.data.sexData[index].value;
		self.setData({
			web_index1:index,
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

	birthChange(e) {
		const self = this;
		console.log(e)
		self.data.submitData.birth = e.detail.value;
		self.setData({
			web_submitData:self.data.submitData
		})
	},


	addPeople() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData);
		postData.header = {
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization':wx.getStorageSync('token')
		};
		const callback = (data) => {
			if (data) {
				if(data.content.id){
					self.data.submitData.id = data.content.id;
					self.data.submitData.isSelect = false;
					self.data.submitData.isBx = false;
					api.setStorageArray('peopleData',self.data.submitData,'id',999);
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}
			
			};


		};
		api.addPeople(postData, callback);
	},


	submit() {
		const self = this;

		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
			self.addPeople()
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
