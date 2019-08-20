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
			loginPhone:'',
			password:''
		},
		show:false
	},

	onLoad(options) {
		const self = this;
		//self.getMainData()
	},
	
	
	onShow() {
		const self = this;
		if (wx.getStorageSync('token')) {
			wx.redirectTo({
				url: '/pages/micro/micro'
			})
		}else{
			self.setData({
				web_show:true
			})
		}
	},

	
	inputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	login() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)
		postData.header = {
			'content-Type':'application/x-www-form-urlencoded'
		};
		const callback = (res) => {
			if(res.code==200){
				wx.setStorageSync('token','Basic'+' '+res.content)
				wx.redirectTo({
					url: '/pages/micro/micro'
				})
			}else{
				api.showToast(res.errmsg, 'none')
			}	
	
		};
		api.login(postData, callback);
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
