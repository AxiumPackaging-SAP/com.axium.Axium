sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";
	var scan = 0;
	return Controller.extend("com.axium.Axium.controller.STRHUScan", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.STRHUScan
		 */
		onInit: function () {
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.oList = this.getView().byId("idList");
			this.result = {};
			this.aData = [];
			this.result.items = [];
			sap.ui.getCore().scan = 0;
			//var oModel = this.getView().getModel("STRSTOHuItemScan").getData();
			//this.getView().getModel("STRSTOHuItemScan");
			//this.getView().setModel("STRSTOHuItemScan");
			sap.ui.getCore().saveFlag = false;
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		onBeforeShow: function () {
			var oRef = this;
			var total = 1;
			//var aData = oRef.getView().getModel("oListHU").getData();
			var aData = oRef.getView().getModel("STRSTOHuItemScan").getData();
			oRef.aData = [];
			// oRef.getView().getModel("STRSTOHuItemScan");
			// oRef.getView().setModel("STRSTOHuItemScan");
			for (var i = 0; i < aData.results.length; i++) {
				oRef.aData.push({
					ExternalHU: aData.results[i].HuNumber,
					BatchNo: aData.results[i].Batch,
					Quantity: aData.results[i].Quantity,
					UOM: aData.results[i].UOM,
					Scanned: "NO"
				});
				var scan = parseInt(i) + parseInt(total);
			}
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				HUSet: oRef.aData
			});

			oRef.getOwnerComponent().setModel(oModel, "STRSTOHuItemScan");

			oRef.getView().byId("idSTRRequiredPallets").setValue(scan);
			//oRef.getView().getModel("STRSTOHuItemScan").refresh(true);
			//this.getView().byId("idList").destroyItems();
		},
		onPressBack: function () {
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("STRSTOScan", true);
			this.getView().byId("idSTRHU").setValue("");
			var oRef = this;
			var aData = oRef.getView().getModel("oListHU").getData();
			//oRef.aData = [];
			oRef.getView().getModel("oListHU").setData(oRef.aData);
			oRef.getView().getModel("oListHU").refresh(true);
			this.getView().byId("idList").destroyItems();
			// var aData = oRef.getView().getModel("STRMatDocMaterials").getData();
			// var sQuantity = oRef.getView().byId("idSTRScannedPallets").getValue();
			// aData.results[sap.ui.selectedIndex].ScannedQuantity = "2";
			// oRef.getView().getModel("STRMatDocMaterials").refresh(true);
		},
		validateHU: function () {
			var oRef = this;
			oRef.aData2 = [];
			var HuNumber = oRef.getView().byId("idSTRHU").getValue();
			var size = HuNumber.length;
			for (var k = size; k < 20; k++) {
				HuNumber = 0 + HuNumber;
			}
			var aData2 = oRef.getView().getModel("STRSTOHuItemScan").getData();
			//oRef.getView().byId("idSTRHU").setValue(" ");
			var aData1 = [];
			var Scanvalue = "NO";
			var scanval = 1;
			for (var i = 0; i < aData2.HUSet.length; i++) {
				if (HuNumber === aData2.HUSet[i].ExternalHU || aData2.HUSet[i].Scanned === "Yes") {
					Scanvalue = "Yes";
					// oRef.getView().byId("idSTRScannedPallets").getValue();
					//if (scan === "NaN") {

					//var scan = parseInt(i) + parseInt(scanval);
					//	scan = parseInt(scan) + parseInt(scanval);
					//oRef.getView().byId("idSTRScannedPallets").setValue(scan);
					//}
					//var scanval = parseInt(scanval) + parseInt(scan);
					//oRef.getView().byId("idSTRScannedPallets").setValue(scanval);

				}
				oRef.aData2.push({
					ExternalHU: aData2.HUSet[i].ExternalHU,
					BatchNo: aData2.HUSet[i].BatchNo,
					Quantity: aData2.HUSet[i].Quantity,
					UOM: aData2.HUSet[i].UOM,
					Scanned: Scanvalue
				});
				Scanvalue = "NO";
			}
			scan = parseInt(scan) + parseInt(scanval);
			oRef.getView().byId("idSTRScannedPallets").setValue(scan);
			oRef.getView().byId("idSTRHU").setValue("");

			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.setData({
				HUSet: oRef.aData2
			});

			oRef.getOwnerComponent().setModel(oModel1, "STRSTOHuItemScan");
			// var oRef = this;
			// var hFlag = false;
			// var rQuantity = oRef.getView().byId("idSTRRequiredPallets").getValue();
			// var sQuantity = oRef.getView().byId("idSTRScannedPallets").getValue();
			// sQuantity = parseFloat(sQuantity);
			// rQuantity = parseFloat(rQuantity);

			// if (sQuantity < rQuantity) {
			// 	var tempVar = oRef.getView().byId("idSTRHU").getValue();
			// 	var materialDocNumber = oRef.getView().byId("idSTRMatDocNum").getValue();
			// 	var bool = tempVar.startsWith("(");
			// 	if (bool) {
			// 		tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
			// 	} else {
			// 		tempVar = tempVar;
			// 	}
			// 	var regExp = /^0[0-9].*$/;
			// 	var test = regExp.test(tempVar);
			// 	if (test || bool) {
			// 		if (tempVar.length >= 20) {
			// 			setTimeout(function () {
			// 				tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
			// 				tempVar = tempVar.replace(/^0+/, '');
			// 				oRef.getView().byId("idSTRHU").setValue(tempVar);
			// 				var aData = oRef.getView().getModel("oListHU");
			// 				if (aData != undefined) {
			// 					var aData = oRef.getOwnerComponent().getModel("oListHU").getData();
			// 					var extFlag = true;

			// 					$.each(aData.HUSet, function (index, item) {
			// 						if (item.ExternalHU === tempVar) {
			// 							extFlag = false;
			// 							oRef.getView().byId("idSTRHU").setValue("");
			// 							sap.m.MessageBox.alert("HU Number is already scanned", {
			// 								title: "Information"
			// 							});
			// 						}
			// 					});
			// 				}
			// 				if (extFlag) {
			// 					oRef.odataService.read("/MaterialDocHUValidation/?MaterialDocNo='" + materialDocNumber + "'&ExternalHU='" + tempVar + "'", {
			// 						success: cSuccess,
			// 						failed: cFailed
			// 					});
			// 				}

			// 				function cSuccess(data) {

			// 					if (data.Message === "Valid") {
			// 						oRef.HUDetails();
			// 					} else if (tempVar === "") {

			// 					} else {
			// 						MessageBox.error("Please scan a correct HU");
			// 						oRef.getView().byId("idSTRHU").setValue("");
			// 					}

			// 				}

			// 				function cFailed() {
			// 					MessageBox.error("HU Number Scan Failed");
			// 				}
			// 			}, 1000);
			// 		} else {
			// 			hFlag = true;
			// 			return hFlag;
			// 		}
			// 	} else {
			// 		if (tempVar.length >= 18) {
			// 			setTimeout(function () {
			// 				tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
			// 				tempVar = tempVar.replace(/^0+/, '');
			// 				oRef.getView().byId("idSTRHU").setValue(tempVar);
			// 				var tempMat = oRef.getView().byId("idSTRMatDocNum");
			// 				var aData = oRef.getView().getModel("oListHU");
			// 				if (aData != undefined) {
			// 					var aData = oRef.getOwnerComponent().getModel("oListHU").getData();
			// 					var extFlag = true;

			// 					$.each(aData.HUSet, function (index, item) {

			// 						if (item.ExternalHU === tempVar) {
			// 							extFlag = false;
			// 							oRef.getView().byId("idSTRHU").setValue("");
			// 							sap.m.MessageBox.alert("HU Number is already scanned", {
			// 								title: "Information"
			// 							});
			// 						}
			// 					});
			// 				}
			// 				if (extFlag) {

			// 					oRef.odataService.read("/MaterialDocHUValidation/?MaterialDocNo='" + materialDocNumber + "'&ExternalHU='" + tempVar + "'", {
			// 						success: cSuccess,
			// 						failed: cFailed
			// 					});
			// 				}

			// 				function cSuccess(data) {

			// 					if (data.Message === "Valid") {
			// 						oRef.HUDetails();
			// 					} else if (tempVar === "") {

			// 					} else {
			// 						MessageBox.error("Please scan a correct HU");
			// 						oRef.getView().byId("idSTRHU").setValue("");
			// 					}

			// 				}

			// 				function cFailed() {
			// 					MessageBox.error("HU Number Scan Failed");
			// 				}
			// 			}, 1000);
			// 		} else {

			// 			hFlag = true;
			// 			return hFlag;
			// 		}
			// 	}

			// } else {
			// 	MessageBox.error("HU Picking Completed");
			// 	oRef.getView().byId("idSTRHU").setValue("");
			// }

		},
		HUDetails: function () {
			var oRef = this;
			var tempVar = oRef.getView().byId("idSTRHU").getValue();
			var materialNumber = oRef.getView().byId("idSTRMaterialNumber").getValue();
			this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '" + tempVar + "' and Material eq '" + materialNumber + "'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data) {

				oRef.aData.push({
					ExternalHU: data.results[0].HU,
					BatchNo: data.results[0].BatchNo,
					ScannedQnty: data.results[0].ScannedQnty
				});

				var oModel = new sap.ui.model.json.JSONModel();

				oModel.setData({
					HUSet: oRef.aData
				});
				oRef.getView().byId("idSTRHU").setValue("");
				oRef.getOwnerComponent().setModel(oModel, "oListHU");
				var sQuantity = oRef.getView().byId("idSTRScannedPallets").getValue();
				sQuantity = parseFloat(sQuantity);
				sQuantity = sQuantity + 1;
				oRef.getView().byId("idSTRScannedPallets").setValue(sQuantity);
			}

			function cFailed() {
				MessageBox.error("HU Scan Failed");
			}
		},

		strStoPost: function () {
			var oRef = this;
			var BinNo = "PGR"
			var data = {};
			var MaterialNo = oRef.getView().byId("idSTRMaterialNumber").getValue();
			data.InBoundItemDetailsSet = [];
			data.Material = MaterialNo;
			data.BinNumber = BinNo;
			data.Delivery = sap.ui.getCore().matDocNum;
			data.Message = "";

			this.odataService.create("/InBoundHeaderDetailsSet", data, null, function (odata, response) {
				var message = response.data.Message;
				if (response.data.Message === "Error") {
					MessageBox.error("Error in Posting");
				} else {
					MessageBox.success("Material Movement Successful", {
						title: "Success",
						Action: "OK",
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//		oRef.getView().byId("doorid").setValue("");
								//oRef.strStoPost();
								var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
								sRouter.navTo("ScanMaterialDocument", true);
							}
						}.bind(oRef),
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});

		},
		onSave: function () {
			var oRef = this;
			var postcheck = "Y";
			var MaterialNo = oRef.getView().byId("idSTRMaterialNumber").getValue();
			//var BinNo = oRef.getView().byId("idSTRBIN").getValue();
			var BinNo = "A14"
			if (BinNo === "" || BinNo === "undefined") {
				MessageBox.error("Kindly Enter Bin Number");
				postcheck = "N";
			}
			// sQuantity = parseFloat(sQuantity);
			// rQuantity = parseFloat(rQuantity);
			// if (sQuantity < rQuantity) {
			// 	MessageBox.error("Please scan all required pallets");
			// } else {
			// 	var aData = oRef.getView().getModel("STRMatDocMaterials").getData();
			// 	var sQuantity = oRef.getView().byId("idSTRScannedPallets").getValue();
			// 	aData.results[sap.ui.selectedIndex].ScannedQuantity = sQuantity;
			// 	oRef.getView().getModel("STRMatDocMaterials").refresh(true);
			// 	sap.ui.getCore().saveFlag = true;

			// 	var aData = oRef.getView().getModel("oListHU").getData();
			// 	oRef.aData = [];
			// 	oRef.getView().getModel("oListHU").setData(oRef.aData);
			// 	oRef.getView().getModel("oListHU").refresh(true);
			// 	this.getView().byId("idList").destroyItems();
			// 	var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// 	sRouter.navTo("STRMaterials", true);
			// 	oRef.getView().byId("idSTRHU").setValue("");
			// }
			var data = {};
			data.InBoundItemDetailsSet = [];
			data.Material = MaterialNo;
			data.BinNumber = BinNo;
			data.Delivery = sap.ui.getCore().matDocNum;
			data.Message = "";

			var result = oRef.getView().getModel("STRSTOHuItemScan").getData();
			for (var i = 0; i < result.HUSet.length; i++) {
				if (result.HUSet[i].Scanned === "NO") {
					MessageBox.error("Kindly Scan All HU To Proceed");
					postcheck = "N";
					break;
				}

			}

			$.each(result.HUSet, function (index, item) {
				var temp = {};
				temp.ExternalHu = item.ExternalHU;
				temp.Batch = item.BatchNo;

				data.InBoundItemDetailsSet.push(temp);
			});
			if (postcheck === "Y") {
				this.odataService.create("/InBoundHeaderDetailsSet", data, null, function (odata, response) {
					var message = response.data.Message;
					if (response.data.Message === "Error") {
						MessageBox.error("Error in Posting");
					} else {
						MessageBox.success("Transfer Order Creation Successful", {
							title: "Success",
							Action: "OK",
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									//oRef.getView().byId("doorid").setValue("");
									oRef.strStoPost();
									//var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
									//sRouter.navTo("ScanMaterialDocument", true);
								}
							}.bind(oRef),
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}

				});
			}
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.axium.Axium.view.STRHUScan
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.axium.Axium.view.STRHUScan
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.axium.Axium.view.STRHUScan
		 */
		//	onExit: function() {
		//
		//	}

	});

});