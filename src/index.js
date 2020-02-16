const { Tunnel } = require('./Tunnel');
const { StaticServer } = require('./StaticServer');
const assert = require('assert');
const fastify = require('fastify')({ logger: true });

const { SERVER_ROOT } = process.env;
const PORT = 5730;

assert(SERVER_ROOT && SERVER_ROOT.length, 'process.env.SERVER_ROOT');

const tunnel = new Tunnel({ port: PORT });
const staticServer = new StaticServer({ root: SERVER_ROOT, port: PORT });

staticServer.start();

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
});

fastify.route({
    url: '/tunnel',
    method: 'GET',
    handler(req, res) {
        res.send({ tunnel });
    }
});

fastify.route({
    url: '/tunnel',
    method: 'POST',
    async handler(req, res) {
        await tunnel.start();
        res.send({ tunnel });
    }
});

fastify.route({
    url: '/tunnel',
    method: 'DELETE',
    async handler(req, res) {
        await tunnel.stop();
        res.send({ tunnel });
    }
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0');
        fastify.log.info(
            `server listening on ${fastify.server.address().port}`
        );
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
