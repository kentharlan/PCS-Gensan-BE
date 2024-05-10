const rates_query_set = {
    getRates: `
        SELECT 
            rate_id,
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        FROM
            rates
        WHERE 
            deleted = false 
        ORDER BY 
            rate_id
    `,
    getRateById: `
        SELECT 
            rate_id,
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        FROM
            rates
        WHERE 
            rate_id = $1
    `,
    createRate: `
        INSERT INTO 
            rates (
                name,
                garage,
                no_garage,
                extra_towel,
                extra_pillow,
                extra_blanket,
                extra_single_bed,
                extra_double_bed,
                extra_person
            )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *
    `,
    updateRate: `
        UPDATE 
            rates
        SET 
            name = $1,
            garage = $2,
            no_garage = $3,
            extra_towel = $4,
            extra_pillow = $5,
            extra_blanket = $6,
            extra_single_bed = $7,
            extra_double_bed = $8,
            extra_person = $9,
            dt_updated = NOW()
        WHERE 
            rate_id = $10 
        RETURNING *
    `,
    deleteRate: `
        UPDATE
            rates 
        SET 
            deleted = true 
        WHERE 
            rate_id = $1 
        RETURNING *`
}

module.exports = {
    rates_query_set
}