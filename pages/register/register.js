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
		submitData:{
			phone:'',
			invitationCode:'',
			openId:''
		}
	},

	onLoad(options) {
		const self = this;
		if (self.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				self.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					self.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
		// 获取openid
		wx.login({
			success: function(res) {
				if (res.code) {
					
					wx.getUserInfo({
						success: function(data) {
							self.getOpenId(res.code)							
						}
					});
				}
			}
		});
	},
	
	getOpenId(code) {
		const self = this;
		const postData = {
			url: 'http://yapi.lxbtrip.cn/mock/19/auth/v1/openid/' + code,
			appid: 'wxc8fa29be6e676279'
		}
		const callback = (res) => {
			if(res.code==200){
				self.data.submitData.openId = res.content.openid
			}else{
				api.showToast(res.message,'none')
			}
		};
		api.getOpenId(postData, callback);
	},

	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	register() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)
		postData.header = {
			'Content-Type':'application/x-www-form-urlencoded'
		};
		const callback = (res) => {
			if(res.code==200){
				api.showToast('注册成功', 'none');
				
			}else{
				api.showToast(res.errmsg, 'none')
			}	
	
		};
		api.register(postData, callback);
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
