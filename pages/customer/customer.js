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
		levelData:[{name:'一级',value:1},{name:'二级',value:2},{name:'三级',value:3},{name:'四级',value:4}],
		sexData:['男','女'],
		submitData: {
			name: '',
			aliasName: '',
			grade: '',
			phone: '',
			otherPhone: '',
			sex: '',
			age: '',
			birth: '',
			country: '',
			province: '',
			city: '',
			district: '',
			address: '',
			tags: '',
			isBlacklist: '',
			isCredit: '',
			cards: [],
			id: ''
		},
		region: '',
	},

	onLoad(options) {
		const self = this;
		self.setData({
			web_region:self.data.region
		})

	},
	
	levelChange(e){
		const self = this;
		var index = e.detail.value;
		self.data.submitData.grade = self.data.levelData[e.detail.value].value;
		self.setData({
			web_submitData:self.data.submitData,
			web_index:index
		})
		console.log(self.data.submitData)
	},
	
	sexChange(e){
		const self = this;
		var index = e.detail.value;
		self.data.submitData.sex = self.data.levelData[e.detail.value];
		self.setData({
			web_submitData:self.data.submitData,
			web_sexIndex:index
		})
		console.log(self.data.submitData)
	},
	
	dateChange(e){
		const self = this;
		self.data.submitData.birth = e.detail.value;
		self.setData({
			web_submitData:self.data.submitData
		})
	},

	bindRegionChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.region = e.detail.value.join('');
		self.data.submitData.province = e.detail.value[0];
		self.data.submitData.city = e.detail.value[1];
		self.data.submitData.district = e.detail.value[2];
		this.setData({
			web_region: self.data.region
		})
	},


	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},




	addTraveler() {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data) {

				api.dealRes(data);
				if (data.solely_code == 100000) {
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}
			};


		};
		api.addTraveler(postData, callback);
	},


	submit() {
		const self = this;

		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
			self.addTraveler()
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
