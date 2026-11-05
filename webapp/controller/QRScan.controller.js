sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
], function (Controller, MessageBox) {
	"use strict";
	var jsonObject;
	return Controller.extend("com.axium.barcode.materiallabel.controller.Scan", {
		onInit: function () {
			var oRef = this;
			var data = [];
			// oRef.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.aData = [];
			oRef.odataService = this.getView().getModel("ZWM_GW_RFSCREENS_SRV");

		},
		openBarcodeScannerDialog: function (oEvent) {
			this.byId("bsd").show();
		},
		onScanError: function (oEvent) {
			this.byId("scanResultLabel").setText("Error result: " + oEvent.getParameter("message"));
			this.byId("bsd").close();
		},

		onScanSuccess: function (oEvent) {
			if (oEvent.getParameter("cancelled")) {
				MessageToast.show("Scan cancelled", {
					duration: 1000
				});
			} else {
				// if (oEvent.getParameter("text")) {
				// 	var oModel = new sap.ui.model.json.JSONModel();
				// 	var inputString = oEvent.getParameter("text");
				// 	var parts = inputString.split(',');
				// 	var keys = ['Plant', 'StorageLoc', 'Material', 'BatchNum', 'Quantity'];
				// 	var jsonObject = {};

				// 	for (var i = 0; i < keys.length; i++) {
				// 		jsonObject[keys[i]] = parts[i];
				// 	}

				// 	this.onMaterialValidate(jsonObject.Material);

				// 	// Set the JSON object to the model
				// 	oModel.setData(jsonObject);

				// 	// Set the model to your view
				// 	this.getView().setModel(oModel, "scanResultModel");
				if (oEvent.getParameter("text")) {
					var oModel = new sap.ui.model.json.JSONModel();
					var inputString = oEvent.getParameter("text");
					var parts = inputString.split(',');
					var keys = ['Plant', 'StorageLoc', 'Material', 'BatchNum', 'Quantity'];
					var jsonObject = {};

					for (var i = 0; i < keys.length; i++) {
						jsonObject[keys[i]] = parts[i];
					}

					// Create an async function to handle the asynchronous flow
					(async() => {
						try {
							// Wait for the validation to complete
							await this.onMaterialValidate(jsonObject.Material);

							// Set the JSON object to the model
							oModel.setData(jsonObject);

							// Set the model to your view
							this.getView().setModel(oModel, "scanResultModel");
						} catch (error) {
							// Handle validation error
							console.error("Validation failed:", error);
							// Optionally, show an error message to the user
						}
					})();
				} else {
					oScanResultText.setText('');
				}
			}

		},

		onMaterialValidate: function (MaterialDesc) {
			var oModel = this.getView().getModel();
			var oRef = this;
			var mat = MaterialDesc;
			return new Promise((resolve, reject) => {
				oModel.read("/VH_MatnrSet('" + mat + "')", null, null, false, function (oData, oResponse) {
						var matdesc = oResponse.data.MaterialDesc;
						oRef.getView().byId("materialDesc").setValue(matdesc);
						resolve(matdesc); // Resolve the promise when the read is successful
					},
					function (oData, oResponse) {
						oRef.getView().byId("matNumber").setValue("");
						MessageBox.error("Please scan a correct material");
						reject(new Error("Invalid material")); // Reject the promise if there's an error
					});
			});
		},

		onAddMaterial: function () {
			var oRef = this;
			var oBinNumber = oRef.getView().byId("binNumber").getValue();
			var requiredPallets = "",
				scannedPallets;
			var oQuantity = oRef.getView().byId("Quantity").getValue();
			var oMaterialNumber = oRef.getView().byId("matNumber").getValue();
			var oMaterialDescription = oRef.getView().byId("materialDesc").getValue();
			var oBatch = oRef.getView().byId("BatchNumber").getValue();

			var Box = oRef.getView().byId("Box").getValue();
			var oPlant = sap.ui.getCore().plnt;

			if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1") {
				oRef.RM01MaterialAdd();
			} else {

				var bError = false;

				if (oBinNumber === "") {
					bError = true;
				}
				if (oMaterialNumber === "") {
					bError = true;
				}
				if (oMaterialDescription === "") {
					bError = true;
				}
				if (bError) {

					MessageBox.error("Please scan all mandatory fields");
				} else {
					this.odataService.read("/IMValidateRecordNewSet(BinNumber='" + oBinNumber +
						"',RequiredPallets='" + requiredPallets + "',Material='" + oMaterialNumber +
						"',BatchNo='" + oBatch + "',Plant='" + oPlant + "',Sloc='" + sap.ui.getCore().stgloc + "')",
						null, null,
						false,
						function (data, response) {
							var oMessage = response.data.Message;
							if (oMessage === "X") {
								oRef.getView().byId("binNumber").setValue("");
								oRef.getView().byId("binNumber").setEnabled(true);
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

									}
								}
							}

						},
						function () {

						});

				}
			}

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
		onSave: function () {
			var oRef = this;
			var oRequiredPallets = "0";
			var oScannedPallets = "0";
			//commented on 30/11/2020
			// var oScannedPallets = oRef.getView().byId("scannedpalletsNumber").getValue();
			var oPlant = sap.ui.getCore().plnt;
			var oStrLoc = sap.ui.getCore().stgloc;
			var Box = oRef.getView().byId("Box").getValue();
			if (sap.ui.getCore().stgloc === "RM01" || sap.ui.getCore().stgloc === "RM02" || sap.ui.getCore().stgloc === "MNR1") {
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
									oRef.getView().byId("binNumber").setEnabled(true);
									oRef.getView().byId("Quantity").setValue("");
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
					}, function (odata, response) {});
				}
			}
		},
		// onMaterialValidate: function () {
		// 	var oRef = this;
		// 	var mat = oRef.getView().byId("matNumber").getValue();
		// 	oRef.odataService.read("/MaterialSet('" + mat + "')", null, null, false, function (oData, oResponse) {
		// 			var matdesc = oResponse.data.MaterialDesc;
		// 			oRef.getView().byId("materialDesc").setValue(matdesc);
		// 		},
		// 		function (oData, oResponse) {
		// 			oRef.getView().byId("matNumber").setValue("");
		// 			MessageBox.error("Please scan a correct material");
		// 		}
		// 	);
		// },
		onBack: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Home", {});
			// var oHistory = sap.ui.core.routing.History.getInstance();
			// var oPrevHash = oHistory.getPreviousHash();

			// if (oPrevHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// 	oRouter.navTo("RouteView1", {}, true /*no history*/ );
			// }
		}
	});
});