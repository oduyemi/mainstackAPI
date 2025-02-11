import express from 'express';
import { 
  getAllProducts, 
  getActiveProducts, 
  getInactiveProducts, 
  getProductById, 
  newProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller';

const router = express.Router();

router.get('/', getAllProducts); // eg: /products?category=electronics&minPrice=100&maxPrice=500&sortBy=price&order=asc
router.get('/active', getActiveProducts);
router.get('/inactive', getInactiveProducts);
router.get('/:id', getProductById);
router.post('/', newProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
