(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("jTemplate requires a window and a document");
    }

    if (typeof global.jTemplate !== "undefined") {
        throw new Error("jTemplate is already defined");
    }

    // @CODE

    global.jTemplate = jTemplate;

})(typeof window !== "undefined" ? window : this);
