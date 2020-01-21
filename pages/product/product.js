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
		isFirstLoadAllStandard: ['getMainData'],
		show: false,

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getMainData();
		self.setData({
			web_show: self.data.show
		})
	},

	getMainData() {
		const self = this;
		const postData = {
			header:{
				Authorization:'Basic eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..shyt1IfiIW4QbPk1.CMW21Ja_l8I6KYaYR1W5AkybF22QXBnaro01RGsHQmc_BUgBDvuFkX4ysYdFD-usqivB7FSNIukHNNK93JZ_o0yCnzkWfRukvQJQBTnm1Zs2r-YL-l4JNUYMEKDfDJfEOO16vgSqfQrJTavb0Qb_fr0Jar8M1b8ukEEZPUtnjSdWN4cJquMUdu3o7exNotS30oUOFOatqEz5ApEF1-wovrJjPVXU34P0PF-WhcXDKSGai7E1-J3MNtw9lD8yRNFyYju0TyWRUA7nIp5Ha7CPcJpuDA2ulucswLJmDlJurDHn_OYUS8bzQtvoTqOeOsDfFtJ1I9pXN2iEDPkVHdEErnoxvrmPk7YXL2EsfKs3jVEVwqYVmsATZM4M8BB3cmVhqZRUcnt7NNe6p8TTgcsYT7XXYVSbcgpBMdIEMqQGiiSLBvBjfIlfe0MV47aXS_oNo4liqqxgHX0zFJL149m_g4q2ZH4vHE4tnmyasqFZXvPGf4j1SQhYS0by_c7sSlAjJ08JlkOKTrx13G8ldYkrJ8y7vxxgYW1jLfTeqIDRVhxuE3C0cVzbAGaHul5fZaVJMOQXXNkkacjuUPyvUoBvf1GYSfV8mCEx99pfE60q1Qladxu5IyakXJxD81NfQ9hYI2nNmBp5-tzJX9I80J45fQ_pxcgoB4STqWKub622oWp_oznuQN6-PALk13CsCRJAZbYF6lilhxF9wwJRIYpcVlIqgikLgewrU_SinGMoaqw0-i3gXcOPJYkrJftM4_u4p6RGqwNnz_verSwBrGOZ5Q0n3bQF7xM4OZ7UwcFFvFF-V2d6iw4bGsch2_lFnhnWJs2oCG3_XwUsVtj1aizLdiO9ExqsMr835Gmsb1QPc1FuBaDyYcRn4eYdtaVczO9xvQo5bAwYjFltVqknVhmlw0DQdDzL-L6zkcME67yVr3wT3as7J41ojpNK9M6pbE1nk4lMgU5MDlg92kk-j5-izwb9S6HbcUzRdp6Hw_u8J1gS5yyiMdz0PlWI52CuDAFeeUkTYOey95AT031wV11X5dsuH9V1YhVOH4ae-ZhYX6-nNSnXh7y-KK2ZUNgrjlsMP1_-pO4QcjkrMoOw9y9RiNcTCHJO0jsRpJakUCoU8dSthAgL-L0Ex8P-dZTqDhuqwuoRUGK2xnRmO0UUeYc_6wMIakOPaFVe_QuFGHKM061Xeinuh-vAc4NU0-Aet3hQ3Y11L3dhVTyK-MlNpJHAJ1Wxj4_pwbxs2JJ69fdtURtbN3RgpZTHu62Il_G4VpsVTXW_ceg3JOZGAqOxEgDNXexAyzZmTMuATKxnhMWKjvLOfhF0Funnu3DF7wzz9leNn6rHXlDjz-YpY4hW09iV_lRj1i6ayambezPMayin09JNZySnngRsuDCq9yHUnaLhqXeVxXSy-JntobRfLcOPEjhLVdHAUJKw7ca3dR26h02oC7S9SWoeRHgXN3En37wYLngPMrZluuNtFGX5hNXAhyR53ppNFncY8COAvM9BuzHxbP0fo-0mjLCnu8cp0imuImq8HYqoPko_ogchQHi2Ol8IpL-zJr48wHcjfQQtNcPORh-S3HgGsgQuO-iXkvY_AibYm3OgmegPuCEYxYCyXdqMDf88Wf3ylPedVu12eUNz1As45gPfaoHeQz9R2TkXhxEC9ZzEPuCskJzX3NoqdtUnekRO9wSw5T7s0ffgX8bQZ_ViUS8U1IT8eej3.orsO97egmWSiX49Ztv-hOQ'
			},
			number:1,
			size:1
		};

		const callback = (res) => {
			if (res.code == 200) {
				self.data.mainData = res.content
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.spreadDetail(postData, callback);
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
