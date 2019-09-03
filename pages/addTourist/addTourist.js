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
    mainDataC: {},
    alphbate: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    search: {
      keyword: ''
    },
    touchStatus: false,
    timer: null,
    birthMainData: [],
    is_show:false
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.setData({
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

  handleTouchStart() {
    const self = this;
    self.touchStatus = true;
  },

  handleTouchMove(e) {
    const self = this;
    if (self.touchStatus) {
      if (self.timer) {
        clearTimeout(self.timer)
      };
      const touchY = e.touches[0].clientY;
      const index = Math.floor(touchY / 25);
      self.timer = setTimeout(function () {
        self.goToPoint(self.data.alphbate[index]);
      }, 16)

    }
  },

  handleTouchCancel() {

    const self = this;
    console.log('handleTouchCancel')
    self.touchStatus = false;

  },

  clickToPoint(e) {

    const self = this;
    var alphbate = api.getDataSet(e, 'alp');
    console.log(alphbate);
    if (alphbate) {
      self.goToPoint(alphbate)
    };

  },

  goToPoint(alphbate) {
    const self = this;
    const query = wx.createSelectorQuery();
    query.select('#' + alphbate).boundingClientRect();

    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log('res', res)
      if (res[1] && res[0]) {
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop,
          duration: 100
        })
      }
    })
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
    if (self.data.search.keyword != '') {
      self.getMainData(true)
    } else {
      api.showToast('请输入关键词搜索', 'none')
    }
  },

  getMainData(isNew) {
    const self = this;
    if (isNew) {
      api.clearPageIndex(self);
    };
    const postData = {
      number: 1,
      size: 1
    };
    if (self.data.search.keyword != '') {
      postData.keyword = self.data.search.keyword
    };
    const callback = (res) => {
      if (res.content.list.length > 0) {
        /* self.data.mainData.push.apply(self.data.mainData,res.content.list) */
        for (var i = 0; i < res.content.list.length; i++) {
          var month = res.content.list[i].birth.substring(5);
          var year = new Date().getFullYear();
          var birthday = year + '-' + month;
          var gap = new Date(birthday).getTime() - (new Date()).getTime();
          if (gap / 86400000 < 3 && gap / 86400000 > 0) {
            var day = Math.floor(gap / 86400000);
            res.content.list[i].gapDay = day;
            self.data.birthMainData.push(res.content.list[i]);
          } else {
            if (!self.data.mainDataC[res.content.list[i].firstLetter]) {
              self.data.mainDataC[res.content.list[i].firstLetter] = [];
            };
            self.data.mainDataC[res.content.list[i].firstLetter].push(res.content.list[i])
            /* if(res.content.list[i].firstLetter==self.data.web_mainDataC[self.data.web_mainDataC.length-1].tag){
              self.data.web_mainDataC[self.data.web_mainDataC.length-1].data.push(res.content.list[i]);
            }else{
              self.data.web_mainDataC.push({
                tag: res.content.list[i].firstLetter,
              	
                data:[res.content.list[i]]
              });
            }; */
            /* if(api.timeToTimestamp(res.content.list.birth)) */
          };
        };
        console.log('self.data.birthMainData', self.data.birthMainData)
        console.log(api.timeToTimestamp(res.content.list[0].birth))
      } else {
        self.data.isLoadAll = true
      };
      self.setData({
        web_birthMainData: self.data.birthMainData,
        web_mainDataC: self.data.mainDataC
      })
      api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);

    };
    api.travelers(postData, callback);
  },


  /* 	onReachBottom() {
      const self = this;
      if (!self.data.isLoadAll && self.data.buttonCanClick) {
        self.data.number++;
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
