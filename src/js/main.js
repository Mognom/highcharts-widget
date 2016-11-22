/*globals $, MashupPlatform */
window.onload = function () {
    "use strict";

    $("#container").highcharts({});
    $("#message-container").hide();
    var dataHandler;

    var sendData = function sendData(data) {
        var toSend = {};
        toSend.category = data.category || "";
        toSend.percentage = data.percentage || 0.0;
        toSend.x = data.x;
        toSend.y = data.y;
        MashupPlatform.wiring.pushEvent("selected", JSON.stringify(toSend));
    };

    var hijackEvents = function hijackEvents(data) {
        data.plotOptions = data.plotOptions || {};
        data.plotOptions.series = data.plotOptions.series || {};
        data.plotOptions.series.point = data.plotOptions.series.point || {};
        data.plotOptions.series.point.events = {}; // Let's clean all the events because can't be sended via wiring
        data.plotOptions.series.point.events.click = function (e) {
            sendData(this); // this :: Point
        };
        return data;
    };

    MashupPlatform.wiring.registerCallback("highcharts", function (data) {
        var jdata = JSON.parse(data);
        jdata = hijackEvents(jdata);
        if (jdata.alertmessage) {
            $("#message-container").show();
            $("#container").hide();
            $("#message").text(jdata.alertmessage);

        } else {
            $("#message-container").hide();
            $("#container").show();
            $("#container").highcharts(jdata);
        }
    });

    MashupPlatform.wiring.registerCallback("highstock", function (data) {
        var jdata = JSON.parse(data);
        jdata = hijackEvents(jdata);

        if (jdata.alertmessage) {
            $("#message-container").hide();
            $("#container").show();
            $("#message").text(jdata.alertmessage);

        } else {
            $("#message-container").show();
            $("#container").hide();
            $("#container").highcharts("StockChart", jdata);
        }
    });
};
