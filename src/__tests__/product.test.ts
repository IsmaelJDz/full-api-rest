import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import createServer from '../utils/server';
import mongoose from 'mongoose';
//import { app } from '../app';

const app = createServer();

describe('Product', () => {
  // beforeAll(async () => {
  //   const mongoServer = await MongoMemoryServer.create();

  //   await mongoose.connect(mongoServer.getUri());
  // });

  // afterAll(async () => {
  //   await mongoose.disconnect();
  //   await mongoose.connection.close();
  // });

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const productId = 'product-123';

        await supertest(app)
          .get(`/api/products/${productId}`)
          .expect(404);
      });
    });
  });
});
