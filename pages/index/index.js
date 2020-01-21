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
		isFirstLoadAllStandard: ['getShopInfo', 'getHotShop', 'getMainData'],
		show: false,
		hotShopData: [],
		postData: {

		},
		mainData: [],
		search: {
			keyword: ''
		},

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.postData = {
			number: api.cloneForm(self.data.number),
			size: api.cloneForm(self.data.size),
			lineCategory: 101
		};
		self.setData({
			web_postData: self.data.postData
		});
		self.getHotShop();
		self.getShopInfo();
		self.getMainData()

	},

	changeClassify(e) {
		const self = this;
		var type = api.getDataSet(e, 'key');
		if (self.data.postData.businessClassify != type) {
			self.data.postData.businessClassify = type
			self.setData({
				web_businessClassifys: self.data.postData.businessClassify
			});
			self.getMainData(true)
		};

	},

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		self.setData({
			web_search: self.data.search,
		});
	},

	goSearch() {
		const self = this;
		api.pathTo('/pages/search/search', 'nav')
		/* if(self.data.search.keyword!=''){
			api.pathTo('/pages/productList/productList?keyword='+self.data.search.keyword,'nav')
		}else{
			api.pathTo('/pages/search/search','nav')
		} */
	},

	getHotShop() {
		const self = this;
		const postData = {
			number: 1,
			size: 4,
		};

		const callback = (res) => {
			if (res.content.list.length > 0) {
				self.data.hotShopData.push.apply(self.data.hotShopData, res.content.list)
			}
			self.setData({
				web_hotShopData: self.data.hotShopData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHotShop', self);

		};
		api.collectProducts(postData, callback);
	},

	getShopInfo() {
		const self = this;
		const postData = {
			url: 'http://yapi.lxbtrip.cn/mock/19/mshop/v1/1/info',
			header: {
				'Authorization': wx.getStorageSync('token')
			},
		};

		const callback = (res) => {
			if (res.code == 200) {
				self.data.shopData = res.content
			}
			self.setData({
				web_shopData: self.data.shopData
			})

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getShopInfo', self);

		};
		api.mshopInfo(postData, callback);
	},

	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.shopData.info.phone
		})
	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = api.cloneForm(self.data.postData)
		postData.url = 'http://yapi.lxbtrip.cn/mock/19/mshop/v1/1/products';
		const callback = (res) => {
			if (res.content.list.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.content.list);
				self.data.businessClassifys = res.content.businessClassifys
			} else {
				self.data.isLoadAll = true
			};
			self.setData({
				web_businessClassifys: self.data.businessClassifys,
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.mshopProducts(postData, callback);
	},

	changeCategory(e) {
		const self = this;
		var id = api.getDataSet(e, 'id');
		if (self.data.postData.lineCategory != id) {
			self.data.postData.lineCategory = id;
			self.setData({
				web_postData: self.data.postData
			});
			self.getMainData(true)
		}
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.number++;
			self.getMainData();
		};
	},



	/* 	onReachBottom() {
			const self = this;
			if (!self.data.isLoadAll && self.data.buttonCanClick) {
				self.data.paginate.currentPage++;
				self.getMainData();
			};
		}, */

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
