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
		show:false,
		num:0,
		
		submitData:{
			keyword:'',
			peopleName:'',
			ssp:'',
			esp:'',
		},
		week:['天','一','二','三','四','五','六'],
		selectStateOne:[],
		selectStateTwo:[],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_selectStateTwo:self.data.selectStateTwo,
			web_selectStateOne:self.data.selectStateOne,
			web_show:self.data.show
		})
	},
	
	changeSsp(e){
		const self = this;
		self.data.submitData.ssp = api.getDataSet(e,'value');
		self.setData({
			web_submitData:self.data.submitData
		})
	},
	
	isShow(e){
		const self = this;
		self.data.index = api.getDataSet(e,'index');
		
		self.data.show = !self.data.show;
		self.setData({
			web_index:self.data.index,
			web_show:self.data.show
		})
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			number:api.cloneForm(self.data.number),
			size:api.cloneForm(self.data.size),
			header:{
				'Authorization':wx.getStorageSync('token')
			}
		};
		if(self.data.selectStateOne.length>0){
			postData.stateOne = self.data.selectStateOne
		};
		if(self.data.selectStateTwo.length>0){
			postData.stateTwo = self.data.selectStateTwo
		};
		if(self.data.submitData.ssp!=''){
			postData.ssp = self.data.submitData.ssp
		};
		if(self.data.submitData.esp!=''){
			postData.esp = self.data.submitData.esp
		};
		if(self.data.submitData.peopleName!=''){
			postData.peopleName = self.data.submitData.peopleName
		};
		if(self.data.submitData.keyword!=''){
			postData.keyword = self.data.submitData.keyword
		};
		const callback = (res) => {
			if(res.content.list.length>0){
				self.data.mainData.push.apply(self.data.mainData,res.content.list);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].startDate = self.data.mainData[i].startDate.substring(5);
					self.data.mainData[i].endDate = self.data.mainData[i].endDate.substring(5);
					self.data.mainData[i].startWeek = self.data.week[new Date(self.data.mainData[i].startDate).getDay()];
					self.data.mainData[i].endWeek = self.data.week[new Date(self.data.mainData[i].endDate).getDay()]
				}
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.order(postData, callback);
	},
	
	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	confirmSelect(){
		const self = this;
		self.data.show = false;
		
		self.setData({
			web_show: self.data.show
		})
		self.getMainData(true)
	},
	
	installSelect(){
		const self = this;
		self.data.selectStateOne =[];
		self.data.selectStateTwo=[];
		self.data.submitData={
			keyword:'',
			peopleName:'',
			ssp:'',
			esp:'',
		},
		self.setData({
			web_selectStateOne:self.data.selectStateOne,
			web_selectStateTwo:self.data.selectStateTwo,
			web_submitData:self.data.submitData,
			web_show: self.data.show
		})
	},
	
	
	selectStateOne(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectStateOne.indexOf(key);
		if(position>=0){
		  self.data.selectStateOne.splice(position, 1);
		}else{
		  self.data.selectStateOne.push(key);	  
		};	
		console.log(self.data.selectStateOne)
		self.setData({
			
		   web_selectStateOne:self.data.selectStateOne
		});
	},
	
	selectStateTwo(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectStateTwo.indexOf(key);
		if(position>=0){
		  self.data.selectStateTwo.splice(position, 1);
		}else{
		  self.data.selectStateTwo.push(key);
		};	
		console.log(self.data.selectStateTwo)
		self.setData({		
		   web_selectStateTwo:self.data.selectStateTwo
		});
	},
	
	menuClick: function(e) {
		const self = this;
		api.buttonCanClick(self);
		const num = e.currentTarget.dataset.num;
		self.changeSearch(num);
	},
	
	changeSearch(num) {
		const self = this;
		this.setData({
			num: num
		});
		self.data.searchItem = {}
		if (num == '0') {
	
		} else if (num == '1') {
			self.data.stateOne = '101';
		} else if (num == '2') {
			self.data.stateOne = '102';	
		} else if (num == '3') {
			self.data.stateTwo = '108';
		} 
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
	},

	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.number++;
			self.getMainData();
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
