sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/Text"
], function (Controller, History, MessageBox, Button, Dialog, MessageToast, Text) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.PhysicalInventoryIM", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.PhysicalInventoryIM
		 */
		onInit: function () {
			var oRef = this;
			var data = [];
			oRef.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.aData = [];
			this.oList = this.getView().byId("idList");
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		onBeforeShow: function () {
			var oModel = this.getView().getModel("PYIMListLocalModel");
			oModel.setData({
				bNotRM01: true,
				bRM01: false
			});
			this.getOwnerComponent().setModel(oModel, "PYIMListLocalModel");

			var aData = this.getView().getModel("oBoxQtyModel").getData();
			this.getView().getModel("oBoxQtyModel").setData([]);

			if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1") {
				this.getView().byId("binNumber").setVisible(true);
				// 30/11/2020	this.getView().byId("palletsNumber").setVisible(true);
				// 30/11/2020	this.getView().byId("scannedpalletsNumber").setVisible(true);
				this.getView().byId("matNumber").setVisible(true);
				this.getView().byId("materialDesc").setVisible(true);
				this.getView().byId("BatchNumber").setVisible(true);
				// this.getView().byId("palletsNumber").setVisible(false);
				// 30/11/2020 this.getView().byId("scannedpalletsNumber").setVisible(false);
				/*	this.getView().byId("NoPalletCBID").setSelected(true);
					this.getView().byId("Quantity").setEnabled(false);
					this.getView().byId("palletsNumber").setEnabled(false);*/
				/*this.getView().byId("palletsNumberLbl").setVisible(false);
				this.getView().byId("palletsNumber").setVisible(false);
				this.getView().byId("scannedpalletsNumberLbl").setVisible(false);
				this.getView().byId("scannedpalletsNumber").setVisible(false);
				this.getView().byId("BoxLbl").setVisible(false);
				this.getView().byId("Box").setVisible(false);
				this.getView().byId("Box").setVisible(false);*/

				var oHeaderModel = this.getView().getModel("PYIMListLocalModel");
				oHeaderModel.setProperty("/bNotRM01", false);
				oHeaderModel.setProperty("/bRM01", true);

			} else {
				this.getView().byId("binNumber").setVisible(true);
				// commented on 30/11/2020
				//	this.getView().byId("palletsNumber").setVisible(true);
				// this.getView().byId("scannedpalletsNumber").setVisible(true);
				//End of comment	
				this.getView().byId("matNumber").setVisible(true);
				this.getView().byId("materialDesc").setVisible(true);
				this.getView().byId("BatchNumber").setVisible(true);
				// this.getView().byId("palletsNumber").setVisible(true);
				// commented on 30/11/2020
				// this.getView().byId("scannedpalletsNumber").setVisible(true);
				//End of comment
				/*	this.getView().byId("NoPalletCBID").setSelected(false);
					this.getView().byId("Quantity").setEnabled(true);
					this.getView().byId("palletsNumber").setEnabled(true);*/
			}
		},
		onCBSelect: function (oEvent) {
			var val = oEvent.getSource().getSelected();
			if (val) {
				this.getView().byId("Quantity").setEnabled(false);
				this.getView().byId("palletsNumber").setEnabled(false);
			} else {
				this.getView().byId("Quantity").setEnabled(true);
				this.getView().byId("palletsNumber").setEnabled(true);
			}

		},
		onPressBack: function () {
			var that = this;
			that.getView().byId("binNumber").setValue("");
			// 30/11/2020	that.getView().byId("palletsNumber").setValue("");
			that.getView().byId("binNumber").setEnabled(true);

			/*var NoPalletCB = that.getView().byId("NoPalletCBID").getSelected();
			if (NoPalletCB) {

				that.getView().byId("palletsNumber").setEnabled(false);
			} else {
			}*/
			// 30/11/2020	that.getView().byId("palletsNumber").setEnabled(true);

			// 30/11/2020	that.getView().byId("scannedpalletsNumber").setValue("0");
			that.getView().byId("matNumber").setValue("");
			that.getView().byId("materialDesc").setValue("");
			that.getView().byId("BatchNumber").setValue("");
			that.getView().byId("Box").setValue("");
			var aData = that.getView().getModel("PYIMListModel").getData();
			that.aData = [];
			that.getView().getModel("PYIMListModel").setData(that.aData);
			var sRouter = sap.ui.core.UIComponent.getRouterFor(that);
			sRouter.navTo("PlantStorageLoc", true);
		},
		onBinValidation: function () {
			var oRef = this;
			var oBinNumber = oRef.getView().byId("binNumber").getValue();
			oRef.odataService.read("/ScannedBinNumber?BinNumber='" + oBinNumber + "'", null,
				null, false,
				function (data) {
					oRef.getView().byId("binNumber").setEnabled(false);
					setTimeout(function () {
						var oInput = oRef.getView().byId("palletsNumber");
						oInput.focus();
					}, 1000);
				},
				function () {
					MessageBox.error("Invalid Bin");
					oRef.getView().byId("binNumber").SetValue("");
				}
			);
		},
		onClearBin: function () {
			var oRef = this;
			// var data = oRef.getView().getModel("PYIMListModel").getData(oRef.result);
			oRef.getView().byId("binNumber").setEnabled(true);
			/*var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();
			if (NoPalletCB) {

				oRef.getView().byId("palletsNumber").setEnabled(false);
			} else {
			}*/
			// 30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

			oRef.getView().byId("binNumber").setValue("");
			// 30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
			// 30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
			oRef.getView().byId("Quantity").setValue("");
			oRef.getView().byId("matNumber").setValue("");
			oRef.getView().byId("materialDesc").setValue("");
			oRef.getView().byId("BatchNumber").setValue("");
			oRef.getView().byId("Box").setValue("");
			var aData = oRef.getView().getModel("PYIMListModel").getData();
			oRef.aData = [];
			oRef.getView().getModel("PYIMListModel").setData(oRef.aData);

		},
		onNextBin: function () {
			var oRef = this;
			oRef.getView().byId("binNumber").setEnabled(true);
			/*var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();
			if (NoPalletCB) {

				oRef.getView().byId("palletsNumber").setEnabled(false);
			} else {
			}*/
			// 30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

			oRef.getView().byId("binNumber").setValue("");
			// 30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
			// 30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
			oRef.getView().byId("Quantity").setValue("");
			oRef.getView().byId("matNumber").setValue("");
			oRef.getView().byId("materialDesc").setValue("");
			oRef.getView().byId("BatchNumber").setValue("");
		},
		onMaterialValidate: function () {
			var oRef = this;
			var mat = oRef.getView().byId("matNumber").getValue();
			oRef.odataService.read("/MaterialSet('" + mat + "')", null, null, false, function (oData, oResponse) {
					var matdesc = oResponse.data.MaterialDesc;
					oRef.getView().byId("materialDesc").setValue(matdesc);
					/*var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();
					if (NoPalletCB) {

						oRef.getView().byId("palletsNumber").setEnabled(false);
					} else {
					}*/
					// 30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

				},
				function (oData, oResponse) {
					// console.log(oResponse);
					// var error = JSON.parse(oData.response.body);
					// var errorMsg = error.error.message.value;
					// if (errorMsg === "Material Not Found.") {
					// 	oRef.getView().byId("idMaterialDescription").setValue("");
					// 	MessageBox.error("Please scan a correct material");
					// } 
					// else {
					// 	oRef.getView().byId("idMaterialDescription").setValue("");
					// 	MessageBox.error("Please scan a correct material");
					// }

					oRef.getView().byId("matNumber").setValue("");
					MessageBox.error("Please scan a correct material");
				}
			);
		},
		onAddMaterial: function () {
			var oRef = this;

			var oBinNumber = oRef.getView().byId("binNumber").getValue();
			//Added on 30/11/2020	
			var requiredPallets = "",
				scannedPallets;
			// 30/11/2020	var requiredPallets = oRef.getView().byId("palletsNumber").getValue();
			var oQuantity = oRef.getView().byId("Quantity").getValue();
			var oMaterialNumber = oRef.getView().byId("matNumber").getValue();
			var oMaterialDescription = oRef.getView().byId("materialDesc").getValue();
			var oBatch = oRef.getView().byId("BatchNumber").getValue();

			var Box = oRef.getView().byId("Box").getValue();
			// 30/11/2020	var scannedPallets = oRef.getView().byId("scannedpalletsNumber").getValue();
			var oPlant = sap.ui.getCore().plnt;

			// var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();

			// var decimalRequiredPallets = parseFloat(requiredPallets);
			if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1" ) {
				oRef.RM01MaterialAdd();
			} else {

				var bError = false;

				if (oBinNumber === "") {
					bError = true;
				}
				// commented on 30/11/2020
				// if (oQuantity === "") {
				// 	/*	if (NoPalletCB) {

				// 		} else {
				// 		}*/
				// 	bError = true;
				// }
				//30/11/2020
				if (oMaterialNumber === "") {
					bError = true;
				}
				if (oMaterialDescription === "") {
					bError = true;
				}
				//commented on 30/11/2020
				// if (requiredPallets === "") {
				// 	/*if (NoPalletCB) {

				// 	} else {
				// 	}*/
				// 	bError = true;
				// }
				//  30/11/2020
				if (bError) {

					MessageBox.error("Please scan all mandatory fields");
				} else {
					this.odataService.read("/IMValidateRecordNewSet(BinNumber='" + oBinNumber +
						"',RequiredPallets='" + requiredPallets + "',Material='" + oMaterialNumber +
						"',BatchNo='" + oBatch + "',Plant='" + oPlant + "',Sloc='" + sap.ui.getCore().stgloc + "')",
						null, null,
						false,
						function (data, response) {
							// console.log(data);
							// console.log(response);
							var oMessage = response.data.Message;
							if (oMessage === "X") {
								oRef.getView().byId("binNumber").setValue("");
								// 30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
								oRef.getView().byId("binNumber").setEnabled(true);
								/*if (NoPalletCB) {

									oRef.getView().byId("palletsNumber").setEnabled(false);
								} else {
								}*/
								/* commented on 30/11/2020
								oRef.getView().byId("palletsNumber").setEnabled(true);
								oRef.getView().byId("scannedpalletsNumber").setValue("0");
								 30/11/2020 */
								oRef.getView().byId("Quantity").setValue("");
								oRef.getView().byId("matNumber").setValue("");
								oRef.getView().byId("materialDesc").setValue("");
								oRef.getView().byId("BatchNumber").setValue("");
								oRef.getView().byId("Box").setValue("");
								MessageBox.error("Data Already Saved in Table");
							} else {
								var aData = oRef.getView().getModel("PYIMListModel");
								if (aData !== undefined) {
									// var aData = oRef.getOwnerComponent().getModel("oListHUCpy").getData();
									var extFlag = true;

									$.each(aData.oData.PYIMListSet, function (index, item) {
										// var numscannedPallets = parseFloat(scannedPallets);
										// var numrequiredPallets = parseFloat(requiredPallets);

										if (item.BinNumber === oBinNumber && item.MaterialNumber === oMaterialNumber && item.Batch === oBatch) {
											extFlag = false;
											MessageBox.information("Material already scanned", {
												title: "Information"
											});
											oRef.getView().byId("Quantity").setValue("");
											oRef.getView().byId("matNumber").setValue("");
											oRef.getView().byId("materialDesc").setValue("");
											oRef.getView().byId("BatchNumber").setValue("");
											oRef.getView().byId("Box").setValue("");
										}

									});
									if (extFlag === true) {

										oRef.aData.push({
											BinNumber: oBinNumber,
											Quantity: oQuantity,
											MaterialNumber: oMaterialNumber,
											MaterialDescription: oMaterialDescription,
											Batch: oBatch,
											BoxID: Box
										});

										var oModel = oRef.getView().getModel("PYIMListModel");

										oModel.setData({
											PYIMListSet: oRef.aData
										});
										oRef.getOwnerComponent().setModel(oModel, "PYIMListModel");
										oRef.getView().byId("Quantity").setValue("");
										oRef.getView().byId("matNumber").setValue("");
										oRef.getView().byId("materialDesc").setValue("");
										oRef.getView().byId("BatchNumber").setValue("");
										oRef.getView().byId("Box").setValue("");

										/* commented on 30/11/2020
										if (scannedPallets === requiredPallets) {
											MessageBox.error("Bin Count Completed");
											oRef.getView().byId("Quantity").setValue("");
											oRef.getView().byId("matNumber").setValue("");
											oRef.getView().byId("materialDesc").setValue("");
											oRef.getView().byId("BatchNumber").setValue("");
											oRef.getView().byId("Box").setValue("");
										} else {
											scannedPallets = parseFloat(scannedPallets) + parseFloat(oQuantity);

											if (scannedPallets > requiredPallets) {
												MessageBox.error("Please enter quantity less than required quantity");
												oRef.getView().byId("Quantity").setValue("");
											} else {
												if (scannedPallets) {
													oRef.getView().byId("scannedpalletsNumber").setValue(scannedPallets);
												}
												oRef.aData.push({
													BinNumber: oBinNumber,
													Quantity: oQuantity,
													MaterialNumber: oMaterialNumber,
													MaterialDescription: oMaterialDescription,
													Batch: oBatch,
													BoxID: Box
												});

												var oModel = oRef.getView().getModel("PYIMListModel");

												oModel.setData({
													PYIMListSet: oRef.aData
												});
												oRef.getOwnerComponent().setModel(oModel, "PYIMListModel");
												oRef.getView().byId("Quantity").setValue("");
												oRef.getView().byId("matNumber").setValue("");
												oRef.getView().byId("materialDesc").setValue("");
												oRef.getView().byId("BatchNumber").setValue("");
												oRef.getView().byId("Box").setValue("");
											}

										}  */

									}
								}
							}

						},
						function () {

						});

				}
			}

		},

		onAddBox: function () {
			var oRef = this;

			var oModel = oRef.getView().getModel("oBoxQtyModel");
			var Boxex = oModel.getData();
			if (!Boxex) {

				Boxex = [];
			} else {
				if (Boxex.oBoxListSet) {

					Boxex = Boxex.oBoxListSet;
				} else {
					Boxex = [];
				}
			}
			Boxex.push({
				iBox: "",
				iQuantity: ""
			});

			var oModel = oRef.getView().getModel("oBoxQtyModel");

			oModel.setData({
				oBoxListSet: Boxex
			});

			//set table heading
			this.setItemNo();

		},
		onPressBoxDel: function (oEvent) {

			var that = this;
			that.oModel = that.getView().getModel("oBoxQtyModel");
			var data = that.getView().getModel("oBoxQtyModel").getData();

			var source = oEvent.getSource().getId().split("-");
			var oItem = this.getView().byId("idBoxTable").getModel("oBoxQtyModel").getProperty("/");
			//get index
			var path = oEvent.getSource().getBindingContext("oBoxQtyModel").getPath();
			var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
			//delete so line item
			var m = this.getView().byId("idBoxTable").getModel("oBoxQtyModel");
			var d = m.getData().oBoxListSet;
			d.splice(idx, 1);
			m.setData({
				oBoxListSet: d
			});
			m.refresh();

			//set table heading
			this.setItemNo();

		},

		setItemNo: function () {
			var countOfM = 0;
			var count = 0;
			var oModel = this.getView().byId("idBoxTable").getModel("oBoxQtyModel");
			var aItem = oModel.getData().oBoxListSet;
			for (var i = 0; i < aItem.length; i++) {
				countOfM = countOfM + 1;
				aItem[i].iBox = countOfM;
			}
			oModel.setData({
				oBoxListSet: aItem
			});
			oModel.refresh();
		},

		RM01MaterialAdd: function () {
			var oRef = this;
			var oBinNumber = oRef.getView().byId("binNumber").getValue();
			var oQuantity = oRef.getView().byId("Quantity").getValue();
			var oMaterialNumber = oRef.getView().byId("matNumber").getValue();
			var oMaterialDescription = oRef.getView().byId("materialDesc").getValue();
			var oBatch = oRef.getView().byId("BatchNumber").getValue();
			var Box = oRef.getView().byId("Box").getValue();
			// var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();
			//Added on 30/11/2020
			var oRequiredPallets = "0"
				// 30/11/2020	var oRequiredPallets = oRef.getView().byId("palletsNumber").getValue();
				// 30/11/2020	// if (!oRequiredPallets) {
				// 	oRequiredPallets = "0";
				// }

			var oModel = oRef.getView().getModel("oBoxQtyModel");
			var Boxex = oModel.getData();
			if (!Boxex) {

				MessageBox.error("Please scan all mandatory fields");
				return;
			} else {
				if (Boxex.oBoxListSet) {

					Boxex = Boxex.oBoxListSet;
				} else {
					Boxex = [];
					MessageBox.error("Please scan all mandatory fields");
					return;
				}
			}
			var boxCount = 0;
			var qtyCnt = 0;
			var bFilled = false;
			if (Boxex.length > 0) {
				for (var i = 0; i < Boxex.length; i++) {
					if (Boxex[i].iQuantity) {

						qtyCnt = qtyCnt + parseInt(Boxex[i].iQuantity);
						bFilled = true;
					}
				}
			}
			boxCount = Boxex[Boxex.length - 1].iBox;

			if (!bFilled) {
				MessageBox.error("Please scan all mandatory fields");
				return;
			}

			Box = boxCount;
			oRef.getView().byId("Box").setValue(Box);
			oQuantity = qtyCnt;
			oRef.getView().byId("Quantity").setValue(oQuantity);

			/*	this.odataService.read("/IMValidateRecordNewSet(BinNumber='" + oBinNumber +
					"',RequiredPallets='" + oRequiredPallets + "',Material='" + oMaterialNumber + "',BatchNo='" + oBatch + "')",*/
			var oPlant = sap.ui.getCore().plnt;
			this.odataService.read("/IMValidateRecordNewSet(BinNumber='" + oBinNumber +
				"',RequiredPallets='" + oRequiredPallets + "',Material='" + oMaterialNumber + "',BatchNo='" + oBatch +
				"',Plant='" + oPlant + "',Sloc='" + sap.ui.getCore().stgloc + "')",
				null, null,
				false,
				function (data, response) {
					var oMessage = response.data.Message;
					if (oMessage === "X") {
						oRef.getView().byId("binNumber").setValue("");
						//30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
						oRef.getView().byId("binNumber").setEnabled(true);
						/*if (NoPalletCB) {

							oRef.getView().byId("palletsNumber").setEnabled(false);
						} else {
						}*/
						//30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

						oRef.getView().byId("Quantity").setValue("");
						//30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
						oRef.getView().byId("matNumber").setValue("");
						oRef.getView().byId("materialDesc").setValue("");
						oRef.getView().byId("BatchNumber").setValue("");
						oRef.getView().byId("Box").setValue("");

						var aData = oRef.getView().getModel("oBoxQtyModel").getData();
						oRef.getView().getModel("oBoxQtyModel").setData([]);

						MessageBox.error("Data Already Saved in Table");
					} else {
						var aData = oRef.getView().getModel("PYIMListModel");
						if (aData !== undefined) {
							var extFlag = true;
							$.each(aData.oData.PYIMListSet, function (index, item) {

								if (item.BinNumber === oBinNumber && item.MaterialNumber === oMaterialNumber && item.Batch === oBatch && item.Quantity ===
									oQuantity) {
									extFlag = false;
									MessageBox.information("Material already scanned", {
										title: "Information"
									});
									oRef.getView().byId("Quantity").setValue("");
									oRef.getView().byId("matNumber").setValue("");
									oRef.getView().byId("materialDesc").setValue("");
									oRef.getView().byId("BatchNumber").setValue("");
									oRef.getView().byId("Box").setValue("");
									var aData = oRef.getView().getModel("oBoxQtyModel").getData();
									oRef.getView().getModel("oBoxQtyModel").setData([]);
								}

							});
							if (extFlag === true) {
								oRef.aData.push({
									BinNumber: oBinNumber,
									Quantity: oQuantity,
									MaterialNumber: oMaterialNumber,
									MaterialDescription: oMaterialDescription,
									Batch: oBatch,
									BoxID: Box
								});

								var oModel = oRef.getView().getModel("PYIMListModel");

								oModel.setData({
									PYIMListSet: oRef.aData
								});
								oRef.getOwnerComponent().setModel(oModel, "PYIMListModel");
								oRef.getView().byId("Quantity").setValue("");
								oRef.getView().byId("matNumber").setValue("");
								oRef.getView().byId("materialDesc").setValue("");
								oRef.getView().byId("BatchNumber").setValue("");
								oRef.getView().byId("Box").setValue("");

								var aData = oRef.getView().getModel("oBoxQtyModel").getData();
								oRef.getView().getModel("oBoxQtyModel").setData([]);
							}

						}
					}

				},
				function () {

				});

		},
		onDelete: function () {
			var that = this;
			that.oModel = that.getView().getModel("PYIMListModel");
			var data = that.getView().getModel("PYIMListModel").getData(that.result);

			that.oList = that.byId("idList");

			var sItems = that.oList.getSelectedItems();

			if (sItems.length === 0) {
				MessageBox.information("Please Select a Row to Delete");
				return;
			} else {

				for (var i = sItems.length - 1; i >= 0; i--) {
					var path = sItems[i].getBindingContextPath();
					var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
					var updateQty = data.PYIMListSet[idx].Quantity;
					if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1" ) {
						data.PYIMListSet.splice(idx, 1);
					} else {
						/* commentedon 30/11/2020
							var scannedPallets = that.getView().byId("scannedpalletsNumber").getValue();
							if (scannedPallets !== "0") {
								scannedPallets = parseFloat(scannedPallets) - parseFloat(updateQty);
								that.getView().byId("scannedpalletsNumber").setValue(scannedPallets);
							} else {
								that.getView().byId("scannedpalletsNumber").setValue("0");
							}
							*/

						data.PYIMListSet.splice(idx, 1);
					}

				}
				that.getView().getModel("PYIMListModel").refresh(true);
			}
			that.oList.removeSelections();

		},
		onSave: function () {
			var oRef = this;
			var oRequiredPallets = "0";
			/*commented on 30/11/2020
			var oRequiredPallets = oRef.getView().byId("palletsNumber").getValue();
			if (!oRequiredPallets) {
				oRequiredPallets = "0";
			 }
	 		end of comment*/
			// var NoPalletCB = oRef.getView().byId("NoPalletCBID").getSelected();
			var oScannedPallets = "0";
			//commented on 30/11/2020
			// var oScannedPallets = oRef.getView().byId("scannedpalletsNumber").getValue();
			var oPlant = sap.ui.getCore().plnt;
			var oStrLoc = sap.ui.getCore().stgloc;
			var Box = oRef.getView().byId("Box").getValue();
			if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1" ) {
				var passBinNo = oRef.getView().byId("binNumber").getValue();
				// var passScannedQty = oRef.getView().byId("").getValue();
				var data = {};
				data.NavIMheaderIMItems = [];
				data.BinNumber = passBinNo;
				data.RequiredPallets = "0";
				var result = oRef.oList.getModel("PYIMListModel").getData();

				$.each(result.PYIMListSet, function (index, item) {
					var temp = {};
					temp.BinNumber = passBinNo;
					temp.Client = "";
					temp.RequiredQty = "0";
					temp.Material = item.MaterialNumber;
					temp.MaterialDesc = item.MaterialDescription;
					temp.BatchNo = item.Batch;
					temp.ScannedQty = item.Quantity;
					if (!item.Quantity) {
						temp.ScannedQty = "0";
					} else {
						temp.ScannedQty = temp.ScannedQty + "";
					}
					temp.Plant = oPlant;
					temp.StorageLocation = oStrLoc;
					if (item.BoxID) {
						temp.BoxID = parseInt(item.BoxID);
					} else {
						temp.BoxID = 0;
					}
					data.NavIMheaderIMItems.push(temp);
				});
				this.odataService.create("/IMHeaderSet", data, null, function (odata, response) {
					MessageBox.show("Scan Another Bin ?", {
						icon: MessageBox.Icon.SUCCESS,
						title: "Data Saved Successfully",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								oRef.getView().byId("binNumber").setValue("");
								oRef.getView().byId("binNumber").setEnabled(true);
								/*if (NoPalletCB) {

									oRef.getView().byId("palletsNumber").setEnabled(false);
								} else {
								}*/

								//30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

								//30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
								oRef.getView().byId("Quantity").setValue("");
								//30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
								oRef.getView().byId("matNumber").setValue("");
								oRef.getView().byId("materialDesc").setValue("");
								oRef.getView().byId("BatchNumber").setValue("");
								oRef.getView().byId("Box").setValue("");
								var aData = oRef.getView().getModel("PYIMListModel").getData();
								oRef.aData = [];
								oRef.getView().getModel("PYIMListModel").setData(oRef.aData);

								var aData = oRef.getView().getModel("oBoxQtyModel").getData();
								oRef.getView().getModel("oBoxQtyModel").setData([]);

							} else {
								oRef.getView().byId("binNumber").setValue("");
								//30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
								oRef.getView().byId("binNumber").setEnabled(true);

								/*if (NoPalletCB) {

									oRef.getView().byId("palletsNumber").setEnabled(false);
								} else {
								}*/
								//30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

								oRef.getView().byId("Quantity").setValue("");
								//30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
								oRef.getView().byId("matNumber").setValue("");
								oRef.getView().byId("materialDesc").setValue("");
								oRef.getView().byId("BatchNumber").setValue("");
								oRef.getView().byId("Box").setValue("");
								var aData = oRef.getView().getModel("PYIMListModel").getData();
								oRef.aData = [];
								oRef.getView().getModel("PYIMListModel").setData(oRef.aData);
								var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
								sRouter.navTo("PlantStorageLoc", true);

								var aData = oRef.getView().getModel("oBoxQtyModel").getData();
								oRef.getView().getModel("oBoxQtyModel").setData([]);

							}
						}

					});

				}, function (odata, response) {

				});
			} else {
				if (oScannedPallets !== oRequiredPallets) {
					MessageBox.error("Scanned Pallets/Quantity are not equal");
				} else {
					var passBinNo = oRef.getView().byId("binNumber").getValue();
					var oRequiredPallets = "0";
					// 30/11/2020	var oRequiredPallets = oRef.getView().byId("palletsNumber").getValue();

					var data = {};
					data.NavIMheaderIMItems = [];
					data.BinNumber = passBinNo;
					data.RequiredPallets = oRequiredPallets;
					/* commented on 30/11/2020
						if (!oRequiredPallets) {
							data.RequiredPallets = "0";
							oRequiredPallets = "0";
						}
						*/
					var result = oRef.oList.getModel("PYIMListModel").getData();

					$.each(result.PYIMListSet, function (index, item) {
						var temp = {};
						temp.BinNumber = passBinNo;
						temp.Client = "";
						temp.RequiredQty = oRequiredPallets;
						temp.Material = item.MaterialNumber;
						temp.MaterialDesc = item.MaterialDescription;
						temp.BatchNo = item.Batch;
						temp.ScannedQty = item.Quantity;
						if (!item.Quantity) {
							temp.ScannedQty = "0";
						}
						temp.Plant = oPlant;
						temp.StorageLocation = oStrLoc;
						if (item.BoxID) {
							temp.BoxID = parseInt(item.BoxID);
						} else {
							temp.BoxID = 0;
						}
						data.NavIMheaderIMItems.push(temp);
					});
					this.odataService.create("/IMHeaderSet", data, null, function (odata, response) {
						MessageBox.show("Scan Another Bin ?", {
							icon: MessageBox.Icon.SUCCESS,
							title: "Data Saved Successfully",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {
									oRef.getView().byId("binNumber").setValue("");
									// 30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
									oRef.getView().byId("binNumber").setEnabled(true);

									/*	if (NoPalletCB) {

											oRef.getView().byId("palletsNumber").setEnabled(false);
										} else {
										}*/
									// 30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);

									oRef.getView().byId("Quantity").setValue("");
									oRef.getView().byId("matNumber").setValue("");
									// 30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
									oRef.getView().byId("materialDesc").setValue("");
									oRef.getView().byId("BatchNumber").setValue("");
									oRef.getView().byId("Box").setValue("");
									var aData = oRef.getView().getModel("PYIMListModel").getData();
									oRef.aData = [];
									oRef.getView().getModel("PYIMListModel").setData(oRef.aData);

									var aData = oRef.getView().getModel("oBoxQtyModel").getData();
									oRef.getView().getModel("oBoxQtyModel").setData([]);

								} else {
									oRef.getView().byId("binNumber").setValue("");
									// 30/11/2020	oRef.getView().byId("palletsNumber").setValue("");
									oRef.getView().byId("binNumber").setEnabled(true);

									/*if (NoPalletCB) {

										oRef.getView().byId("palletsNumber").setEnabled(false);
									} else {
									}*/
									// 30/11/2020	oRef.getView().byId("palletsNumber").setEnabled(true);
									oRef.getView().byId("Quantity").setValue("");
									// 30/11/2020	oRef.getView().byId("scannedpalletsNumber").setValue("0");
									oRef.getView().byId("matNumber").setValue("");
									oRef.getView().byId("materialDesc").setValue("");
									oRef.getView().byId("BatchNumber").setValue("");
									oRef.getView().byId("Box").setValue("");
									var aData = oRef.getView().getModel("PYIMListModel").getData();
									oRef.aData = [];
									oRef.getView().getModel("PYIMListModel").setData(oRef.aData);
									var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
									sRouter.navTo("PlantStorageLoc", true);

									var aData = oRef.getView().getModel("oBoxQtyModel").getData();
									oRef.getView().getModel("oBoxQtyModel").setData([]);

								}
							}

						});
					}, function (odata, response) {

					});
				}
			}

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.axium.Axium.view.PhysicalInventoryIM
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.axium.Axium.view.PhysicalInventoryIM
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.axium.Axium.view.PhysicalInventoryIM
		 */
		//	onExit: function() {
		//
		//	}

	});

});