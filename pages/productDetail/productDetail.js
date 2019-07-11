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
		bannerImg:[],
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,
		selectIndex:0
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData();
		self.setData({
			web_selectIndex:self.data.selectIndex
		})
	},

	getMainData() {
		const self = this;
		const postData = {	
			id:1,
			pId:self.data.id,
		};
		
		const callback = (res) => {
			if(res.code==200){
				self.data.mainData = res.content,
				self.data.bannerImg = [res.content.bannerImg1,res.content.bannerImg2,res.content.bannerImg3,res.content.bannerImg4,res.content.bannerImg5]
			}
			self.setData({
				web_bannerImg:self.data.bannerImg,
				web_mainData:self.data.mainData
			})
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.mshopProductsDetail(postData, callback);
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
