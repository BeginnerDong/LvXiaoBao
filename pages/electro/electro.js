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
		let url = self.data.url;
		//url += 'pdf';
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
						
					},
					fail: function(res) {
					
					},
					complete: function(res) {
					
					}
				})
			},
			fail: function(res) {
				
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
