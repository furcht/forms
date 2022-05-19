
// ### AJAX HANDLER ### //
(function() {
    
    /*
        Known possible limitations of this script is
        that this may only handle one request at a time.
        Therefore, if any request is not yet finished,
        all actions associated with the first request
        may never fire.
    */

    // ### PRIVATE PROPERTIES ### //
    var fnQueue;

    // ### CONSTRUCTOR ### //
    var AJAX = function() {
        // -- empty
    }
    
    // ### PUBLIC METHODS ### //
    AJAX.prototype.getData = function(options, fn) {
        /*
            DATA SAMPLE
            {
                url: [[STRING]],
                method: [[POST_METHOD]],
                data: [[OBJECT]]
            }
        */
        var oReq = new XMLHttpRequest();
        var oReqMethod = (options.method) ? options.method : "GET";
        oReq.addEventListener("progress", ajaxProgress);
        oReq.addEventListener("load", ajaxComplete);
        oReq.addEventListener("error", ajaxFailed);
        oReq.addEventListener("abort", ajaxCanceled);
        oReq.open(oReqMethod, options.url);
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        if (options.method == "POST") oReq.send(JSON.stringify(options.data));
        else oReq.send();
    
        fnQueue = fn;
    }

    // --- PRIVATE METHODS --- //
    function ajaxProgress (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total * 100;
            // ...
        } else {
            // Unable to compute progress information since the total size is unknown
        }
    }    
    function ajaxComplete() {
        fnQueue(JSON.parse(this.response));
    }
    function ajaxFailed() {
        console.log('error');
    }
    function ajaxCanceled() {
        console.log("The transfer has been canceled by the user.");
    }

    this._ajax_ = new AJAX();
})();