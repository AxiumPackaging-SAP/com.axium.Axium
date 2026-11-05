sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/axium/Axium/model/models",
	    "sap/ui/core/BusyIndicator",
    "sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, Device, models, BusyIndicator, ODataModel) {
	"use strict";

	return UIComponent.extend("com.axium.Axium.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setModel(new sap.ui.model.json.JSONModel(), "STRMaterialDetails");
			this.setModel(new sap.ui.model.json.JSONModel(), "oTableModelAlias");
			this.setModel(new sap.ui.model.json.JSONModel(), "oAvailableBins");
			this.setModel(new sap.ui.model.json.JSONModel(), "oTablePickAlias");
			this.setModel(new sap.ui.model.json.JSONModel(), "oBOM");
			this.setModel(new sap.ui.model.json.JSONModel(), "oListHU");
			this.setModel(new sap.ui.model.json.JSONModel(), "oListMat");

			//Stock Overview
			this.setModel(new sap.ui.model.json.JSONModel(), "PlantScreenOutputModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "WarehouseScreenOutputModel");

			this.setModel(new sap.ui.model.json.JSONModel(), "oMyScannedQty");
			this.setModel(new sap.ui.model.json.JSONModel(), "oMyBinNumber");

			this.setModel(new sap.ui.model.json.JSONModel(), "oDeliveryNo");
			this.setModel(new sap.ui.model.json.JSONModel(), "oDelAvailableBin");
			this.setModel(new sap.ui.model.json.JSONModel(), "oMatSelect");
			this.setModel(new sap.ui.model.json.JSONModel(), "oScannedQtySelect");
			this.setModel(new sap.ui.model.json.JSONModel(), "oScannedQty");
			this.setModel(new sap.ui.model.json.JSONModel(), "oBinScanModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oScanQTModel");

			this.setModel(new sap.ui.model.json.JSONModel(), "batchQty");

			this.setModel(new sap.ui.model.json.JSONModel(), "PhysicalInventory");
			this.setModel(new sap.ui.model.json.JSONModel(), "Count");
			this.setModel(new sap.ui.model.json.JSONModel(), "PlantStorage");
			this.setModel(new sap.ui.model.json.JSONModel(), "InvenHUBin");
			this.setModel(new sap.ui.model.json.JSONModel(), "BinHUMatModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "STRMatDocMaterials");
			this.setModel(new sap.ui.model.json.JSONModel(), "STRSTOInboundDelivery"); // Added by Vikram
			this.setModel(new sap.ui.model.json.JSONModel(), "STRSTOHuScan"); // Added by Vikram
			this.setModel(new sap.ui.model.json.JSONModel(), "STRSTOHuItemScan"); // Added by Vikram
			this.setModel(new sap.ui.model.json.JSONModel(), "PYIMListModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "PYIMListLocalModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oBoxQtyModel");

			// this._attachGenericBusyHandling();
		},
		// /**
		//  * Hooks generic busy handlers onto manifest-defined OData V2 models.
		//  * Counter-free implementation using execution deferral.
		//  * @private
		//  */
		// _attachGenericBusyHandling: function () {
		// 	// Access the manifest entry for models
		// 	var oManifestModels = this.getManifestEntry("/sap.ui5/models");

		// 	// Convert keys to an array
		// 	var aModelNames = oManifestModels ? Object.keys(oManifestModels) : [];

		// 	// console.log("Models in Component:", aModelNames);
		// 	//Loop and attach busy indicator logic
		// 	aModelNames.forEach(function (sModelName) {
		// 		var oModel = this.getModel(sModelName === "" ? undefined : sModelName);

		// 		// Only attach if it's an OData or JSON model that supports these events
		// 		if (oModel && oModel.attachRequestSent) {
		// 			oModel.attachRequestSent(function () {
		// 				sap.ui.core.BusyIndicator.show(0); // Show immediately
		// 			});

		// 			oModel.attachRequestCompleted(function () {
		// 				sap.ui.core.BusyIndicator.hide();
		// 			});

		// 			oModel.attachRequestFailed(function () {
		// 				sap.ui.core.BusyIndicator.hide(); // Hide even if request fails
		// 			});
		// 		}
		// 	}.bind(this));
		// },

	});
});