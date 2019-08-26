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
		mainData:[],
		search:{
			keyword:''
		},
		isFirstLoadAllStandard:['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
		self.setData({
			web_search:self.data.search
		})
	},

	getMainData(){
		const self = this;
		if(wx.getStorageSync('historySearch')){
			self.data.mainData = wx.getStorageSync('historySearch');
		};
		self.setData({
			web_mainData:self.data.mainData
		})
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		console.log(self.data.mainData);
	},

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		self.setData({
			web_search: self.data.search,
		});
	},
	
	deleteInput(){
		const self = this;
		self.data.search.keyword = '';
		self.setData({
			web_search: self.data.search,
		});
	},
	
	goSearch(){
		const self = this;
		
		if(self.data.search.keyword!=''){
			api.pathTo('/pages/productList/productList?keyword='+self.data.search.keyword,'nav')
		}else{
			api.showToast('请输入关键词','none')
		}
		var position = self.data.mainData.indexOf(self.data.search.keyword);
		if(position>=0){
		  
			
		}else{
		  self.data.mainData.push(self.data.search.keyword);
		};	
		wx.setStorageSync('historySearch',self.data.mainData);
	},
	
	choose(e){
		const self = this;
		var key = api.getDataSet(e,'item');
		api.pathTo('/pages/productList/productList?keyword='+key,'nav')
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
