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
		mainData:[],
		search:{
			keyword:''
		}
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
	
		self.getMainData();

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
			api.clearPageIndex(self)
		};
		const postData = {
			'Authorization':wx.getStorageSync('token')
		};
		if(self.data.search.keyword!=''){
			postData.keyword =self.data.search.keyword
		};
		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData.push.apply(self.data.mainData,res.content.list.list)
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.recommendProduct(postData, callback);
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
