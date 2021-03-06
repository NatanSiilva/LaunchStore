const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/Controllers/productController.js')
const SearchController = require('../app/Controllers/SearchController')
const { onlyUsers } = require('../app/middlewares/session')

// Search
routes.get('/search', SearchController.index)

//products
routes.get('/create', onlyUsers, ProductController.create )
routes.get('/:id', ProductController.show )
routes.get('/:id/edit', onlyUsers, ProductController.edit )

routes.post('/', onlyUsers, multer.array("photos", 6), ProductController.post)
routes.put('/', onlyUsers, multer.array("photos", 6), ProductController.put)
routes.delete('/', onlyUsers, ProductController.delete)


module.exports = routes