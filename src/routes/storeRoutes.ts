import { Router } from 'express';
import { requireAuth, requireStoreAccount } from '../middleware/auth';
import * as menus from '../controllers/storeMenusController';
import * as categories from '../controllers/storeCategoriesController';
import * as products from '../controllers/storeProductsController';

const router = Router();

router.use(requireAuth, requireStoreAccount);

// Menus (CRUD scoped to user's store)
router.get('/menus', menus.listMyStoreMenus);
router.get('/menus/:id', menus.getMyStoreMenu);
router.post('/menus', menus.createMyStoreMenu);
router.put('/menus/:id', menus.updateMyStoreMenu);

// Categories (CRUD scoped to user's store)
router.get('/categories', categories.listMyStoreCategories);
router.get('/categories/:id', categories.getMyStoreCategory);
router.post('/categories', categories.createMyStoreCategory);
router.put('/categories/:id', categories.updateMyStoreCategory);

// Products (CRUD scoped to user's store)
router.get('/products', products.listMyStoreProducts);
router.get('/products/:id', products.getMyStoreProduct);
router.post('/products', products.createMyStoreProduct);
router.put('/products/:id', products.updateMyStoreProduct);
router.patch('/products/:id/availability', products.patchMyStoreProductAvailability);

export default router;
