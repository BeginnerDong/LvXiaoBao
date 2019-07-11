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
		isFirstLoadAllStandard:['getMainData'],
		num:1,
		selectIndex:0,
		show_poster:false,
		submitData:{
			name:'',
			aliasName:'',
			grade:'',
			phone:'',
			otherPhone:'',
			sex:'',
			age:'',
			birth:'',
			country:'',
			province:'',
			city:'',
			district:'',
			address:'',
			tags:'',
			isBlacklist:'',
			isCredit:'',
			cards:[],
			id:''
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.submitData.id = options.id;
		self.getMainData();
		self.setData({
			web_num:self.data.num,
			show_poster:self.data.showPoster,
			web_selectIndex:self.data.selectIndex
		})
	},

	getMainData() {
		const self = this;
		const postData = {	
			
		};
		
		const callback = (res) => {
			if(res.code==200){
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
			}
			self.setData({
				web_submitData:self.data.submitData,
				web_mainData:self.data.mainData
			})
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.travelerDetail(postData, callback);
	},
	
	showPoster(){
		const self = this;
		self.data.show_poster = !self.data.show_poster;
		self.setData({
			show_poster:self.data.show_poster
		})
	},

	changeIndex(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		if(self.data.selectIndex!=index){
			self.data.selectIndex = index;
			self.setData({
				web_selectIndex:self.data.selectIndex
			})
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
