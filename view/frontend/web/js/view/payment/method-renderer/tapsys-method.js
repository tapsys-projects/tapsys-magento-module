define(
    [
        'jquery',
        'ko',
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/redirect-on-success',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Ui/js/modal/alert',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/full-screen-loader',
        'mage/url'
    ],
    function ($, ko, Component, redirectOnSuccessAction, additionalValidators, alert, quote, fullScreenLoader, url) {

        var tokenApiResponse = ko.observableArray();

        return Component.extend({
            redirectAfterPlaceOrder: true,
            defaults: {
                template: 'Tapsys_Checkout/payment/tapsys'
            },

            /**
             * @returns {exports.initialize}
             */
            initialize: function () {
                this._super();
                this.tokenRequest();
                quote.totals.subscribe(function () {
                    this.tokenRequest();
                }.bind(this));
                return this;
            },

            tokenRequest: function() {
                console.log(window.checkoutConfig.customerData.addresses);
                let tokenApiUrl = window.checkoutConfig.payment.tapsys.token_api_url;
                var billing_address = '';
                var billing_phone = '';
                if(window.checkoutConfig.customerData.addresses['2']){
                  billing_address = window.checkoutConfig.customerData.addresses['2']['inline'];
                  billing_phone = window.checkoutConfig.customerData.addresses['2']['telephone'];
                }
                if(window.checkoutConfig.customerData.addresses['3']){
                  billing_address = window.checkoutConfig.customerData.addresses['3']['inline'];
                  billing_phone = window.checkoutConfig.customerData.addresses['3']['telephone'];
                }
                $.ajax(
                    url.build('/rest/V1/tapsys/endpoint'),
                    {
                        type: 'post',
                        contentType: "application/json",
                        dataType: 'json',
                        showLoader: true,
                        data: JSON.stringify({
                            url: tokenApiUrl,
                            firstName : window.checkoutConfig.customerData.firstname,
                            lastName : window.checkoutConfig.customerData.lastname,
                            billingEmail : window.checkoutConfig.customerData.email,
                            environment : window.checkoutConfig.payment.tapsys.environment,
                            clientId : window.checkoutConfig.payment.tapsys.api_key,
                            clientWordPressKey : window.checkoutConfig.payment.tapsys.webhook_secret,
                            merchantId : window.checkoutConfig.payment.tapsys.merchant_id,
                            billingAddress : billing_address,
                            billingPhone : billing_phone,
                            amount : parseInt(quote.totals().base_grand_total),
                            currency : quote.totals().quote_currency_code
                        }),
                        success: function (apiResponse, status, xhr){
                            apiResponse = JSON.parse(apiResponse);
                            if(apiResponse.response.code === "OK"){
                                if (typeof apiResponse.data.token !== 'undefined' && apiResponse.data.token != null){
                                    tokenApiResponse(apiResponse);
                                    return true;
                                }else{
                                    alert({
                                        title: $.mage.__('Error'),
                                        content: $.mage.__('Something went wrong. Please try again.'),
                                        actions: {
                                            always: function(){}
                                        }
                                    });
                                    return false;
                                }
                            }else{
                                alert({
                                    title: $.mage.__('Error'),
                                    content: $.mage.__(data["message"]),
                                    actions: {
                                        always: function(){}
                                    }
                                });
                                return false;
                            }
                        },
                        error: function (jqXhr, textStatus, errorMessage){
                            alert({
                                title: $.mage.__('Error'),
                                content: $.mage.__('Something went wrong. Please try again.'),
                                actions: {
                                    always: function(){}
                                }
                            });
                            return false;
                        }
                    }
                );
            },

            /**
             * Get payment method data
             */
            getData: function () {
                var apiResponse = tokenApiResponse();

                return {
                    'method': this.item.method,
                    'po_number': null,
                    'additional_data': {
                        'tapsys_token_data': (typeof apiResponse.data.token !== 'undefined' && apiResponse.data.token != null) ? apiResponse.data.token : null
                    }
                };
            },

            afterPlaceOrder: function () {
                redirectOnSuccessAction.redirectUrl = url.build('tapsys/payment/process');
                this.redirectAfterPlaceOrder = true;
            },
        });
    }
);
