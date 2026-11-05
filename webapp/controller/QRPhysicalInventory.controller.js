sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Controller, History, MessageBox, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.QRPhysicalInventory", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.QRPhysicalInventory
		 */
		onInit: function () {
			console.log(sap.ui.require.toUrl('com/axium/Axium/img') + '/Label.png');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("QRPhysicalInventory").attachPatternMatched(this._onObjectMatched, this);

		},

		onPressBack: function () {
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("Home", true);
		},

		onLabelPress: function () {
			// Navigate to the view related to the label image
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("RouteLabel"); // Replace "LabelView" with the name of your view
		},
		onScanPress: function () {
				// Navigate to the view related to the scan image
				var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
				sRouter.navTo("QRScan"); // Replace "ScanView" with the name of your view
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.axium.Axium.view.QRPhysicalInventory
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.axium.Axium.view.QRPhysicalInventory
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.axium.Axium.view.QRPhysicalInventory
		 */
		//	onExit: function() {
		//
		//	}

	});

});