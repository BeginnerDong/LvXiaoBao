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
		week: ['日', '一', '二', '三', '四', '五', '六'],
		day: [{}, {}, {}, {
				days: 1
			}, {
				days: 2
			}, {
				days: 3
			}, {
				days: 4
			}, {
				days: 5
			}, {
				days: 6
			}, {
				days: 7
			}, {
				days: 8
			}, {
				days: 9
			}, {
				days: 10
			}, {
				days: 11
			}, {
				days: 12
			}, {
				days: 13
			}, {
				days: 14
			}, {
				days: 15
			},
			{
				days: 16
			}, {
				days: 17
			}, {
				days: 18
			}, {
				days: 19
			}, {
				days: 20
			}, {
				days: 21
			}, {
				days: 22
			}, {
				days: 23
			}, {
				days: 24
			}, {
				days: 25
			}, {
				days: 26
			}, {
				days: 27
			}, {
				days: 28
			}, {
				days: 29
			}, {
				days: 30
			}
		],
		monthArray:[],
		dateData:[],
		choosedTimeFormat:'',
		hasItem:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.data.classifyId = options.classifyId;
		self.calenderInit();
		//self.getMainData()
	},

	getMainData(isNew) {
		const self = this;
		if(isNew){
			self.data.mainData = []
		};
		const postData = {
			'Authorization': wx.getStorageSync('token'),
			classifyId:self.data.id,
			url:'http://yapi.lxbtrip.cn/mock/19/pdt/v1/product/'+self.data.id+'/prices'
		};
		
		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData.push.apply(self.data.mainData, res.content.prices);
				for (var i = 0; i < self.data.dateData.length; i++) {
					for (var j = 0; j < self.data.mainData.length; j++) {
						if(self.data.mainData[j].groupDay==self.data.dateData[i].timeFormat){
							self.data.dateData[i].item = self.data.mainData[j]
						};
					}
				}
				for (var i = 0; i < self.data.dateData.length; i++) {
					if(self.data.dateData[i].item&&self.data.dateData[i].item!=undefined){
						self.data.hasItem.push(i)
					
					}
				}
			
			};
			self.setData({
				web_choosedTimeFormat:self.data.dateData[self.data.hasItem[0]].timeFormat,
				web_mainData: self.data.mainData,
				web_dateData:self.data.dateData
			});
		
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData-data', self.data.mainData)
			console.log('getMainData', self.data.dateData)
		};
		api.datePrice(postData, callback);
	},

	chooseDay(e){
		const self = this;
		console.log('e',e)
		var item = e.target.dataset.item;
		var timeFormat = e.target.dataset.timeformat;
		if(!item||item==undefined){
			return
		};
		console.log('timeFormat',timeFormat)
		if(timeFormat&&timeFormat!=self.data.choosedTimeFormat){
			self.data.choosedTimeFormat = timeFormat;
			self.setData({
				web_choosedTimeFormat:self.data.choosedTimeFormat
			})
		};
		
		if(item&&item!=undefined){
			wx.setStorageSync('chooseDay',item)
		};
		console.log('item',item)
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)

	},



	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
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


	calenderInit() {
		const self = this;
		var curDate = new Date();
		self.data.monthArray= [];
		self.data.curMonth = curDate.getMonth();
		self.data.monthArray.push(self.data.curMonth+1);

		if(self.data.curMonth+1>9){
			if(self.data.curMonth+2<13)self.data.monthArray.push(self.data.curMonth+2);
			if(self.data.curMonth+3<13)self.data.monthArray.push(self.data.curMonth+3);
			if(self.data.curMonth+4<13)self.data.monthArray.push(self.data.curMonth+4);
		}else{
			self.data.monthArray.push(self.data.curMonth+2);
			self.data.monthArray.push(self.data.curMonth+3);
			self.data.monthArray.push(self.data.curMonth+4);
		};
		
		self.data.curYear = curDate.getFullYear();
		self.data.curDay = curDate.getDate();
		//self.data.choosedTimeFormat = self.getTimeFormat(self.data.curYear,self.data.curMonth+1,self.data.curDay);
		self.setData({
			monthIndex:self.data.monthArray[0],
			//web_choosedTimeFormat:self.data.choosedTimeFormat,
			web_monthArray:self.data.monthArray
		})
		self.refreshPageData(self.data.curYear, self.data.curMonth, self.data.curDay);		
	},
	
	changeMonth(e){
		const self = this;
		var item = api.getDataSet(e,'item');
		var curDate = new Date();
		if(item==self.data.monthArray[0]){
			self.calenderInit()
		}else{
			self.data.curYear = curDate.getFullYear();
			self.data.curDay = curDate.getDate();
			self.data.choosedTimeFormat = self.getTimeFormat(self.data.curYear,self.data.curMonth+1,1);
			self.setData({
				monthIndex:item,
				web_choosedTimeFormat:self.data.choosedTimeFormat,
			})
			self.refreshPageData(self.data.curYear, item, self.data.curDay);	
		}
	},
	
	//刷新全部数据
	refreshPageData(year, month, day) {
		const self = this;
		console.log(111)
		self.data.curYear = year;
		self.data.curMonth = month;
		
		self.data.signData = [];
		self.data.dateData = [];
		self.getOffset(self.data.curYear, self.data.curMonth);
		self.monthArray = [new Date(self.data.curYear, self.data.curMonth, 1).getTime()/1000, new Date(self.data.curYear, self.data.curMonth + 1, 1)
			.getTime()/1000
		];
	
		var offset = self.getOffset(self.data.curYear, self.data.curMonth);
		for (var i = 0; i < offset; ++i) {
			self.data.dateData.push({
				isEmpty: true
			});
		};
		var dayCount = self.getDayCount(self.data.curYear, self.data.curMonth);
		for (var i = 0; i < dayCount; ++i) {
			if (self.data.todayDay == i + 1) {
				self.data.dateData.push({
					days: i + 1,
					isToday: true,
					timeFormat:self.getTimeFormat(self.data.curYear,self.data.curMonth+1,i + 1),
					timeStamp:new Date(self.data.curYear, self.data.curMonth, i + 1).getTime()/1000
				});
			} else {
				self.data.dateData.push({
					days: i + 1,
					timeFormat:self.getTimeFormat(self.data.curYear,self.data.curMonth+1,i + 1),
					timeStamp:new Date(self.data.curYear, self.data.curMonth, i + 1).getTime()/1000
				});
			};
		};
		self.setData({
			web_dateData:self.data.dateData
		});
		console.log('self.dateData', self.data.dateData);
		self.getMainData(true)
	},

	getTimeFormat(year,month,day){
		const self = this;
		var timeFormat = '';
		timeFormat = timeFormat + year + '-';
		if(month<10){
			timeFormat = timeFormat + '0' + month + '-';
		}else{
			timeFormat = timeFormat +  month + '-';
		};

		if(day<10){
			timeFormat = timeFormat + '0' + day;
		}else{
			timeFormat = timeFormat +  day;
		};

		return timeFormat;
	},
	
	//获取此月第一天相对视图显示的偏移
	getOffset(curYear, curMonth) {
		const self = this;
		var offset = new Date(curYear, curMonth, 1).getDay();
		offset = offset == 0 ? 0 : offset ;
		//注意这个转换，Date对象的getDay函数返回返回值是 0（周日） 到 6（周六） 
		console.log('offset', offset)
		return offset;
	},
	isLeapYear(year) {
		if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
			return 1
		else
			return 0
	},
	
	getDayCount(year, month) {
		var DAY_OF_MONTH = [
			[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		];
		return DAY_OF_MONTH[this.isLeapYear(year)][month];
	},






})
