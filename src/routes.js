import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import authMiddlewares from './app/middlewares/auth';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';


const routes = new Router();

const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/session',SessionController.store);

routes.use(authMiddlewares);

routes.post('/products',upload.single('file'), ProductController.store);

routes.get('/products',ProductController.index);

routes.put('/products/:id',upload.single('file'), ProductController.update);


routes.post('/categories', upload.single('file'), CategoryController.store);

routes.get('/categories',CategoryController.index);

routes.put('/categories/:id',upload.single('file'), CategoryController.update);


routes.post('/orders', OrderController.store);

routes.get('/orders:id', OrderController.index);

routes.put('/orders/:id', OrderController.update);


export default routes;

// request -> middlware -> controllers -> model -> database -> response