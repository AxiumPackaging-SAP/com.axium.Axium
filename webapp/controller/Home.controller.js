sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment'
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.Home", {
		onPressFG: function (e) {
			var that = this;
			var data = that.getView().getModel("oListHU").getData();
			that.data = [];
			that.getView().getModel("oListHU").setData(that.data);
			that.getView().getModel("oListHU").refresh(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ScanHU", {});
			// var oTable = this.getView().byId("idtable");
			// var oModel = oTable.getModel("oTableModelAlias");
			// oModel.setData({});
			// oModel.refresh(true);
			// window.location.reload(true);
			// var oBusy = sap.m.BusyDialog();
			// oBusy.open();{
			// oBusy.close();

		},
		onOpenDialog: function () {
			var oView = this.getView();

			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: oView.getId(),
					name: "com.axium.Axium.view.Dialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onHuRelease: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("HuHoldOrRelease", {
				action: oEvent.getSource().getText()
			});
			this.onCloseDialog();
		},
		onHuHold: function (oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("HuHoldOrRelease", {
				action: oEvent.getSource().getText()
			});
			this.onCloseDialog();
		},
		onCloseDialog: function () {
			// note: We don't need to chain to the _pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("myDialog").close();
		},
		// onPressRM : function(e){
		// 	  var that = this;
		//       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//         oRouter.navTo("RMPickReturn",{});
		// },
		// onPick: function (e) {
		// 	var that = this;
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("Pick", {});
		// },
		// onReturn: function (e) {
		// 	var that = this;
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("Return", {});
		// },
		// onRMPutAway: function (e) {
		// 	var that = this;
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("PutAway", {});
		// },

		onPick: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Pick", {});
		},
		onReturn: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Return", {});
		},
		onRMPutAway: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PutAway", {});
		},

		/*Stock Overview*/
		onPressPlantScreen: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PlantScreen", {});
		},

		onPressWarehouseScreen: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("WarehouseScreen", {});
		},
		onPressFGPick: function (e) {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			oRouter.navTo("ScanDelNo", {});
		},
		onPressBinToBin: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("BinToBin", {});
		},
		onPhysicalInventory: function (e) {
			// var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PlantStorageLoc", {});
		},
		onQRPhysicalInventory: function (e) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("QRPhysicalInventory", {});
		},
		onInventoryPress: function (e) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("InventoryPlntStrloc", {});
		},
		onWHTransferReceipt: function (e) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ScanMaterialDocumentWH", {});
		},
		onStockTransferReceipt: function (e) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ScanMaterialDocument", {});
		}

	});
});