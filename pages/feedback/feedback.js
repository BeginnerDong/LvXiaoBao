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

		typeData: [{
				name: '无法打开小程序',
				value: 101
			}, {
				name: '小程序闪退',
				value: 102
			}, {
				name: '卡顿',
				value: 103
			}, {
				name: '界面错误',
				value: 104
			}, {
				name: '界面加载慢',
				value: 105
			},
			{
				name: '死机',
				value: 106
			}, {
				name: '其他异常',
				value: 107
			},
		],
		submitData: {
			feedbackType: '',
			content: '',
			contact: '',
			images: [
				
			]
		},
		imgArray:[],
		max:100,
		len:0
	},

	onLoad(options) {
		const self = this;
		self.setData({
			web_imgArray:self.data.imgArray,
			web_len:self.data.len
		})
	},
	
	typeChange(e) {
		const self = this;
		self.data.submitData.feedbackType = self.data.typeData[e.detail.value].value;
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},
	
	feedback() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData);
		postData.header = {
			'Content-Type':'application/x-www-form-urlencoded'
		};
		const callback = (data) => {
			if (data) {			
				if (data.code == 200) {
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}else{
					api.showToast(data.message,'none')
				}
			};
	
	
		};
		api.feedback(postData, callback);
	},
	
	
	submit() {
		const self = this;
	
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.contact
		const pass = api.checkComplete(newObject);
		if (pass) {
			self.feedback()
		} else {
	
			api.showToast('请补全信息', 'none');
	
		};
	},
	

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		if(e.currentTarget.dataset.key=='content'){
			var value = e.detail.value;
			var len = parseInt(value.length);		
			if(len > self.data.max) return;
		};
		self.setData({
			web_len:len,
			web_submitData: self.data.submitData,
		});
	},


/* 	upLoadImg(e) {
		const self = this;
	
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.result == '0') {
				var url = res.fullPath;
				var name = res.fileName;
				self.data.submitData.image.push(
					{fileName:name}
				);
				self.data.imgArray.push(url)
				self.setData({
					web_imgArray:self.data.imgArray,
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
			} else {
				api.showToast('网络故障', 'none')
			}
		};
		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log('tempFilePaths',tempFilePaths)
				const postData = {
					classify:'T019',
					rwidth:150,
					rheight:150,
					file:tempFilePaths[0]
				}
				api.uploadFile(postData, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			},

		})
		console.log(self.data.submitData.file)
	}, */
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.submitData.images.splice(index,1);
		self.data.imgArray.splice(index,1);
		self.setData({
			web_imgArray:self.data.imgArray,
			web_submitData:self.data.submitData
		})
	},
	
	upLoadImg(){
	  const self = this;
	 
	  wx.showLoading({
	    mask: true,
	    title: '图片上传中',
	  });
	  const callback = (res)=>{
		if (res.result == '0') {
			var url = res.fullPath;
			var name = res.fileName;
			self.data.submitData.images.push(
				{fileName:name}
			);
			self.data.imgArray.push(url)
			self.setData({
				web_imgArray:self.data.imgArray,
				web_submitData: self.data.submitData
			});
			wx.hideLoading()
		} else {
			api.showToast(res.msg, 'none')
		}
	
	  };
	
	  wx.chooseImage({
	    count:1,
	    success: function(res) {
	      var tempFilePaths = res.tempFilePaths;
	      api.uploadFile(tempFilePaths[0],'file',{
				classify:'T019',
				rwidth:150,
				rheight:150,
				file:tempFilePaths[0],
		},callback)
	    },
	    fail: function(err){
	      wx.hideLoading();
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
