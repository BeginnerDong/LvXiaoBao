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
		}
	},

	onLoad(options) {
		const self = this;
		//self.getMainData()
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
	
		const callback = (res) => {
			if(res.code==200){
				wx.setStorageSync('token','Basic'+' '+res.content.token)
				
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
