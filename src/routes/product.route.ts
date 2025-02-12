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
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";
import { validateRequestBody } from '../middlewares/validation.middleware';


const router = express.Router();

router.get('/', getAllProducts); // eg: /products?category=electronics&minPrice=100&maxPrice=500&sortBy=price&order=asc
router.get('/active', getActiveProducts);
router.get('/inactive', getInactiveProducts);
router.get('/:id', getProductById);
router.post('/', 
  authenticateUser, 
  checkAdmin, 
  validateRequestBody(['name', 'desc', 'img', 'price', 'category', 'quantity']), 
  newProduct);
router.put('/:id', 
  authenticateUser, 
  checkAdmin, 
  validateRequestBody(['name', 'desc', 'img', 'price', 'category', 'quantity']), 
  updateProduct);
router.delete('/:id', authenticateUser, checkAdmin, deleteProduct);

export default router;


