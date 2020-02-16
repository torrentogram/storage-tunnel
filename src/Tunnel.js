const handler = require('serve-handler');
const http = require('http');
const localtunnel = require('localtunnel');

class Tunnel {
    /**
     * @param {{port:string}} options
     */
    constructor({ port }) {
        this.port = port;
        this.isRunning = false;
        this.url = null;
        this.startedAt = null;
        this.tunnel = null;
    }
    get isRunning() {
        return this._isRunning;
    }
    set isRunning(v) {
        this._isRunning = !!v;
        if (!v) {
            this.url = null;
            this.tunnel = null;
            this.startedAt = null;
        }
    }
    async start() {
        if (this.isRunning) {
            return;
        }
        try {
            this.tunnel = await localtunnel(this.port);

            this.isRunning = true;
            this.url = this.tunnel.url;
            this.startedAt = Date.now();
            console.log(`Tunnel started on ${this.url}`);

            this.tunnel.on('close', () => {
                console.log('Tunnel closed');
                this.isRunning = false;
            });
        } catch (e) {
            this.isRunning = false;
        }
    }
    async stop() {
        if (this.isRunning) {
            this.tunnel.close();
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
