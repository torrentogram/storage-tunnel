const ngrok = require('ngrok');

class Tunnel {
    /**
     * @param {{port:string}} options
     */
    constructor({ port, authToken }) {
        this.port = port;
        this.authToken = authToken;

        this.isRunning = false;
        this.url = null;
        this.startedAt = null;
    }
    get isRunning() {
        return this._isRunning;
    }
    set isRunning(v) {
        this._isRunning = !!v;
        if (!v) {
            this.url = null;
            this.startedAt = null;
        }
    }
    async start() {
        if (this.isRunning) {
            return;
        }
        try {
            const url = await ngrok.connect({
                authtoken: this.authToken,
                port: this.port,
                onStatusChange: status => {
                    if (status === 'closed') {
                        console.log('Connection closed');
                        this.isRunning = true;
                    }
                }
            });

            this.url = url;
            this.isRunning = true;
            this.startedAt = Date.now();
            console.log(`Tunnel started on ${this.url}`);
        } catch (e) {
            this.isRunning = false;
        }
    }
    async stop() {
        if (this.isRunning) {
            await ngrok.disconnect();
            this.isRunning = false;
        }
    }
    toJSON() {
        return {
            isRunning: this.isRunning,
            url: this.url,
            startedAt: this.startedAt
        };
    }
}

exports.Tunnel = Tunnel;
