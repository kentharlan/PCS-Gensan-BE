const rates_query_set = {
    getRates: "SELECT rate_id, name, garage, no_garage, extra_pillow, extra_towel, extra_small_bed, extra_bed, extra_person FROM rates WHERE deleted = false ORDER BY rate_id",
    getRateById: "SELECT rate_id, name, garage, no_garage, extra_pillow, extra_towel, extra_small_bed, extra_bed, extra_person FROM rates WHERE rate_id = $1",
    createRate: "INSERT INTO rates (name, garage, no_garage, extra_pillow, extra_towel, extra_small_bed, extra_bed, extra_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    updateRate: "UPDATE rates SET name = $1,garage = $2, no_garage = $3, extra_pillow = $4, extra_towel = $5, extra_small_bed = $6, extra_bed = $7, extra_person = $8, dt_updated = now() WHERE rate_id = $9 RETURNING *",
    deleteRate: "UPDATE rates SET deleted = true WHERE rate_id = $1 RETURNING *"
}

module.exports = {
    rates_query_set
}