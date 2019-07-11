import {
	Base
} from 'base.js';



class Api extends Base {





	realPay(param, callback) {
		wx.requestPayment({
			'timeStamp': param.timeStamp,
			'nonceStr': param.nonceStr,
			'package': param.package,
			'signType': param.signType,
			'paySign': param.paySign,
			success: function(res) {
				console.log(res);
				wx.showToast({
					title: '支付成功',
					icon: 'success',
					duration: 1000,
					mask: true
				});

				callback && callback(1);
			},
			fail: function(res) {
				console.log(res);
				wx.showToast({
					title: '支付失败',
					icon: 'success',
					duration: 1000,
					mask: true
				});
				callback && callback(0);
			}
		});
	}



	mshopProducts(param, callback) {
		var allParams = {
			url: '/mshop/v1/{id}/products',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	supplierProducts(param, callback) {
		var allParams = {
			url: '/pdt/v1/supplier/{id}/products',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}


	supplierpProductsDetail(param, callback) {
		var allParams = {
			url: '/pdt/v1/product/9418',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	mshopProductsDetail(param, callback) {
		var allParams = {
			url: '/mshop/v1/{id}/product/{pId}',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	suppliers(param, callback) {
		var allParams = {
			url: '/crm/v1/suppliers',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	sales(param, callback) {
		var allParams = {
			url: '/crm/v1/supplier/{id}/sales',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	coupons(param, callback) {
		var allParams = {
			url: '/my/v1/coupons',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	myInfo(param, callback) {
		var allParams = {
			url: '/my/v1/info',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	wallet(param, callback) {
		var allParams = {
			url: '/my/v1/wallet',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	walletDeals(param, callback) {
		var allParams = {
			url: '/my/v1/wallet/deals',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	walletRecharge(param, callback) {
		var allParams = {
			url: '/my/v1/wallet/recharge',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	bindPhone(param, callback) {
		var allParams = {
			url: '/own/v1/binding-phone',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	travelers(param, callback) {
		var allParams = {
			url: '/own/v1/travelers',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	travelerDetail(param, callback) {
		var allParams = {
			url: '/own/v1/traveler/1',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	addTraveler(param, callback) {
		var allParams = {
			url: '/own/v1/traveler/1',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	spread(param, callback) {
		var allParams = {
			url: '/my/v1/spread/info',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	spreadDetail(param, callback) {
		var allParams = {
			url: '/my/v1/spread/details',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	order(param, callback) {
		var allParams = {
			url: '/odr/v1/officeorders',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	supperProvince(param, callback) {
		var allParams = {
			url: '/own/v1/supper-province',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	supperProvinceUpdate(param, callback) {
		var allParams = {
			url: '/own/v1/supper-province',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	collectProducts(param, callback) {
		var allParams = {
			url: '/my/v1/collect/products',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	collectSuppliers(param, callback) {
		var allParams = {
			url: '/my/v1/collect/suppliers',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	register(param, callback) {
		var allParams = {
			url: '/auth/v1/register',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}

	login(param, callback) {
		var allParams = {
			url: '/auth/v1/login',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}



}

export {
	Api
};
