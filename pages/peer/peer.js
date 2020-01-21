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
		show: false,
		businessType:'',
		num:0,
		businessClassifys:[],
		provinces:[],
		selectBusinessData:[],
		selectProvinceData:[],
		selectSignData:[],
		search:{
			keyword:''
		}
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_selectBusinessData:self.data.selectBusinessData,
			web_selectProvinceData:self.data.selectProvinceData,
			web_selectSignData:self.data.selectSignData,
			web_show: self.data.show
		})
	},

	isShow() {
		const self = this;
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
	},
	
	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		self.setData({
			web_search: self.data.search,
		});
	},
	
	goSearch(){
		const self = this;
		if(self.data.search.keyword!=''){
			self.getMainData(true)
		}else{
			api.showToast('请输入关键词搜索','none')
		}
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {
			number: api.cloneForm(self.data.number),
			size: api.cloneForm(self.data.size),
			header:{
				'Authorization':wx.getStorageSync('token')
			}
		};
		if(self.data.businessType!=''){
			postData.businessType = self.data.businessType
		};
		if(self.data.selectBusinessData.length>0){
			postData.businessClassify =self.data.selectBusinessData 
		};
		if(self.data.selectProvinceData.length>0){
			postData.province =self.data.selectProvinceData 
		};
		if(self.data.selectSignData.length>0){
			postData.province =self.data.selectSignData 
		};
		if(self.data.search.keyword!=''){
			postData.keyword =self.data.search.keyword
		};
		const callback = (res) => {
			if (res.content.list.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.content.list);
				self.data.businessClassifys = res.content.businessClassifys;
				self.data.provinces = res.content.provinces;
			} else {
				self.data.isLoadAll = true
			};
			self.setData({
				web_businessClassifys:self.data.businessClassifys,
				web_provinces:self.data.provinces,
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.suppliers(postData, callback);
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
		self.data.selectBusinessData =[];
		self.data.selectProvinceData=[];
		self.data.selectSignData =[];
		self.setData({
			web_selectBusinessData:self.data.selectBusinessData,
			web_selectProvinceData:self.data.selectProvinceData,
			web_selectSignData:self.data.selectSignData,
			web_show: self.data.show
		})
	},
	
	selectBusiness(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectBusinessData.indexOf(key);
		if(position>=0){
		  self.data.selectBusinessData.splice(position, 1);	
		}else{
		  self.data.selectBusinessData.push(key);
		  
		};	
		self.setData({
			web_businessClassifys:self.data.businessClassifys,
		    web_selectBusinessData:self.data.selectBusinessData
		});
	},
	
	selectProvince(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectProvinceData.indexOf(key);
		if(position>=0){
		  self.data.selectProvinceData.splice(position, 1);
		}else{
		  self.data.selectProvinceData.push(key);
		};	
		self.setData({
		   web_selectProvinceData:self.data.selectProvinceData
		});
	},
	
	selectSign(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectSignData.indexOf(key);
		if(position>=0){
		  self.data.selectSignData.splice(position, 1);
		}else{
		  self.data.selectSignData.push(key);
		};	
		self.setData({
		   web_selectSignData:self.data.selectSignData
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
			delete self.data.businessType
		} else if (num == '1') {
			self.data.businessType = '101';
	
		} else if (num == '2') {
			self.data.businessType = '102';
		
		} else if (num == '3') {
			self.data.businessType = '103';
		} 
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
	},
	


	supplierGood() {
		const self = this;
		const postData = {
			header:{
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization':wx.getStorageSync('token')
			}
		};

		const callback = (res) => {
			if(res.code==200){
				self.getMainData(true)
			}else{
				api.showToast(res.message,'none')
			}
		
		};
		api.supplierGood(postData, callback);
	},
	
	supplierLike() {
		const self = this;
		const postData = {
			header:{
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization':wx.getStorageSync('token')
			}
		};
		const callback = (res) => {
			if(res.code==200){
				self.getMainData(true)
			}else{
				api.showToast(res.message,'none')
			}
		
		};
		api.supplierLike(postData, callback);
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
