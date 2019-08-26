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
		bannerImg: [],
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,
		selectIndex: 0,
		show_poster: false,
		show_people: false,

		orderPost: {
			pdtId: '',
			classifyId: '',
			startDate: '',
			bills: [],
			reservationName: '',
			reservationPhone: '',
			reservationCompany: '',
			reservationAddress: '',
			remark: '1',
			peopleIds: [],
			coupons: [],
			saleId: '',
			saleName: '',
			salePhone: ''
		},
		dayData: {},
		subjectData: [],
		index:0
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData();
		self.setData({
			web_index:self.data.index,
			web_orderPost: self.data.orderPost,
			show_people: self.data.show_people,
			show_poster: self.data.show_poster,
			web_selectIndex: self.data.selectIndex
		})

	},
	
	change(e){
		const self = this;
		console.log(e)
		self.data.index = e.detail.current;
		self.setData({
			web_index:self.data.index
		})
	},
	
	
	onShow(){
		const self = this;
		if(wx.getStorageSync('selectSale')){
			self.data.mainData.sales[0] = wx.getStorageSync('selectSale');
			self.data.orderPost.saleId = self.data.mainData.sales[0].id;
			self.data.orderPost.saleName = self.data.mainData.sales[0].name;
			self.setData({
				web_mainData:self.data.mainData
			})
		}
		
	},

	getMainData() {
		const self = this;
		const postData = {
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			url: 'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/' + self.data.id
		};

		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData = res.content;
				self.data.bannerImg = [res.content.bannerImg1, res.content.bannerImg2, res.content.bannerImg3, res.content.bannerImg4,
					res.content.bannerImg5
				];
				self.data.orderPost.pdtId = self.data.mainData.id;
				self.data.orderPost.saleId = self.data.mainData.sales[0].id;
				self.data.orderPost.saleName = self.data.mainData.sales[0].name;
				self.data.orderPost.salePhone = self.data.mainData.sales[0].phone;
				self.data.orderPost.classifyId = self.data.mainData.classifys[0].id;
				api.setStorageArray('salesData', self.data.mainData.sales, 'id', 999);
			}
			self.setData({
				web_bannerImg: self.data.bannerImg,
				web_mainData: self.data.mainData
			})
			console.log(self.data.bannerImg)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.supplierpProductsDetail(postData, callback);
	},

	showPoster() {
		const self = this;
		self.data.show_poster = !self.data.show_poster;
		self.setData({
			show_poster: self.data.show_poster
		})
	},

	showPeople() {
		const self = this;
		if (self.data.subjectData.length == 0) {
			api.showToast('请先选择团期', 'none')
			return
		};
		self.data.show_people = !self.data.show_people;
		self.setData({
			show_people: self.data.show_people
		})
	},



	changeIndex(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		if (self.data.selectIndex != index) {
			self.data.orderPost.classifyId = self.data.mainData.classifys[self.data.selectIndex].id;
			self.data.selectIndex = index;
			self.setData({
				web_orderPost: self.data.orderPost,
				web_selectIndex: self.data.selectIndex
			})

			console.log('self.data.dayData', self.data.dayData)
		};
	},




	selectDay(e) {
		const self = this;
		var day = api.getDataSet(e, 'day')
		if (self.data.orderPost.startDate != day) {
			self.data.orderPost.startDate = day;
			for (var i = 0; i < self.data.mainData.classifys[self.data.selectIndex].prices.length; i++) {
				if (self.data.mainData.classifys[self.data.selectIndex].prices[i].groupDay == self.data.orderPost.startDate) {
					self.data.subjectData.push(self.data.mainData.classifys[self.data.selectIndex].prices[i])
				}

			};
			for (var i = 0; i < self.data.subjectData.length; i++) {
				self.data.subjectData[i].count = 0
			};
			self.setData({
				web_orderPost: self.data.orderPost,
				web_subjectData: self.data.subjectData
			})
		}
		console.log('self.data.subjectData', self.data.subjectData)

	},

	counter(e) {
		const self = this;
		var type = api.getDataSet(e, 'type');
		var index = api.getDataSet(e, 'index');
		if (type == '-') {
			if (self.data.subjectData[index].count > 0) {
				self.data.subjectData[index].count--
			}
		} else if (type == '+') {
			self.data.subjectData[index].count++
		}
		self.setData({
			web_subjectData: self.data.subjectData
		});
		self.countPrice()
	},
	
	countPrice(){
		const self = this;
		self.data.lineFee = 0
		for (var i = 0; i < self.data.subjectData.length; i++) {
			self.data.lineFee += self.data.subjectData[i].count*self.data.subjectData[i].cprice
		}	
	},
	
	supplierProductLike(e) {
		const self = this;
		var id = self.data.id;
		console.log(id)
		const postData = {
			header:{
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization':wx.getStorageSync('token')
			},
			url:'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/'+self.data.id+'/like'
		};
	
		const callback = (res) => {
			if(res.code==200){
				api.showTaost('点赞成功','none')
			}
		
		};
		api.supplierProductLike(postData, callback);
	},

	confirm(e) {
		const self = this;
		for (var i = 0; i < self.data.subjectData.length; i++) {
			if (self.data.subjectData[i].count > 0) {
				
				for(var j =0;j<self.data.orderPost.bills.length;j++){
					if(self.data.orderPost.bills[j]['billSubjectid']==self.data.subjectData[i].subjectType){
						self.data.orderPost.bills.splice(j)
					};
				};
				self.data.orderPost.bills.push({
					billSubjectid: self.data.subjectData[i].subjectType,
					billSubject: self.data.subjectData[i].typeName,
					amount: self.data.subjectData[i].count
				})
			}
		}
		self.data.show_people = false;
		self.setData({
			web_orderPost: self.data.orderPost,
			show_people: self.data.show_people
		});
		console.log('self.data.orderPost', self.data.orderPost)
	},

	goBook(e) {
		const self = this;
		if (self.data.orderPost.startDate == '') {
			api.showToast('请选择团期', 'none')
		} else if (self.data.orderPost.bills.length == 0) {
			api.showToast('请选择出行人数', 'none')
		} else {
			wx.setStorageSync('lineFee', self.data.lineFee)
			wx.setStorageSync('orderPost', self.data.orderPost)
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		}
	},


	save() {
		let self = this
		//若二维码未加载完毕，加个动画提高用户体验
		wx.showToast({
			icon: 'loading',
			title: '正在保存图片',
			duration: 1000
		})
		//判断用户是否授权"保存到相册"
		wx.getSetting({
			success(res) {
				//没有权限，发起授权
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() { //用户允许授权，保存图片到相册
							self.savePhoto();
						},
						fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
							wx.openSetting({
								success() {
									wx.authorize({
										scope: 'scope.writePhotosAlbum',
										success() {
											self.savePhoto();
										}
									})
								}
							})
						}
					})
				} else { //用户已授权，保存到相册
					self.savePhoto()
				}
			}
		})
	},
	//保存图片到相册，提示保存成功
	savePhoto() {
		let self = this
		wx.downloadFile({
			url: self.data.mainData.posterPath,
			success: function(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res) {
						wx.showToast({
							title: '保存成功',
							icon: "success",
							duration: 1000
						})
					}
				})
			}
		})
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
