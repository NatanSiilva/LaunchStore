const Base = require('../models/Base')

const db = require('../../config/db')

Base.init({ table: 'products' })

module.exports = {
    
    ...Base,

    async files(id) {
        const results = await db.query(`
            SELECT * FROM files WHERE product_id = $1
        `, [id])

        return results.rows
    },

    search(params) {
        
        const { filter, category } = params

        let query = "",
            filterQuery = `WHERE`

        if (category) {
            filterQuery = `${filterQuery}
               products.category_id = ${category}
               AND
            `
        }  
        
        filterQuery = `
            ${filterQuery}
            products.name ilike '%${filter}%'
            OR products.description ilike '%${filter}%'
        `
    

        query = `
            SELECT products.*, 
                categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `

        return db.query(query)
    },
}
    // create(data) {
    //     const query = `
    //         INSERT INTO products (
    //             category_id,
    //             user_id,
    //             name,
    //             description,
    //             old_price,
    //             price,
    //             quantity,
    //             status
    //         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    //         RETURNING id
    //     `

    //     // entra assim R$1.23
    //     data.price = data.price.replace(/\D/g,"")
    //     // chega no db assim 123 , dai qundo for mostrar no front temo que converter ele como era antes; 123/100 = 1,23


    //     const values = [
    //         data.category_id,
    //         data.user_id,
    //         data.name,
    //         data.description,
    //         data.old_price || data.price,
    //         data.price,
    //         data.quantity,
    //         data.status || 1                  
    //     ]
        
        
    //     return db.query(query, values)
    // },