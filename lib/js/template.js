const DEFAULTS = {
    theme: 'main',
    contentSelector: 'body > main .page-contents',
    offsetSelectors: ['body > header', 'body > footer'],
    fitToViewport: true,
    detectBodyTheme: true,
};

export default class jTemplate {
    constructor(options = {}) {
        const { theme, contentSelector, offsetSelectors, fitToViewport, detectBodyTheme } = { ...DEFAULTS, ...options };

        this.theme = theme || DEFAULTS.theme;
        this.fitToViewport = fitToViewport;
        this.detectBodyTheme = detectBodyTheme;
        this.contentSelector = contentSelector || DEFAULTS.contentSelector;
        this.offsetSelectors = offsetSelectors || DEFAULTS.offsetSelectors;
        this.heightOffsetAdjust = (offset) => offset;

        this.displayCallbacks = [];
        this.responseCallbacks = [];
        this.htmlResponseCallbacks = [];
        this.jsonResponseCallbacks = [];
    }

    ready() {
        'ontouchstart' in document.documentElement
            ? document.body.classList.add("touchable")
            : document.body.classList.remove("touchable");

        if (this.detectBodyTheme) {
            const theme = document.body.className.split(' ').find(classname => classname.match(/^theme-(.+)$/));

            if (theme) {
                this.theme = theme.replace(/^theme-/, '');
            }
        }

        if (false === this.fitToViewport) {
            this.offsetSelectors = [];
        }

        this.$content = document.querySelector(this.contentSelector);

        if (!this.$content) {
            return;
        }

        this.$offsets = [];
        for (let i = 0, n = this.offsetSelectors.length; i < n; i++) {
            const $el = document.querySelector(this.offsetSelectors[i]);
            if (!$el) {
                continue;
            }
            this.$offsets.push($el);
        }

        this.onContentDisplay();
        this.applyViewportFit();

        window.addEventListener("resize", () => {
            this.applyViewportFit();
        });
    }

    addOnContentDisplayCallback(callback) {
        if (typeof callback === 'function') {
            this.displayCallbacks.push(callback);
        }
    }

    addResponseCallbacks(callback) {
        if (typeof callback === 'function') {
            this.responseCallbacks.push(callback);
        }
    }

    addHtmlResponseCallbacks(callback) {
        if (typeof callback === 'function') {
            this.htmlResponseCallbacks.push(callback);
        }
    }

    addJsonResponseCallbacks(callback) {
        if (typeof callback === 'function') {
            this.jsonResponseCallbacks.push(callback);
        }
    }

    onContentDisplay() {
        this.displayCallbacks.forEach(callback => callback(this.$content));
    }

    applyViewportFit() {
        if (false === this.fitToViewport) {
            return;
        }

        let offset = 0;
        for (let i = 0, n = this.$offsets.length; i < n; i++) {
            if (!this.$offsets[i] || !this.$offsets[i].offsetHeight) {
                continue;
            }

            if (this.$offsets[i].offsetParent === null) {
                continue;
            }

            offset += parseFloat(getComputedStyle(this.$offsets[i]).height);
            offset += parseFloat(getComputedStyle(this.$offsets[i]).paddingTop);
            offset += parseFloat(getComputedStyle(this.$offsets[i]).paddingBottom);
        }

        offset = this.heightOffsetAdjust(offset);
        offset = Math.round(offset);

        this.$content.style.minHeight = "calc(100vh - " + offset + "px)";
    }

    onHtmlResponse(data) {
        if (data) {
            this.responseCallbacks.forEach((callback) => {
                callback(data);
            });

            this.htmlResponseCallbacks.forEach((callback) => {
                callback(data);
            });
        }
    }

    onJsonResponse(data) {
        if (data.js) {
            this.responseCallbacks.forEach((callback) => {
                callback(data.js);
            });

            this.jsonResponseCallbacks.forEach((callback) => {
                callback(data.js);
            });
        }
    }
}
