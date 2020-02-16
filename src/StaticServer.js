const handler = require('serve-handler');
const http = require('http');

class StaticServer {
    /**
     * @param { {
     *   port: number;
     *   root: string;
     * } } options
     */
    constructor({ port, root }) {
        this.port = port;
        this.root = root;
    }
    start() {
        const { port, root } = this;
        const server = http.createServer((request, response) => {
            return handler(request, response, {
                public: root
            });
        });

        server.listen(port, () => {
            console.log(
                `Static server listening at http://0.0.0.0:${port} serving ${root}`
            );
        });
    }
}

exports.StaticServer = StaticServer;
