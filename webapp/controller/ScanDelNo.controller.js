sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.ScanDelNo", {

		onInit: function () {

			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},

		onBeforeShow: function (oEvent) {
			var oRef = this;
			setTimeout(function () {
				var oInput = oRef.getView().byId("id1");
				oInput.focus();
			}, 1000);
		},

		handleSearch: function (oEvent) {

			sap.ui.flag = false;
			var oRef = this;
			var delFlag = false;
			sap.ui.getCore().Delivery = this.getView().byId("id1").getValue();
			var tempVar = sap.ui.getCore().Delivery;
			this.getView().byId("id1").setValue(tempVar);
			if (tempVar.length >= 8) {
				setTimeout(function () {
					oRef.odataService.read("/ScannedDeliveryNo?DeliveryNo='" + tempVar + "'", {
						success: cSuccess,
						failed: cFailed
					});

					function cSuccess(data, response) {
						if (tempVar === "") {
							sap.m.MessageBox.error("Please Scan Valid Delivery Number");
						} else {

							if (data.Message === "Invalid") {
								MessageBox.error("Please Enter Valid Delivery Number");
								sap.ui.flag = true;
								oRef.getView().byId("id1").setValue("");
							} else if (data.Message === "PGI Already Done") {
								MessageBox.error("Shipment already completed for this Delivery");
								sap.ui.flag = true;
								oRef.getView().byId("id1").setValue("");
							} else {
								oRef.onNextPress();
							}
						}
					}

					function cFailed() {
						MessageBox.error("Could Not Read Scanned Delivery Number");
					}

				}, 1000);
			} else {
				// setTimeout(function () {
				// 	MessageBox.error("Please Scan Valid Delivery Number");
				// 	oRef.getView().byId("id1").setValue("");
				// }, 1500);

				delFlag = true;
				return delFlag;
			}

		},
		onNextPress: function () {

			var that = this;
			var deliveryNo = this.getView().byId("id1").getValue();
			sap.ui.getCore().AppContext = new Object();
			sap.ui.getCore().AppContext.DeliveryNo = deliveryNo;

			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.navTo("FGPickMaterial", {});
			this.odataService.read("/DeliveryNoItemsSet?$filter=DeliveryNo eq '" + deliveryNo + "'", null, null, false, function (
				response) {

				var iPallets = 0;
				for (var i = 0; i < response.results.length; i++) {
					if (response.results[i].Materialtype === "VERP" || response.results[i].Materialtype === "ZNST") {
						iPallets = iPallets + 1;
					}
				}
				if (iPallets > 1) {
					var jScannedQty = 0;
					for (var i = 0; i < response.results.length; i++) {
						if (response.results[i].Materialtype === "VERP" || response.results[i].Materialtype === "ZNST") {
							//Begin of comment by Vikram
						//	if (response.results[i - 1].Quantity === response.results[i].Quantity) {
						//		response.results[i].ScannedQuantity = response.results[i - 1].ScannedQuantity;
						//	}
						    // End of comment by Vikram
						    // begin of Insert by Vikram
						    for (var k = 0; k < response.results.length; k++) {
				if (response.results[k].Materialtype === 'FERT' && response.results[k].SalesOrder === response.results[i].SalesOrder)
                         {
                    jScannedQty = jScannedQty + parseInt(response.results[k].ScannedQuantity);
                         }
						    }
						    if (jScannedQty > 0){
						    response.results[i].ScannedQuantity = jScannedQty;
						    jScannedQty = 0;	
						    }
						    
						    }
						    // End of Insert By vikram
						
					}
				} else if (iPallets === 1) {
					var iScannedQty = 0;
					for (var i = 0; i < response.results.length; i++) {
						if (response.results[i].Materialtype !== "VERP" && response.results[i].Materialtype !== "ZNST") {
							iScannedQty = iScannedQty + parseInt(response.results[i].ScannedQuantity);
						}
					}
					for (var i = 0; i < response.results.length; i++) {
						if (response.results[i].Materialtype === "VERP" && response.results[i].Materialtype === "ZNST") {
							response.results[i].ScannedQuantity = iScannedQty;
							break;
						}
					}
				}
				that.getOwnerComponent().getModel("oDeliveryNo").setData(response);
				that.getOwnerComponent().getModel("oDeliveryNo").refresh(true);
			});

			this.getView().byId("id1").setValue("");

		},
		onPressBack: function () {
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("Home", true);
			this.getView().byId("id1").setValue("");
		},

	});

});