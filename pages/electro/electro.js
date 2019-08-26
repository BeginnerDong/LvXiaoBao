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
		url:''
	},

	onLoad(options) {
		const self = this;
		self.data.url = options.url;
		self.downloadFile()
	},

	downloadFile(e) {
		const self = this;
		console.log(e);
		let url = self.data.url;
		url += 'pdf';
		wx.downloadFile({
			url: url,
			header: {},
			success: function(res) {
				var filePath = res.tempFilePath;
				console.log(filePath);
				wx.openDocument({
					filePath: filePath,
					fileType:'pdf',
					success: function(res) {
						console.log('打开文档成功')
					},
					fail: function(res) {
						console.log(res);
					},
					complete: function(res) {
						console.log(res);
					}
				})
			},
			fail: function(res) {
				console.log('文件下载失败');
			},
			complete: function(res) {},
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
