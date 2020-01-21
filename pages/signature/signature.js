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

		signatureUrl:''
	},

	onLoad(options) {
		const self = this;
		
	},


	busignature() {
		const self = this;
		const postData = {
			signatureUrl:self.data.signatureUrl
		};
		postData.header = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization':wx.getStorageSync('token')
		};
		const callback = (data) => {
			if (data) {
				if (data.code == 200) {
					api.showToast('设置成功','none');
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				}
			};


		};
		api.busignature(postData, callback);
	},


	submit() {
		const self = this;
		
		if (self.data.signatureUrl!='') {
			self.busignature()
		} else {

			api.showToast('请上传图片', 'none');

		};
	},


	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},


	upLoadImg() {
		const self = this;

		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			if (res.result == '0') {
				var url = res.fullPath;
				
				self.data.signatureUrl = url;
				self.setData({
					web_signatureUrl:self.data.signatureUrl
				});
				wx.hideLoading()
			} else {
				api.showToast(res.msg, 'none')
			}

		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;
				api.uploadFile(tempFilePaths[0], 'file', {
					classify: 'T019',
					rwidth: 150,
					rheight: 150,
					file: tempFilePaths[0],
				}, callback)
			},
			fail: function(err) {
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
