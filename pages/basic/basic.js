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
		isFirstLoadAllStandard: ['getMainData','travelRecord'],
		num: 1,
		selectIndex: 0,
		show_poster: false,
		levelData: [{
			name: '一级',
			value: 1
		}, {
			name: '二级',
			value: 2
		}, {
			name: '三级',
			value: 3
		}, {
			name: '四级',
			value: 4
		}],
		sexData: [{
			name: '男',
			value: 1
		}, {
			name: '女',
			value: 2
		}],
		cardData:[{key:'身份证',value:101},{key:'护照',value:102},{key:'军官证',value:103},{key:'学生证',value:104},{key:'老年证',value:105},{key:'台湾通行证',value:106},
		{key:'港澳通行证',value:107}],
		monthData:['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
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
		cardName:{
			101:'身份证',
			102:'护照',
			103:'军官证',
			104:'学生证',
			105:'老年证',
			106:'台湾通行证',
			107:'港澳通行证',			
		},
		region: ['陕西省', '西安市', '雁塔区'],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.submitData.id = options.id;
		self.getMainData();
		self.travelRecord();
		self.setData({
			web_cardName:self.data.cardName,
			web_num: self.data.num,
			show_poster: self.data.showPoster,
			web_selectIndex: self.data.selectIndex
		})
	},
	onShow(){
		const self = this;
		if(api.getStorageArray('labelData')){
			self.data.tagData = api.getStorageArray('labelData');
		
			self.setData({
				web_tagData:self.data.tagData[0]
			})
		}
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
			console.log('res', res)
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
	
	bindRegionChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.region = e.detail.value.join('');
		self.data.submitData.province = e.detail.value[0];
		self.data.submitData.city = e.detail.value[1];
		self.data.submitData.district = e.detail.value[2];
		this.setData({
			web_submitData: self.data.submitData
		})
	},
	
	
	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	changeNum(e) {
		const self = this;
		var num = api.getDataSet(e, 'num');
		if (self.data.num != num) {
			self.data.num = num;
			self.setData({
				web_num: self.data.num
			})
		}
	},

	getMainData() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			url: 'http://yapi.lxbtrip.cn/mock/19/own/v1/traveler/' + self.data.submitData.id
		}

		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData = res.content;
				self.data.submitData.name = self.data.mainData.name;
				self.data.submitData.aliasName = self.data.mainData.aliasName;
				self.data.submitData.grade = self.data.mainData.grade;
				self.data.submitData.phone = self.data.mainData.phone;
				self.data.submitData.otherPhone = self.data.mainData.otherPhone;
				self.data.submitData.sex = self.data.mainData.sex;
				self.data.submitData.age = self.data.mainData.age;
				self.data.submitData.birth = self.data.mainData.birth;
				self.data.submitData.country = self.data.mainData.country;
				self.data.submitData.province = self.data.mainData.province;
				self.data.submitData.city = self.data.mainData.city;
				self.data.submitData.district = self.data.mainData.district;
				self.data.submitData.address = self.data.mainData.address;
				self.data.submitData.tags = self.data.mainData.tags;
				self.data.submitData.isBlacklist = self.data.mainData.isBlacklist;
				self.data.submitData.isCredit = self.data.mainData.isCredit;
				self.data.submitData.cards = self.data.mainData.cards;
				self.data.tagData = self.data.submitData.tags.split(',');
				/* for (var i = 0; i < self.data.submitData.cards.length; i++) {
					for (var j = 0; j < Things.length; j++) {
						if(self.data.submitData.cards[i].)
					}					
				} */
			}
			self.setData({
				web_cardName:self.data.cardName,
				web_tagData:self.data.tagData,
				web_index1:self.data.mainData.sex -1,
				web_index:self.data.mainData.grade-1,
				web_submitData: self.data.submitData,
				web_mainData: self.data.mainData
			})
			api.setStorageArray('labelData', self.data.tagData, 'id', 999);
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.travelerDetail(postData, callback);
	},


	travelRecord() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			url: 'http://yapi.lxbtrip.cn/mock/19/own/v1/traveler/'+self.data.submitData.id+'/travel-record',
		}
		const callback = (res) => {
			if (res.code == 200) {
				self.data.recordData = res.content
				for (var i = 0; i <self.data.recordData.list.length; i++) {
					self.data.recordData.list[i].year = self.data.recordData.list[i].goonDate.substring(0,4);
					self.data.recordData.list[i].month = self.data.monthData[parseInt(self.data.recordData.list[i].goonDate.substring(5,7))-1];
					self.data.recordData.list[i].day = self.data.recordData.list[i].goonDate.substring(8,10);
				}
			}
			self.setData({
				web_recordData:self.data.recordData
			})
			
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'travelRecord', self);
		
		};
		api.travelRecord(postData, callback);
	},


	travelerDetailUpdate() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData);
		postData.header = {
			'Authorization': wx.getStorageSync('token')
		};
		postData.url = 'http://yapi.lxbtrip.cn/mock/19/own/v1/traveler/' + self.data.submitData.id;
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
		api.travelerDetailUpdate(postData, callback);
	},
	
	
	submit() {
		const self = this;
	
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
			self.travelerDetailUpdate()
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
