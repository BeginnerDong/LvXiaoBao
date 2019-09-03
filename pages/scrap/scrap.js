// pages/jounery/jounery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainData:'姓名：test；手机号：15929911250;地址：xxxx',
    finishArray:[]
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
    var key = ['姓名','手机号','地址'];
    var newArray = [];
    for (var i = 0; i < key.length; i++) {
      var rex = new RegExp(key[i], "g"); 
      var temp = self.data.mainData.split(rex);
      console.log(temp)
      var str = temp[temp.length-1];
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
        var newStr = newArray[i].str.replace(newArray[i+1].str,"").replace(/\s/g,"").replace(/[：|，|；|。|【|】|\/|-|、|;|,|.]/g,"");
        console.log('newStr',newStr)
        newArray[i].str = newStr;
      }else{
        var newStr = newArray[i].str.replace(/\s/g,"").replace(/[：|，|；|。|【|】|\/|-|、|;|,|.]/g,"");
        newArray[i].str = newStr;
      };
    };
    self.data.finishArray = newArray;
    console.log('self.data.finishArray',self.data.finishArray)
  }


})