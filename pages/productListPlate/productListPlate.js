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
		mainDataPost:{
			
		},
		businessClassifys:[],
		standards:[],
		selectStandards:[],
		selectBusinessData:[],
		show1:false,
		price:{
			sto:'',
			eto:''
		},
		search:{
			keyword:''
		}
		
	},
	
	changeSsp(e){
		const self = this;
		self.data.price.sto = api.getDataSet(e,'sto');
		if(api.getDataSet(e,'eto')){
			self.data.price.eto = api.getDataSet(e,'eto');
		}else{
			self.data.price.eto =''
		};
		self.setData({
			web_price:self.data.price
		})
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.mainDataPost.number=api.cloneForm(self.data.number);
		self.data.mainDataPost.size=api.cloneForm(self.data.size);
		self.data.id = options.id;
		self.getMainData();
		self.setData({
			 web_selectStandards:self.data.selectStandards,
			web_selectBusinessData:self.data.selectBusinessData,
			web_show:self.data.show
		})
	},
	
	isShow(e){
		const self = this;	
		self.data.show = !self.data.show;
		if(self.data.show1){
			self.data.show1 =false;
		}
		
		self.setData({
			web_show1:self.data.show1,
			web_show:self.data.show
		})
	},
	
	isShow1(e){
		const self = this;	
		self.data.show1 = !self.data.show1;
		if(self.data.show){
			self.data.show =false;
		}
		self.setData({
			web_show1:self.data.show1,
			web_show:self.data.show
		})
	},
	
	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		self.setData({
			web_search: self.data.search,
		});
	},
	
	priceChange(e) {
		const self = this;
		api.fillChange(e, self, 'price');
		self.setData({
			web_price: self.data.price,
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
	
	supplierProductLike(e) {
		const self = this;
		var id = self.data.mainData[api.getDataSet(e,'index')].id;
		const postData = {
			header:{
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization':wx.getStorageSync('token')
			},
			url:'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/'+id+'/like'
		};
	
		const callback = (res) => {
			if(res.code==200){
				self.getMainData(true)
			}
		
		};
		api.supplierProductLike(postData, callback);
	},
	
	changeOrder(e){
		const self = this;	
		var orderNum = api.getDataSet(e,'key');
		if(self.data.mainDataPost.sortType!=orderNum){
			api.buttonCanClick(self)
			self.data.mainDataPost.sortType = orderNum;
			self.data.show1 =false;
			self.setData({
				web_show1:self.data.show1,
				orderNum:self.data.mainDataPost.sortType
			})
			self.getMainData(true);
		}
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
		   web_selectBusinessData:self.data.selectBusinessData
		});
	},
	
	selectStandards(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		var position = self.data.selectStandards.indexOf(key);
		if(position>=0){
		  self.data.selectStandards.splice(position, 1);			
		}else{
		  self.data.selectStandards.push(key);	  
		};		
		self.setData({
		   web_selectStandards:self.data.selectStandards
		});
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = api.cloneForm(self.data.mainDataPost);
		postData.url = 'http://yapi.lxbtrip.cn/mock/19/pdt/v1/supplier/'+self.data.id+'/products'
		postData.header = {
			'Authorization':wx.getStorageSync('token')
			
		};
		if(self.data.selectBusinessData.length>0){
			postData.businessClassify =self.data.selectBusinessData 
		};
		if(self.data.selectStandards.length>0){
			postData.standards =self.data.selectStandards 
		};
		if(self.data.price.sto!=''){
			postData.sto =self.data.price.sto 
		};
		if(self.data.price.eto!=''){
			postData.eto =self.data.price.eto 
		};
		if(self.data.search.keyword!=''){
			postData.keyword =self.data.search.keyword
		};
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if(res.content.list.length>0){
				self.data.mainData.push.apply(self.data.mainData,res.content.list);
				self.data.businessClassifys = res.content.businessClassifys;
				self.data.standards = res.content.standards;
			}else{
				self.data.isLoadAll = true
			};
			self.setData({
				web_standards:self.data.standards,
				web_businessClassifys:self.data.businessClassifys,
				web_mainData:self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.supplierProducts(postData, callback);
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
		self.data.price.sto = '',
		self.data.price.eto = '',
		self.setData({
			web_price:self.data.price,
			web_selectBusinessData:self.data.selectBusinessData,			
		})
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
