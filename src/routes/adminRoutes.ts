import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import * as stores from '../controllers/adminStoresController';
import * as users from '../controllers/adminUsersController';
import * as menus from '../controllers/adminMenusController';
import * as categories from '../controllers/adminCategoriesController';
import * as products from '../controllers/adminProductsController';

const router = Router();

router.use(requireAuth, requireAdmin);

// 1. Store Management
router.get('/stores', stores.listStores);
router.get('/stores/:id', stores.getStore);
router.post('/stores', stores.createStore);
router.put('/stores/:id', stores.updateStore);
router.delete('/stores/:id', stores.deleteStore);

// 2. User Management
router.get('/users', users.listUsers);
router.get('/users/:id', users.getUser);
router.post('/users', users.createUser);
router.put('/users/:id', users.updateUser);
router.patch('/users/:id/status', users.patchUserStatus);

// 3. Menu Management
router.get('/menus', menus.listMenus);
router.get('/menus/:id', menus.getMenu);
router.post('/menus', menus.createMenu);
router.put('/menus/:id', menus.updateMenu);

// Category
router.get('/categories', categories.listCategories);
router.get('/categories/:id', categories.getCategory);
router.post('/categories', categories.createCategory);
router.put('/categories/:id', categories.updateCategory);

// Product
router.get('/products', products.listProducts);
router.get('/products/:id', products.getProduct);
router.post('/products', products.createProduct);
router.put('/products/:id', products.updateProduct);
router.patch('/products/:id/availability', products.patchProductAvailability);

export default router;
