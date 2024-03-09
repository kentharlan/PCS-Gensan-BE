const { Pool } = require('pg')

class Pg {
    static pool = null;

    static async init() {
        if (!Pg.pool) {
            Pg.pool = new Pool({
                user: process.env.PGUSER,
                host: process.env.PGHOST,
                database: process.env.PGDATABASE,
                password: process.env.PGPASSWORD,
                port: parseInt(process.env.PGPORT)
            })
        }
        return
    }

    static async getClientFromPool() {
        if (!Pg.pool) {
          await Pg.init();
        }
        return await Pg.pool.connect();
    }

    static async query(qry, params) {
        let client = null;
        try {
            client = await Pg.getClientFromPool();
            const r = await client.query(qry, params);
            return r.rows;
        } catch (error) {
            throw error
        } finally {
            if (client)
            client.release();
        }
    }
}

module.exports = {
    Pg
}
