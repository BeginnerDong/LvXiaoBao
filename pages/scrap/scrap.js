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

  /**
   * 页面的初始数据
   */
  data: {
    mainData:'姓名：test；手机号：15929911250;性别：男；生日：1994-09-20；证件类型：身份证；证件号：610481199409200556',
    finishArray:[],
	submitData: {
		name:'',
		sex:'',
		birth:'',
		phone:'',
		cdtype:'',
		card:'',
		orderType:101
	},
	cardData:[{key:'身份证',value:101},{key:'护照',value:102},{key:'军官证',value:103},{key:'学生证',value:104},{key:'老年证',value:105},{key:'台湾通行证',value:106},
	{key:'港澳通行证',value:107}],
	sexData:[{key:'男',value:101},{key:'女',value:102},{key:'保密',value:103}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const self = this;
  },

  inputChange(e){
    const self = this;
    self.data.mainData = e.detail.value;
  },

  splitString(){
    const self = this;
    var key = ['姓名','性别','生日','手机号','证件类型','证件号'];
    var newArray = [];
    for (var i = 0; i < key.length; i++) {
      var rex = new RegExp(key[i], "g"); 
      var temp = self.data.mainData.split(rex);
      var str = temp[temp.length-1];
      console.log(str)
      var hasOne = false;
      if(newArray.length>0){
        for (var j = 0; j < newArray.length; j++) {
          if(newArray[j].str.length<str.length){
            newArray.splice(j,0,{name:key[i],str:str});
            hasOne = true;
            break;
          }
        };
        if(!hasOne){
          newArray.push({name:key[i],str:str})
        }
      }else{
        newArray.push({name:key[i],str:str})
      };
    };
  
    for (var i = 0; i < newArray.length; i++) {
      if(i!==newArray.length-1){
        console.log('newArray[i+1].str',newArray[i+1].str)
        var newStr = newArray[i].str.replace(newArray[i+1].name + newArray[i+1].str,"").replace(/\s/g,"").replace(/[：|，|；|。|【|】|\/|-|、|;|,|.]/g,"");
        console.log('newStr',newStr)
        newArray[i].str = newStr;
      }else{
        var newStr = newArray[i].str.replace(/\s/g,"").replace(/[：|，|；|。|【|】|\/|-|、|;|,|.]/g,"");
        newArray[i].str = newStr;
      };
    };
    self.data.finishArray = newArray;
    console.log('self.data.finishArray',self.data.finishArray);
	for (var i = 0; i < self.data.finishArray.length; i++) {
		if(self.data.finishArray[i].name=='姓名'){
			self.data.submitData.name=self.data.finishArray[i].str
		};
		if(self.data.finishArray[i].name=='性别'){
			for (var j = 0; j < self.data.sexData.length; j++) {
				if(self.data.finishArray[i].str==self.data.sexData[j].key){
					self.data.submitData.sex=self.data.sexData[j].value
				}
			}		
		};
		if(self.data.finishArray[i].name=='生日'){
			self.data.submitData.birth=self.data.finishArray[i].str
		};
		if(self.data.finishArray[i].name=='手机号'){
			self.data.submitData.phone=self.data.finishArray[i].str
		};
		if(self.data.finishArray[i].name=='证件号'){
			self.data.submitData.card=self.data.finishArray[i].str
		};
		if(self.data.finishArray[i].name=='证件类型'){
			for (var j = 0; j < self.data.cardData.length; j++) {
				if(self.data.finishArray[i].str==self.data.cardData[j].key){
					self.data.submitData.cdtype=self.data.cardData[j].value
				}
			}
		};
		
	}
	const postData = api.cloneForm(self.data.submitData);
	postData.header = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization':wx.getStorageSync('token')
	};
	const callback = (data) => {
		if (data) {
			if(data.content.id){
				api.buttonCanClick(self,true);
				self.data.submitData.id = data.content.id;
				self.data.submitData.isSelect = false;
				self.data.submitData.isBx = false;
				api.setStorageArray('peopleData',self.data.submitData,'id',999);
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
			}
		
		};
	
	
	};
	api.addPeople(postData, callback);
  }


})