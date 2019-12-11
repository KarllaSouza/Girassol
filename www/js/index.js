var controller = null;
var app = {
    // Application Constructor
    initialize: function () {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else {
            this.onDeviceReady();
        }
    },

    onDeviceReady: function () {
        document.addEventListener("backbutton", function (e) {
            if (document.getElementById('homepage')) {
                e.preventDefault();
                navigator.app.exitApp();
            } else if (document.getElementsByClassName('conteudo-texto')) {
                controller.renderMainView();
            }
        }, false)
        screen.orientation.lock('portrait');
        controller = new Controller();
        app.overrideBrowserAlert();
    },

    overrideBrowserAlert: function () {
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Girassol", // title
                    'OK'        // buttonName
                );
            };
        }
    },

};

app.initialize();