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
		cardData:[{key:'身份证',value:101},{key:'护照',value:102},{key:'军官证',value:103},{key:'学生证',value:104},{key:'老年证',value:105},{key:'台湾通行证',value:106},
		{key:'港澳通行证',value:107}],
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
			cards: [{
				cardType:'',
				cardNo:'',
				cardValidity:'',
				cardPaths:''
			}],			
			id: ''
		},
		cardName:{
			101:'身份证',
			102:'护照',
			103:'军官证',
			104:'学生证',
			105:'老年证',
			106:'台湾通行证',
			107:'港澳通行证',			
		},
		region: '',


	},
	
	

	onLoad(options) {
		const self = this;
		self.setData({
			web_region:self.data.region,
			web_submitData:self.data.submitData,
			web_cardName:self.data.cardName
		})
	},
	
	onShow(){
		const self = this;
		self.data.submitData.tags=api.getStorageArray('labelData')[0].join(',');
		self.data.tagData = self.data.submitData.tags.split(',');
		self.setData({
			web_tagData:self.data.tagData
		})
	},
	
	changeCard(e){
		const self = this;
		var value = self.data.cardData[e.detail.value].value;
		var index = api.getDataSet(e,'index');
		self.data.submitData.cards[index]['cardType'] = value;
		self.setData({
			web_submitData:self.data.submitData
		})
		
	},
	
	dateChangeTwo(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.submitData.cards[index].cardValidity = e.detail.value;
		self.setData({
			web_submitData:self.data.submitData
		})
	},
	
	upLoadImg(e) {
		const self = this;
		var index = api.getDataSet(e,'index');
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			if (res.result == '0') {
				var url = res.fullPath;
				
				self.data.submitData.cards[index].cardPaths = url;
				self.setData({
					web_submitData:self.data.submitData
				});
				wx.hideLoading()
			} else {
				api.showToast(res.msg, 'none')
			}
	
		};
	
		wx.chooseImage({
			count: 1,
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;
				api.uploadFile(tempFilePaths[0], 'file', {
					classify: 'T019',
					rwidth: 150,
					rheight: 150,
					file: tempFilePaths[0],
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},


	addPaper(){
		const self = this;
		self.data.submitData.cards.push({
			cardType:'',
			cardNo:'',
			cardValidity:'',
			cardPaths:''
		});
		self.setData({
			web_submitData:self.data.submitData
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
	},
	
	sexChange(e){
		const self = this;
		var index = e.detail.value;
		self.data.submitData.sex = self.data.levelData[e.detail.value];
		self.setData({
			web_submitData:self.data.submitData,
			web_sexIndex:index
		})
	},
	
	dateChange(e){
		const self = this;
		self.data.submitData.birth = e.detail.value;
		self.setData({
			web_submitData:self.data.submitData
		})
	},
	
	cardInputChange(e){
		const self = this;
		console.log(e);
		var index = api.getDataSet(e,'index');
		self.data.submitData.cards[index][api.getDataSet(e,'key')] = e.detail.value;
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	bindRegionChange(e) {
		const self = this;
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
					wx.removeStorageSync('labelData')
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
