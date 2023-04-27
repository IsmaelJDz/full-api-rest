import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import createServer from '../utils/server';
import mongoose from 'mongoose';
import { createProduct } from '../service/product.service';
//import { app } from '../app';
import jwt from 'jsonwebtoken';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const productPayload = {
  user: userId,
  title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
  description:
    'Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.',
  price: 879.99,
  image: 'https://i.imgur.com/QlRphfQ.jpg',
};

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
    // describe('given the product does not exist', () => {
    //   it('should return a 404', async () => {
    //     const productId = '6449b16cc49007e551492ce4';

    //     await supertest(app)
    //       .get(`/api/products/${productId}`)
    //       .expect(404);
    //   });
    // });

    describe('given an exist product, get it', () => {
      it('should return an existing product and status 200', async () => {
        const productId = 'product_x9799vjj22';

        const jwt =
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDQ5YWZlOGM0OTAwN2U1NTE0OTJjZGYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiSmFuZSBEb2UiLCJjcmVhdGVkQXQiOiIyMDIzLTA0LTI2VDIzOjEyOjQwLjg0OVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA0LTI2VDIzOjEyOjQwLjg0OVoiLCJfX3YiOjAsInNlc3Npb24iOiI2NDQ5YmVlNGVkZDU2NzQwZTA5N2Y1MjYiLCJpYXQiOjE2ODI1NTQ1OTYsImV4cCI6MTY4MjU1NTQ5Nn0.L8JEg5Ux81jUlhRrFv5iFkwVdRl9Y1CkMy8Q3dXSsPtEoiI_2MIQC5Pa3oyrCOaEJTdXEsEdWc0z5bl6_JtVV0HHpq98qmckAzZO-sHqSu0N87bWAo-mBB06Da-JuVVD0E2K56nxowfxVKyws-tPYEfMLap0dGJxa7itnWquVD4';

        const { statusCode } = await supertest(app)
          //.get(`/api/products/${productId}`)
          //.get(`/api/products/product_x9799vjj22`)
          //.set('Authorization', 'Bearer ' + jwt);
          .get(`/api/products/product_x9799vjj22`)
          .set('Authorization', `Bearer ${jwt}`);

        expect(statusCode).toBe(200);
      });
    });

    describe('given the product does exist', () => {
      it('should return a 200 and the product', async () => {
        const product = await createProduct(productPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toEqual(200);

        expect(body.productId).toEqual(product.productId);
      });
    });
  });
});
