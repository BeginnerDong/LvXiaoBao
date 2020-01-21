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
		isComplete:false,
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
		sexData:[{key:'男',value:101},{key:'女',value:102},{key:'保密',value:103}],
		buttonCanClick:true
	},

	onLoad(options) {
		const self = this;
		self.data.mainData = api.getStorageArray('peopleData');
		if(!self.data.mainData){
			self.data.mainData = []
		}
		if(options.index){
			self.data.index = options.index;
			self.data.submitData.name = self.data.mainData[self.data.index].name;
			self.data.submitData.card = self.data.mainData[self.data.index].card;
			for (var i = 0; i < self.data.cardData.length; i++) {
				if(parseInt(self.data.mainData[self.data.index].cdtype)==self.data.cardData[i].value){
					console.log(22213)
					self.data.submitData.cdtype = self.data.cardData[i].value;
					self.setData({
						web_index:i
					})
				}
			};
			for (var i = 0; i < self.data.sexData.length; i++) {
				if(self.data.mainData[self.data.index].sex==self.data.sexData[i].value){
					self.data.submitData.sex = self.data.sexData[i].value;
					self.setData({
						web_index1:i
					})
				}
			};
			self.data.submitData.phone = self.data.mainData[self.data.index].phone;
			self.data.submitData.birth = self.data.mainData[self.data.index].birth;
			
		};
		self.setData({
			web_buttonCanClick:self.data.buttonCanClick,
			web_isComplete:self.data.isComplete,
			web_submitData:self.data.submitData
		})

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
		const pass = api.checkComplete(self.data.submitData);
		if(pass){
			self.data.isComplete = true
		}
		self.setData({
			web_isComplete:self.data.isComplete,
			web_submitData: self.data.submitData,
		});
	},

	birthChange(e) {
		const self = this;
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
					api.buttonCanClick(self,true);
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
	
	updatePeople() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData);
		postData.header = {
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization':wx.getStorageSync('token')
		};
		postData.url = 'http://yapi.lxbtrip.cn/mock/19/odr/v1/people/'+self.data.mainData[self.data.index].id
		const callback = (data) => {
			if (data) {
				if(data.content.id){
					api.buttonCanClick(self,true);
					api.setStorageArray('peopleData',self.data.mainData[self.data.index],'id',999);
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}
			
			};
		};
		api.updatePeople(postData, callback);
	},


	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		if (pass) {
			if(self.data.index){
				self.data.mainData[self.data.index].name=self.data.submitData.name;
				self.data.mainData[self.data.index].phone=self.data.submitData.phone;
				self.data.mainData[self.data.index].sex=self.data.submitData.sex;
				self.data.mainData[self.data.index].birth=self.data.submitData.birth;
				self.data.mainData[self.data.index].card=self.data.submitData.card;
				self.data.mainData[self.data.index].cdtype=self.data.submitData.cdtype;
				self.updatePeople()
			}else{
				self.addPeople()
			}
			
		} else {
			api.buttonCanClick(self,true);
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
