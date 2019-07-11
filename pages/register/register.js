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
			invitationCode:''
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
	
	register() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)
	
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
