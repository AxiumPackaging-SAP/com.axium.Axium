sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.InvenHUMat", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		onInit: function () {
			var that = this;

			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.aData = [];
			this.oList = this.getView().byId("idList");
			//Changed by rubasri			
			this.odataService.read("/AllPlantSet", null, null, false, function (response) {
				if (that.getView().byId("idDPlant") !== undefined) {
					that.getView().byId("idDPlant").destroyItems();
				}
				for (var i = 0; i < response.results.length; i++) {
					that.getView().byId("idDPlant").addItem(
						new sap.ui.core.ListItem({
							// text: response.results[i].Material,
							// key: response.results[i].Material,
							// additionalText: response.results[i].MaterialDesc
							text: response.results[i].Plant,
							key: response.results[i].Plant,
							additionalText: response.results[i].PlantDesc

						}));
				}
			});

			this.odataService.read("/Carrier", null, null, false, function (response) {
				if (that.getView().byId("binId") !== undefined) {
					that.getView().byId("binId").destroyItems();
				}
				for (var i = 0; i < response.results.length; i++) {
					that.getView().byId("binId").addItem(
						new sap.ui.core.ListItem({
							// text: response.results[i].Material,
							// key: response.results[i].Material,
							// additionalText: response.results[i].MaterialDesc
							text: response.results[i].Carrier1,
							key: response.results[i].Carrier1,
							additionalText: response.results[i].CarrierDesc

						}));
				}
			});

			//end changes			
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
			sap.ui.getCore().initialCount = 0;
			this.getView().byId("idHUMatCount").setValue(sap.ui.getCore().initialCount);

		},
		//Changed by rubasri
		plantLoad: function (oEvent) {
			oEvent.getSource().getBinding("items").resume();
		},
		//end of change
		onBeforeShow: function () {
			this.getView().byId("idHUMatCount").setValue("0");
			var oRef = this;
			var aData = oRef.getView().getModel("InvenHUBin").getData();
			oRef.aData = [];
			oRef.getView().getModel("InvenHUBin").setData(oRef.aData);
			var oHU = oRef.getView().byId("idHUNum");
			var oMatNum = oRef.getView().byId("idMatNum");
			var oMatDesc = oRef.getView().byId("idInvenMatDesc");
			var oBatchNum = oRef.getView().byId("idBatchNum");
			var oQty = oRef.getView().byId("idQty");
			var oAddButton = oRef.getView().byId("idAdd");

			oRef.getView().byId("binId").setValue("");
			oRef.getView().byId("idDPlant").setValue("");
			oRef.getView().byId("idDSloc").setValue("");
			oRef.getView().byId("idMatNum").setValue("");
			oRef.getView().byId("idInvenMatDesc").setValue("");
			oRef.getView().byId("idBatchNum").destroyItems(); // setValue("");
			oRef.getView().byId("idQty").setValue("");

			if (sap.ui.getCore().InvenStrLocFlag === true) {
				oMatNum.setVisible(false);
				oMatDesc.setVisible(false);
				oBatchNum.setVisible(false);
				oQty.setVisible(false);
				oAddButton.setVisible(false);
				oHU.setVisible(true);
			} else {
				if (sap.ui.getCore().InvenStrLocFlag === false) {
					// oRef.odataService.read("/MaterialsSet?$filter=WareHouseNumber eq '" + sap.ui.getCore().WareHouseNum + "'",
					// 	null, null, false,
					// 	function (oData, oResponse) {
					// 		if (oRef.getView().byId("idMatNum") !== undefined) {
					// 			oRef.getView().byId("idMatNum").destroyItems();
					// 		}
					// 		for (var i = 0; i < oData.results.length; i++) {
					// 			oRef.getView().byId("idMatNum").addItem(
					// 				new sap.ui.core.ListItem({
					// 					text: oData.results[i].MaterialDesc,
					// 					//key: response.results[i].Material,
					// 					additionalText: oData.results[i].Material
					// 				}));
					// 		}
					// 	});
					// oRef.odataService.read("/MaterialsSet", null, null, false, function (response) {
					// 	if (oRef.getView().byId("idMatNum") !== undefined) {
					// 		oRef.getView().byId("idMatNum").destroyItems();
					// 	}
					// 	for (var i = 0; i < response.results.length; i++) {
					// 		oRef.getView().byId("idMatNum").addItem(
					// 			new sap.ui.core.ListItem({
					// 				// text: response.results[i].Material,
					// 				// key: response.results[i].Material,
					// 				// additionalText: response.results[i].MaterialDesc

					// 				text: response.results[i].MaterialDesc,
					// 				key: response.results[i].MaterialDesc,
					// 				additionalText: response.results[i].Material

					// 			}));
					// 	}
					// });
					oHU.setVisible(false);
					oMatNum.setVisible(true);
					oMatDesc.setVisible(true);
					oBatchNum.setVisible(true);
					oQty.setVisible(true);
					oAddButton.setVisible(true);
				}
			}
		},
		//Changed by rubasri		
		selectStorageLocation: function () {
			var plant = this.getView().byId("idDPlant").getSelectedItem().getText();
			var that = this;
			setTimeout(function () {
				that.odataService.read("/StorageLocSet?$filter=Plant eq '" + plant + "'", null, null,
					false,
					function (response) {
						if (that.getView().byId("idDSloc") !== undefined) {
							that.getView().byId("idDSloc").destroyItems();
						}
						for (var i = 0; i < response.results.length; i++) {
							that.getView().byId("idDSloc").addItem(
								new sap.ui.core.ListItem({
									text: response.results[i].StorageLocation,
									key: response.results[i].StorageLocation,

									additionalText: response.results[i].LocationDesc
								}));
						}
					});
			}, 1000);
		},
		//end of change		
		onHandleHUNumber: function () {
			var oRef = this;
			var huNumber = oRef.getView().byId("idHUNum").getValue();
			var aData = oRef.getView().getModel("InvenHUBin");
			var hFlag = false;
			// var huNumber = oRef.getView().byId("id1").getValue();
			// var materialNumber = oRef.getView().byId("id2").getValue();
			var srcPlant = sap.ui.getCore().PlantNumber;
			var srcStrLoc = sap.ui.getCore().StorageLocation;
			var bool = huNumber.startsWith("(");
			if (bool) {
				huNumber = huNumber.replace(/[^A-Z0-9]+/ig, "");
			} else {
				huNumber = huNumber;
			}
			var regExp = /^0[0-9].*$/;
			var test = regExp.test(huNumber);
			if (test || bool) {
				if (huNumber.length >= 20) {
					setTimeout(function () {
						huNumber = huNumber.replace(/[^A-Z0-9]+/ig, "");
						huNumber = huNumber.replace(/^0+/, '');
						oRef.getView().byId("idHUNum").setValue(huNumber);
						var indicator = "X";
						var aData = oRef.getOwnerComponent().getModel("InvenHUBin");
						if (aData !== undefined) {
							var aData = oRef.getOwnerComponent().getModel("InvenHUBin").getData();
							var extFlag = true;
							$.each(aData.HUBinSet, function (index, item) {

								if (item.ExternalHU === huNumber) {
									extFlag = false;
									oRef.getView().byId("idHUNum").setValue("");
									sap.m.MessageBox.alert("HU Number is already scanned", {
										title: "Information"
									});
								}
							});
						}
						// /ScannedHU?ExternalHU ="00000000002000000055" and Indicator ="X"
						// /ScannedHU?ExternalHU='" +hunumber+"'&Indicator='"+indicator+"' 

						if (extFlag) {
							// /sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/ReconHUScanned/?ExternalHU='1111'&SourcePlant='1001'&SourceSLoc='FP01'

							oRef.odataService.read("ReconHUScanned/?ExternalHU='" + huNumber + "'&SourcePlant='" + srcPlant + "'&SourceSLoc='" +
								srcStrLoc + "'", {
									success: cSuccess,
									failed: cFailed
								});

						}

						function cSuccess(data) {

							if (data.Message === "Valid HU") {
								oRef.getHUDetails(huNumber);
								// oRef.aData.push({
								// 	ExternalHU: data.ExternalHU,
								// });
								// var oModel = new sap.ui.model.json.JSONModel();

								// oModel.setData({
								// 	HUBinSet: oRef.aData
								// });
								// oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
								// oRef.getView().byId("idHUNum").setValue("");

							} else if (huNumber === "") {

							} else {
								var msg = data.Message;
								//		MessageBox.error(msg);
								//Changed by Rubasri for Cancel button issue									
								MessageBox.error(msg, {
									actions: [MessageBox.Action.CANCEL],
									emphasizedAction: MessageBox.Action.CANCEL,
									onClose: function (sAction) {
										if (sAction === "CANCEL") {
											//				oRef.onPressBack();
										}
									}
								});
								// MessageBox.error("Invalid HU");
								oRef.getView().byId("idHUNum").setValue("");
								//	this.onPressBack();
							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan Failed");
						}
					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			} else {
				if (huNumber.length >= 18) {
					setTimeout(function () {
						huNumber = huNumber.replace(/[^A-Z0-9]+/ig, "");
						huNumber = huNumber.replace(/^0+/, '');
						oRef.getView().byId("idHUNum").setValue(huNumber);
						var indicator = "X";
						var aData = oRef.getView().getModel("InvenHUBin");
						if (aData !== undefined) {
							var aData = oRef.getOwnerComponent().getModel("InvenHUBin").getData();
							var extFlag = true;
							$.each(aData.HUBinSet, function (index, item) {

								if (item.ExternalHU === huNumber) {
									extFlag = false;
									oRef.getView().byId("idHUNum").setValue("");
									sap.m.MessageBox.alert("HU Number is already scanned", {
										title: "Information"
									});
								}
							});
						}
						// /HUQtyDetailsSet?$filter=ExternalHU eq '" + fnNumber + "' and Material eq '" + tempMat + "'"
						if (extFlag) {
							// ReconHUScanned/?ExternalHU='211111'&SourcePlant='1001'&SourceSLoc='FP01'
							oRef.odataService.read("ReconHUScanned/?ExternalHU='" + huNumber + "'&SourcePlant='" + srcPlant + "'&SourceSLoc='" +
								srcStrLoc + "'", {
									success: cSuccess,
									failed: cFailed
								});

						}

						function cSuccess(data) {

							if (data.Message === "Valid HU") {
								oRef.getHUDetails(huNumber);
								// oRef.aData.push({
								// 	ExternalHU: data.ExternalHU,
								// });
								// var oModel = new sap.ui.model.json.JSONModel();

								// oModel.setData({
								// 	HUBinSet: oRef.aData
								// });
								// oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
								// oRef.getView().byId("idHUNum").setValue("");

							} else if (huNumber === "") {

							} else {
								var msg = data.Message;
								//Changed by Rubasri for Cancel button issue										
								//MessageBox.error(msg);
								MessageBox.error(msg, {
									actions: [MessageBox.Action.CANCEL],
									emphasizedAction: MessageBox.Action.CANCEL,
									onClose: function (sAction) {
										if (sAction === "CANCEL") {
											//				oRef.onPressBack();
										}
									}
								});

								// MessageBox.error("Invalid HU");
								oRef.getView().byId("idHUNum").setValue("");
							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan Failed");
						}
					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			}

		},
		getHUDetails: function (huNumber) {
			var oRef = this;
			var fnNumber = huNumber;
			var tempMat = "";
			//	var oBinNumber = this.getView().byId("binId").getValue();
			//	var oPlant = this.getView().byId("idDPlant").getValue();
			//	var oSloc = this.getView().byId("idDSloc").getValue();
			/* This is New Code for additional filters
			this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '" + fnNumber + "' and Material eq '" + tempMat +
				"' and Carrier eq '" + oBinNumber + "' and StorageLocation eq '" + oSloc + "' and DestPlant eq '" + oPlant + "'", {
					// this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '00000000002000057331' and Material eq '000000003000000724' and ScannedQnty eq '0' and RequirementQnty eq '41600.000' and BinNumber eq 'U_ZONE'", {
					success: cSuccess,
					failed: cFailed
				}); */
			this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '" + fnNumber + "' and Material eq '" + tempMat + "'", {
				// this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '00000000002000057331' and Material eq '000000003000000724' and ScannedQnty eq '0' and RequirementQnty eq '41600.000' and BinNumber eq 'U_ZONE'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data) {

				if (data.results.length === 0) {
					oRef.getView().byId("idHUNum").setValue("");
					var oInput = oRef.getView().byId("idHUNum");
					oInput.focus();
					MessageBox.information("HU already Scanned");
				};
				var huBatch = data.results[0].BatchNo;
				var hu = data.results[0].HU;
				var ScannedQty = data.results[0].ScannedQnty;
				var Material = data.results[0].Material;
				var MatDesc = data.results[0].MaterialDesc;
				// oRef.getView().byId("idBatchNum").setValue
				// idQty
				oRef.aData.push({
					ExternalHU: hu,
					Material: Material,
					MatDesc: MatDesc,
					StorageLocation: sap.ui.getCore().StorageLocation,
					Plant: sap.ui.getCore().PlantNumber,
					BatchNumber: huBatch,
					Quantity: ScannedQty
				});
				var oModel = new sap.ui.model.json.JSONModel();

				oModel.setData({
					HUBinSet: oRef.aData
				});
				oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
				oRef.getView().byId("idHUNum").setValue("");
				var huMatCount = oRef.getView().byId("idHUMatCount").getValue();
				sap.ui.getCore().initialCount = parseFloat(huMatCount) + 1;
				oRef.getView().byId("idHUMatCount").setValue(sap.ui.getCore().initialCount);

				setTimeout(function () {
					var oInput = oRef.getView().byId("idHUNum");
					oInput.focus();
				}, 1000);

			}

			function cFailed() {

			}

		},
		// selectMaterial: function (oEvent) {
		// 	sap.ui.getCore().globalMat = this.getView().byId("idMatNum").getSelectedItem().getAdditionalText();
		// },
		invenMatValidate: function () {
			var oRef = this;
			var mat = oRef.getView().byId("idMatNum").getValue();
			oRef.odataService.read("/MaterialSet('" + mat + "')", null, null, false, function (oData, oResponse) {
					var matdesc = oResponse.data.MaterialDesc;
					oRef.getView().byId("idInvenMatDesc").setValue(matdesc);
					// oRef.MatScan(mat);
					// console.log(oResponse);
				},
				function (oData, oResponse) {
					// console.log(oResponse);
					var error = JSON.parse(oData.response.body);
					var errorMsg = error.error.message.value;
					if (errorMsg === "Material Not Found.") {
						oRef.getView().byId("idMatNum").setValue("");
						MessageBox.error("Please scan a correct material");
						oRef.getView().byId("idMatNum").setValue("");
						MessageBox.error("Please scan a correct material");
					}
				}
			);

			oRef.getView().byId("idBatchNum").destroyItems();
			var oFilterMat = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, mat);
			var oFilterPlnt = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().PlantNumber);
			var oFilterStor = new sap.ui.model.Filter("StorageLocation", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().StorageLocation);

			this.getView().getModel().read("/ZC_BATCH_STOCK", {
				filters: [oFilterMat, oFilterPlnt, oFilterStor],

				success: function (oData, response) {
					if(oData.results !== undefined && oData.results.length > 0) {
						oRef.getView().byId("idBatchNum").setVisible(true);
						oRef.getView().byId("idBatchNum").setEnabled(true);
						for (var i = 0; i < oData.results.length; i++) {
							oRef.getView().byId("idBatchNum").addItem(
								new sap.ui.core.ListItem({
									text: oData.results[i].Batch,
									key: oData.results[i].Batch,
									additionalText: oData.results[i].Batch

							}));
						}
					}
				},
				error: function (oData, oResponse) {
					var error = JSON.parse(oData.response.body);
					MessageBox.error(error);
				}
			});
		},
		onAddMaterial: function () {
			var oRef = this;
			var oMat = oRef.getView().byId("idMatNum").getValue();
			var oBatchNo = oRef.getView().byId("idBatchNum").getSelectedItem().getText(); // getValue();
			var oQty = oRef.getView().byId("idQty").getValue();
			var oMatDesc = oRef.getView().byId("idInvenMatDesc").getValue();
			oRef.aData.push({
				ExternalHU: "",
				StorageLocation: sap.ui.getCore().StorageLocation,
				Plant: sap.ui.getCore().PlantNumber,
				BatchNumber: oBatchNo,
				Quantity: oQty,
				Material: oMat,
				MatDesc: oMatDesc
			});
			var oModel = new sap.ui.model.json.JSONModel();

			oModel.setData({
				HUBinSet: oRef.aData
			});
			oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
			oRef.getView().byId("idMatNum").setValue("");
			oRef.getView().byId("idInvenMatDesc").setValue("");
			oRef.getView().byId("idBatchNum").setValue("");
			oRef.getView().byId("idQty").setValue("");
			var huMatCount = oRef.getView().byId("idHUMatCount").getValue();
			sap.ui.getCore().initialCount = parseFloat(huMatCount) + 1;
			oRef.getView().byId("idHUMatCount").setValue(sap.ui.getCore().initialCount);

			oRef.getView().byId("idBatchNum").destroyItems();
		},
		onPressBack: function () {
			var oRef = this;
			var oHU = oRef.getView().byId("idHUNum");
			var oMatNum = oRef.getView().byId("idMatNum");
			oRef.getView().byId("idHUMatCount").setValue("0");
			oRef.getView().byId("binId").setValue("");
			oRef.getView().byId("idDPlant").setValue("");
			oRef.getView().byId("idDSloc").setValue("");
			oRef.getView().byId("idMatNum").setValue("");
			oRef.getView().byId("idInvenMatDesc").setValue("");
			oRef.getView().byId("idBatchNum").setValue("");
			oRef.getView().byId("idQty").setValue("");

			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("InventoryPlntStrloc", true);
			oHU.setVisible(true);
			oMatNum.setVisible(true);
		},
		onDelete: function () {
			var that = this;
			that.oModel = that.getView().getModel("InvenHUBin");
			var data = that.getView().getModel("InvenHUBin").getData(that.result);

			that.oList = that.byId("idList");

			var sItems = that.oList.getSelectedItems();

			if (sItems.length === 0) {
				MessageBox.information("Please Select a row to Delete");
				return;
			} else {

				for (var i = sItems.length - 1; i >= 0; i--) {
					var path = sItems[i].getBindingContextPath();
					var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
					data.HUBinSet.splice(idx, 1);
				}
				that.getView().getModel("InvenHUBin").refresh(true);
				var huMatCount = that.getView().byId("idHUMatCount").getValue();
				sap.ui.getCore().initialCount = parseFloat(huMatCount) - 1;
				that.getView().byId("idHUMatCount").setValue(sap.ui.getCore().initialCount);
			}
			that.oList.removeSelections();
		},
		binNumberValidation: function () {
			var oRef = this;
			var oInvenbinFlag = false;
			var tempVar = oRef.getView().byId("binId").getValue();
			oRef.getView().byId("binId").setValue(tempVar);
			// if ((tempVar.length >= 5) || (tempVar.length >= 6) || (tempVar.length >= 7) || (tempVar.length >=
			// 		8) || (tempVar.length >= 9) || (tempVar.length >= 10)) {
			// if (tempVar.length <= 10) {
			setTimeout(function () {
				oRef.getView().byId("binId").setValue(tempVar);
				console.log(tempVar);

				// oRef.odataService.read("/ScannedBinNumber?BinNumber='" + tempVar + "'", {

				// 	success: cSuccess,
				// 	failed: cFailed
				// });

				// function cSuccess(data) {

				// 	if (data.Message === "valid Bin") {

				// 	} else if (tempVar === "") {
				// 		MessageBox.error("Please Scan Valid Bin Number");
				// 		oRef.getView().byId("binId").setValue("");
				// 	} else {
				// 		MessageBox.error("Invalid Bin");
				// 		oRef.getView().byId("binId").setValue("");
				// 	}

				// }

				// function cFailed() {
				// 	MessageBox.error("Bin Number Scan failed");
				// 	oRef.getView().byId("binId").setValue("");

				// }
			}, 1000);

			// } else {
			// 	// setTimeout(function () {
			// 	// 	MessageBox.error("Please Scan Valid Bin Number");
			// 	// 	oRef.getView().byId("idBin").setValue("");
			// 	// }, 1500);
			// 	oInvenbinFlag = true;
			// 	return oInvenbinFlag;
			// }

		},
		dPlantValidation: function () {
			var oRef = this;
			var dPlant = oRef.getView().byId("idDPlant").getValue();
			oRef.odataService.read("/ReconPlantValidation?Plant='" + dPlant + "'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data, response) {
				console.log(response);
				if (response.data.Message === "INVALID") {
					oRef.getView().byId("idDPlant").setValue("");
					MessageBox.error("Please scan a valid plant");
				}

			}

			function cFailed(data, response) {
				// console.log(response);
			}

		},
		dSlocValidation: function () {
			var oRef = this;
			var dPlant = oRef.getView().byId("idDPlant").getValue();
			var dSloc = oRef.getView().byId("idDSloc").getValue();
			// ReconSlocValidation ? Sloc = 'FP01' & Plant = '1001' / ReconSlocValidation ? Plant = '" + dPlant + "'
			// and Sloc = '" + dSloc + "'
			// "
			// /ReconSlocValidation?Sloc='" + dSloc + "'& Plant='" + dPlant + "'"
			// ReconSlocValidation?Sloc='FP01'&Plant='1001' 
			// "/ReconSlocValidation?Plant = '" + dPlant + "'&Sloc = '" + dSloc + "'"
			oRef.odataService.read("/ReconSlocValidation?Sloc='" + dSloc + "'&Plant='" + dPlant + "'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data, response) {
				console.log(response);
				if (response.data.Message === "INVALID") {
					oRef.getView().byId("idDSloc").setValue("");
					MessageBox.error("Please scan a valid storage location");
				} else if (response.data.Message === "Enter Plant and Storage Location") {
					oRef.getView().byId("idDSloc").setValue("");
					MessageBox.error("Please scan destination plant first");
				} else {
					var oRef = this;
					setTimeout(function () {
						var oInput = oRef.getView().byId("idHUNum");
						oInput.focus();
					}, 1000);
				}

			}

			function cFailed(data, response) {

			}
		},
		onInvenSubmit: function () {
			var oBinNumber = this.getView().byId("binId").getValue();
			var oPlant = this.getView().byId("idDPlant").getValue();
			var oSloc = this.getView().byId("idDSloc").getValue();

			if (oBinNumber === "" || oPlant === "" || oSloc === "") {
				MessageBox.error("Please scan all the mandatory fields");
			} else {
				var data = {};
				data.NavReconHeadItems = [];
				var result = this.oList.getModel("InvenHUBin").getData();
				var oRef = this;
				data.Plant = sap.ui.getCore().PlantNumber;
				data.StorageLocation = sap.ui.getCore().StorageLocation;
				$.each(result.HUBinSet, function (index, item) {
					var temp = {};
					temp.Plant = sap.ui.getCore().PlantNumber;
					temp.StorageLoc = sap.ui.getCore().StorageLocation;
					temp.Batch = item.BatchNumber;
					temp.Scannedqty = item.Quantity;
					// temp.Scannedqty = "2";
					temp.Material = item.Material;
					temp.Handlingunit = item.ExternalHU;
					temp.Carrier = oBinNumber;
					temp.DPlant = oPlant;
					temp.DSloc = oSloc;
					data.NavReconHeadItems.push(temp);
				});
				this.odataService.create("/ReconAppHeaderSet", data, null, function (odata, response) {
					var matDoc = response.data.Carrier;
					if (matDoc === "") {
						var msg = "All HU's are saved successfully. CSR will take care of posting";
					} else {
						var msg = "Goods Movement is Successful, Material Document Number is: " + matDoc + "";
					}

					// MessageBox.success("Data Saved");
					MessageBox.success(msg, {
						title: "Success",
						Action: "OK",
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								// oRef.getView().byId("idList").destroyItems();
								var sHistory = History.getInstance();
								var sPreviousHash = sHistory.getPreviousHash();
								if (sPreviousHash !== undefined) {
									window.history.go(-1);
									oRef.onPressBack();
								}
							}
						}.bind(oRef),
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}, function (response) {
					console.log(response);
					var msg = '';
					if(response.response.body !== undefined && response.response.body !== ''){
						var error = JSON.parse(response.response.body);
						var msg = "";
						if(error.error.innererror.errordetails !== undefined && error.error.innererror.errordetails.length > 1) {
							for(var i=0; i<error.error.innererror.errordetails.length; i++){
								if(i === 0){
									msg = error.error.innererror.errordetails[0].message;
								} else {
									msg = msg + " , " + error.error.innererror.errordetails[i].message;
								}
							}
						} else if (error.error.innererror.errordetails !== undefined && error.error.innererror.errordetails.length === 1) {
							msg = error.error.innererror.errordetails[0].message;
						}
						
						// var msg = response.error.error.innererror.errordetails;
						// MessageBox.information(msg, {
						MessageBox.error(msg, {
							title: "Error",
							Action: "Close",
							onClose: function (oAction) {
								if (oAction === "CLOSE") {
									var sHistory = History.getInstance();
									var sPreviousHash = sHistory.getPreviousHash();
									if (sPreviousHash !== undefined) {
									//	oRef.getView().byId("binId").setValue("");
									//	oRef.getView().byId("idHUMatCount").setValue("0");
										window.history.go(-1);
										oRef.onPressBack();
									}
								}
							}.bind(oRef),
							//	}

							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}
					
				});
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onExit: function() {
		//
		//	}
	});

});