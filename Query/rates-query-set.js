const rates_query_set = {
    getRates: "SELECT rate_id, name, garage, no_garage FROM rates ORDER BY rate_id",
    getRateById: "SELECT rate_id, name, garage, no_garage FROM rates WHERE rate_id = $1",
    createRate: "INSERT INTO rates (name, garage, no_garage) VALUES ($1, $2, $3) RETURNING *",
    updateRate: "UPDATE rates SET name = $1,garage = $2, no_garage = $3, dt_updated = now() WHERE rate_id = $4 RETURNING *",
    deleteRate: "DELETE FROM rates WHERE rate_id = $1 RETURNING *"
}

module.exports = {
    rates_query_set
}