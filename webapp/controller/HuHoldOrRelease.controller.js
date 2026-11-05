sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/MessageToast"
], function (Controller, Button, Dialog, MessageBox, MessageToast) {
	"use strict";
	var sProcess;
	var comment;
	return Controller.extend("com.axium.Axium.controller.HuHoldOrRelease", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.HuHoldOrRelease
		 */
		onInit: function () {
			var that = this;
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			var oRouterh = sap.ui.core.UIComponent.getRouterFor(this);
			var oRouterr = this.getOwnerComponent().getRouter();
			oRouterh.getRoute("HuHoldOrRelease").attachPatternMatched(this._onHuAction, this);

			var oHuDetails = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oHuDetails, "huDetails");
			this.huDetails = [];
			//
			var oModel = this.getOwnerComponent().getModel();
			var oView = this.getView();
			oView.setModel(oModel);

			/*			var oTable = this.getView().byId("idList");
						this.oBindingTable = oTable.getBindingInfo("items");*/

			//
			var oHuAction = new sap.ui.model.json.JSONModel();

			oHuAction.setData({
				huHoldVisib: false,
				huRelVisib: false
			});
			this.getView().setModel(oHuAction, "huAction");
			this.getView().getModel("huAction").setDefaultBindingMode("OneWay");
			this.getView().byId("idcommt").setValue(" ");

			this.odataService.read("/HoldReason", null, null, false, function (response) {

				if (that.getView().byId("idcommt") !== undefined) {
					that.getView().byId("idcommt").destroyItems();
				}
				for (var i = 0; i < response.results.length; i++) {
					that.getView().byId("idcommt").addItem(
						new sap.ui.core.ListItem({
							//				text: response.results[i].RCODE,
							text: response.results[i].RDESCRIPTION,
							key: response.results[i].RCODE,
							additionalText: response.results[i].RCODE

						}));
				}
			});

			/*			this.getView().addEventDelegate({
							onBeforeShow: jQuery.proxy(function (evt) {
								this.onBeforeShow(evt);
							}, this)
						});*/

		},

		ReasonLoad: function (oEvent) {
			/*			var that = this;
						this.odataService.read("/HoldReason", null, null, false, function (response) {
							if (that.getView().byId("idcommt") !== undefined) {
								that.getView().byId("idcommt").destroyItems();
							}
							for (var i = 0; i < response.results.length; i++) {
								that.getView().byId("idcommt").addItem(
									new sap.ui.core.ListItem({
										text: response.results[i].RCODE,
										key: response.results[i].RCODE,
										additionalText: response.results[i].RDESCRIPTION

									}));
							}
						});*/

			oEvent.getSource().getBinding("items").resume();
		},

		_onHuAction: function (oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			switch (oArgs.action) {
			case "HU Hold":
				this.huDetails = [];
				this.getView().getModel("huDetails").setData({});
				this.sProcess = "H";
				this.getView().byId("idHuPage").setTitle("HU Hold");
				this.getView().getModel("huAction").setProperty("/huRelVisib", true);
				this.getView().getModel("huAction").setProperty("/huHoldVisib", false);
				break;
			case "HU Release":
				this.huDetails = [];
				this.getView().getModel("huDetails").setData({});
				this.sProcess = "R";
				this.getView().byId("idHuPage").setTitle("HU Release");
				this.getView().getModel("huAction").setProperty("/huRelVisib", false);
				this.getView().getModel("huAction").setProperty("/huHoldVisib", true);
				break;
			default:
			}

		},
		goToRel: function (oEvent) {
			this.huDetails = [];
			this.getView().getModel("huDetails").setData({});
			this.sProcess = "R";
			this.getView().byId("idHuPage").setTitle("HU Release");
			this.getView().getModel("huAction").setProperty("/huRelVisib", false);
			this.getView().getModel("huAction").setProperty("/huHoldVisib", true);
		},
		goToHold: function (oEvent) {
			this.huDetails = [];
			this.getView().getModel("huDetails").setData({});
			this.sProcess = "H";
			this.getView().byId("idHuPage").setTitle("HU Hold");
			this.getView().getModel("huAction").setProperty("/huRelVisib", true);
			this.getView().getModel("huAction").setProperty("/huHoldVisib", false);
		},
		_onHuRelease: function (oEvent) {
			this.huDetails = [];
			var relBtn = this.getView().byId("RE");
			relBtn.setVisible(true);
			var reltoholdBtn = this.getView().byId("hold");
			reltoholdBtn.setVisible(true);
		},
		selectAll: function () {
			this.getView().byId("idList").selectAll();
		},
		removeAll: function () {
			this.getView().byId("idList").removeSelections();
		},
		onDelete: function () {
			var that = this;
			that.oModel = that.getView().getModel("huDetails");
			var data = that.getView().getModel("huDetails").getData(that.result);

			that.oList = that.byId("idList");

			var sItems = that.oList.getSelectedItems();

			if (sItems.length === 0) {
				MessageBox.information("Please Select a row to Delete");
				return;
			} else {

				for (var i = sItems.length - 1; i >= 0; i--) {
					var path = sItems[i].getBindingContextPath();
					var idx = parseInt(path.substring(path.lastIndexOf("/") + 1));
					data.HuList.splice(idx, 1);
				}
				that.getView().getModel("huDetails").refresh(true);
				//			var huCount = that.getView().byId("idList").getValue();
				//			sap.ui.getCore().initialCount = parseFloat(huCount) - 1;
				//			that.getView().byId("idList").setValue(sap.ui.getCore().initialCount);
				//	oModel.setData(data);
			}
			that.oList.removeSelections();
		},
		onPressBack: function () {
			this.getView().byId("idcommt").setValue(" ");
			var sHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = sHistory.getPreviousHash();
			window.history.go(-1);

			//		var oRouter = this.getOwnerComponent().getRouter();
			//		oRouter.navTo("home", {}, true);
		},
		//.bind(this),
		/////////////////

		onHandleHU: function (oEvent) {
			var res = this.getView().byId("idcommt").getValue();
			if (res == " ") {
				MessageBox.error("Please Enter Reason");
				this.getView().byId("idHUNum_1").setValue("");
				return;
			}
			
          
			var sHU = oEvent.getSource().getValue();
			if (sHU.length >= 18) {
				comment = this.getView().byId("idcommt").getValue();
				this.readHu(sHU, comment).then(this._readSuccess.bind(this), this._readFail.bind(this));
			} else {
				MessageBox.Information("Please Enter valid HU Number");
				this.getView().byId("idHUNum_1").setValue(" ");
			}
		},
		readHu: function (sHU, scomment) {
			var process = this.sProcess;
			this.getView().byId("idList").setBusy(true);
			sHU = sHU.trim();
			var prom = new Promise(function (resolve, reject) {

				var oFilterHu = new sap.ui.model.Filter("HU", sap.ui.model.FilterOperator.EQ, sHU);
				var oFilterCm = new sap.ui.model.Filter("Comment", sap.ui.model.FilterOperator.EQ, scomment);
				var oFilterpr = new sap.ui.model.Filter("HoldStatus", sap.ui.model.FilterOperator.EQ, process);
				this.getView().getModel().read("/HUholdOrReleaseSet", {
					filters: [oFilterHu, oFilterCm, oFilterpr],

					//			this.getView().getModel().read("/HUholdOrReleaseSet('" + sHU + "')", {

					success: function (oData, response) {
						resolve(oData, response);
					},
					error: function (oError) {
						reject(oError);
					}
				});
			}.bind(this));
			return prom;
		},
		_readSuccess: function (oData, response) {

			this.getView().byId("idList").setBusy(false);
			this.huDetails.push(oData.results[0]);
			//		this.huDetails.push(oData);
			this.getView().getModel("huDetails").setData({
				HuList: this.huDetails
			});

			if (oData.results.length === 0) {

				if (sProcess === "H") {
					var msg_hu = "Hu already in hold";
				} else {
					msg_hu = "Hu already in Release";
				}

				sap.m.MessageBox.alert(msg_hu, {
					title: "Information",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			}

			this.getView().byId("idHUNum_1").setValue(" ");
			this.getView().byId("idList").selectAll();
		},
		_readFail: function (oError) {
			this.getView().byId("idList").setBusy(false);

		}.bind(this),

		onrel: function () {

			var result = this.getView().getModel("huDetails").getData();
			var oList = this.getView().byId("idList");
			var oBinding = oList.getBinding("items");
			var items = oList.getSelectedItems();
			var oRef = this.getView().getModel();

			$.each(result.HuList, function (index, item) {
				var temp = {};
				temp.Plant = item.Plant;
				temp.StorageLocation = item.StorageLocation;
				temp.BatchNo = item.BatchNo;
				temp.Material = item.Material;
				temp.HU = item.HU;
				temp.HoldStatus = this.sProcess;
				temp.Comment = comment;
				oRef.setDeferredGroups(["group1"]);

				oRef.create("/HUholdOrReleaseSet", temp, {
					groupId: "group1"
				});
			}.bind(this));
			//	this.getView().byId("bsyInd").setVisible(true);
			oRef.submitChanges({
				groupId: "group1",
				success: this.successCallback,
				error: this.errorCallback
			});
			this.getView().byId("idcommt").setValue(" ");
		},

		onHandleBatch: function (oEvent) {
			
			var res = this.getView().byId("idcommt").getValue();
			if (res == " ") {
				MessageBox.error("Please Enter Reason");
				this.getView().byId("idbatch").setValue("");
				return;
			}

			var sBatch = oEvent.getSource().getValue();
			if (sBatch.length >= 6) {
				comment = this.getView().byId("idcommt").getValue();
				this.readbatch(sBatch, comment).then(this._readbatchSuccess.bind(this), this._readbatchFail.bind(this));

			} else {

				//				sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
				//	MessageBox.information("Please Enter valid Batch Number");
				//MessageBox.information("Please Enter valid Batch Number");
				MessageBox.alert("Please Enter valid Batch Number");
				//	}
				this.getView().byId("idbatch").setValue("");
				return;
			}
		},

		readbatch: function (sBatch, scomment) {
			var Process = this.sProcess;
			this.getView().byId("idList").setBusy(true);
			sBatch = sBatch.trim();
			var prom1 = new Promise(function (resolve, reject) {

				var oFilterbatch = new sap.ui.model.Filter("BatchNo", sap.ui.model.FilterOperator.EQ, sBatch);
				var oFilterCm = new sap.ui.model.Filter("Comment", sap.ui.model.FilterOperator.EQ, scomment);
				var oFilterpr = new sap.ui.model.Filter("HoldStatus", sap.ui.model.FilterOperator.EQ, Process);

				this.getView().getModel().read("/HUholdOrReleaseSet", {
					filters: [oFilterbatch, oFilterCm, oFilterpr],

					//			this.getView().getModel().read("/HUholdOrReleaseSet('" + sHU + "')", {

					success: function (oData, response) {
						resolve(oData, response);
					},
					error: function (oError) {
						reject(oError);
					}
				});
			}.bind(this));
			return prom1;
		},
		_readbatchSuccess: function (oData, response) {
			this.getView().byId("idList").setBusy(false);
			for (var i = 0; i < oData.results.length; i++) {
				this.huDetails.push(oData.results[i]);
				this.getView().getModel("huDetails").setData({
					HuList: this.huDetails
				});
			}
			if (oData.results.length === 0) {

				if (sProcess === "H") {
					var msg_em = "Hu's related to Batch are already in hold";
				} else {
					msg_em = "Hu's related to Batch are already in Release";
				}

				sap.m.MessageBox.alert(msg_em, {
					title: "Information",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			}
			this.getView().byId("idList").selectAll();
			this.getView().byId("idbatch").setValue("");
		},
		_readbatchFail: function (oError) {
			this.getView().byId("idList").setBusy(false);

		}.bind(this),
        
       
            
		onHold: function () {
			var result = this.getView().getModel("huDetails").getData();
			var oList = this.getView().byId("idList");
			var oBinding = oList.getBinding("items");
			var items = oList.getSelectedItems();
			var oRef = this.getView().getModel();
	         // Message box
	         var msg1 = "HU already Posted will not be on Hold";
	     //    					MessageBox.show(

						// 	msg1, {
						// 		icon: MessageBox.Icon.Success,
						// 		//		icon: sap.ui.commons.MessageBox.Icon.SUCCESS,
						// 		title: "Information",
						// 		actions: [MessageBox.Action.OK],
						// 		onClose: function (oAction) {
						// 			if (oAction === sap.m.MessageBox.Action.OK) {
						// 				// this.getView().byId("idcommt").setValue(" ");
						// 				// var sHistory = sap.ui.core.routing.History.getInstance();
						// 				// var sPreviousHash = sHistory.getPreviousHash();
						// 				// window.history.go(-1);
						// 				// this.onPressBack();
						// 			}
						// 		}
						// 	}
						// );
	         
	         // Message box
			//MessageBox.alert("HU Already Shipped will not be on Hold");

			$.each(result.HuList, function (index, item) {
				var temp = {};
				temp.Plant = item.Plant;
				temp.StorageLocation = item.StorageLocation;
				temp.BatchNo = item.BatchNo;
				temp.Material = item.Material;
				temp.HU = item.HU;
				temp.HoldStatus = this.sProcess;
				temp.Comment = comment;
				temp.Status = item.Status;
				oRef.setDeferredGroups(["group1"]);

				oRef.create("/HUholdOrReleaseSet", temp, {
					groupId: "group1"
				});
			}.bind(this));
			//	this.getView().byId("bsyInd").setVisible(true);
			oRef.submitChanges({
				groupId: "group1",
				success: this.successCallback,
				error: this.errorCallback
			});
			this.getView().byId("idcommt").setValue(" ");
		},

		successCallback: function (oData, oResponse) {
			//			this.getView().byId("idList").setBusy(false);
			sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {

					var msg = oData.__batchResponses[0].__changeResponses[0].data.Message;
					// and display message
					//	if (oData.__batchResponses.length === 1) {
					if (msg !== "") {
						MessageBox.show(

							msg, {
								icon: MessageBox.Icon.Error,
								//		icon: sap.ui.commons.MessageBox.Icon.SUCCESS,
								title: "Error",
								actions: [MessageBox.Action.OK],
								onClose: function (oAction) {
									if (oAction === "OK") {
										this.getView().byId("idcommt").setValue(" ");
										var sHistory = sap.ui.core.routing.History.getInstance();
										var sPreviousHash = sHistory.getPreviousHash();
										window.history.go(-1);
										this.onPressBack();
									}
								}
							}
						);
					} else {
						sProcess = oData.__batchResponses[0].__changeResponses[0].data.HoldStatus;
						if (sProcess === "H") {
							var msg = "HU Moved to Hold Status.";
						} else {
							var msg = "HU Released for Shipping.";
						}

						MessageBox.show(
							msg, {
								icon: MessageBox.Icon.SUCCESS,
								//		icon: sap.ui.commons.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: [MessageBox.Action.OK],
								onClose: function (oAction) {
									if (oAction === "OK") {
										//var sHistory = History.getInstance();
										//										this.getView().byId("idcommt").setValue(" ");
										var sHistory = sap.ui.core.routing.History.getInstance();
										var sPreviousHash = sHistory.getPreviousHash();
										window.history.go(-1);
										this.onPressBack();
									}
								}.bind(this)
							});
					}
				}
				/*check*/
			);
		},
		errorCallback: function (oResponse) {
			//		this.getView().byId("bsyInd").setVisible(false);
			var Sresponse = JSON.parse(oResponse.response.body);
			var message = Sresponse.error.message.value;
			sap.m.MessageBox.alert(message, {
				title: "Information",
				onClose: null,
				styleClass: "",
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		}
	});
});