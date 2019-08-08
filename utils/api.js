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

	mshopInfo(param, callback) {
		var allParams = {
			url: '/mshop/v1/{id}/info',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
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
			url: '/pdt/v1/product/{id}',
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
			url: '/own/v1/traveler/{id}',
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
	
	supplierGood(param, callback) {
		var allParams = {
			url: '/crm/v1/supplier/{id}/laud',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	supplierLike(param, callback) {
		var allParams = {
			
			url: '/crm/v1/supplier/{id}/like',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	supplierProductLike(param, callback) {
		var allParams = {
			url: '/pdt/v1/product/{id}/like',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	feedback(param, callback) {
		var allParams = {
			url: '/own/v1/feedback',
			type: 'POST',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	vipList(param, callback) {
		var allParams = {
			url: '/my/v1/vips',
			type: 'GET',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	
	vipPay(param, callback) {
		var allParams = {
			url: '/odr/v1/vip-renewal',
			type: 'POST',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	addOrder(param, callback) {
		var allParams = {
			url: '/odr/v1/order',
			type: 'POST',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	insures(param, callback) {
		var allParams = {
			url: '/crm/v1/insures',
			type: 'GET',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	insuresPdt(param, callback) {
		var allParams = {
			url: '/pdt/v1/insures',
			type: 'GET',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	orderDetail(param, callback) {
		var allParams = {
			url: '/odr/v1/order/{orderCode}',
			type: 'GET',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	addPeople(param, callback) {
		var allParams = {
			url: '/odr/v1/people',
			type: 'POST',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	recommendProduct(param, callback) {
		var allParams = {
			url: '/home/v1/recommend/products',
			type: 'Get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	
	
	busignature(param, callback) {
		var allParams = {
			url: '/own/v1/busignature',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	withdrawInfo(param, callback) {
		var allParams = {
			url: '/my/v1/wallet/withdraw/info',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	withdraw(param, callback) {
		var allParams = {
			url: '/my/v1/wallet/withdraw/info',
			type: 'put',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//客户出行记录
	travelRecord(param, callback) {
		var allParams = {
			url: '/own/v1/traveler/{id}/travel-record',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//标签列表
	
	labels(param, callback) {
		var allParams = {
			url: '/own/v1/traveler/labels',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//新增标签
	labelAdd(param, callback) {
		var allParams = {
			url: '/own/v1/traveler/label',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//购买保险
	insureBuy(param, callback) {
		var allParams = {
			url: '/odr/v1/insure',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//合同分类
	cddType(param, callback) {
		var allParams = {
			url: '/bse/v1/cdd-type',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//合同类型
	cddClassify(param, callback) {
		var allParams = {
			url: '/bse/v1/cdd-classify',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//签署合同
	contractSign(param, callback) {
		var allParams = {
			url: '/odr/v1/contract',
			type: 'post',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//合同行程信息
	
	journery(param, callback) {
		var allParams = {
			url: '/pdt/v1/product/journery',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	//订单支付
	orderPay(param, callback) {
		var allParams = {
			url: '/odr/v1/rest-pay',
			type: 'get',
			data: param,
			sCallback: function(data) {
				callback && callback(data);
			}
		};
		this.request(allParams);
	}
	
	
	
	//团期
	datePrice(param, callback) {
		var allParams = {
			url: '/pdt/v1/product/{id}/prices',
			type: 'get',
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
