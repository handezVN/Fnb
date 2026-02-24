import express from 'express';
import path from 'path';
import routes from './routes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1/upload', uploadRoutes);

app.use('/', routes);

export default app;
