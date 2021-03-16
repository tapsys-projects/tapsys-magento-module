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
                            firstName : window.checkoutConfig.customerData.firstname,
                            lastName : window.checkoutConfig.customerData.lastname,
                            billingEmail : window.checkoutConfig.customerData.email,
                            billingAddress : billing_address,
                            billingPhone : billing_phone,
                            amount : parseInt(quote.totals().base_grand_total),
                            currency : quote.totals().quote_currency_code
                        })
                    }
                );
            },

            /**
             * Get payment method data
             */
            getData: function () {
                return {
                    'method': this.item.method,
                    'po_number': null
                };
            },

            afterPlaceOrder: function () {
                redirectOnSuccessAction.redirectUrl = url.build('tapsys/payment/process');
                this.redirectAfterPlaceOrder = true;
            },
        });
    }
);