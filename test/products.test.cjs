const request = require('supertest');
const app = require('../src/app.js');
const config = require('../src/config/config.js');

async function importChai() {
  return await import('chai');
}

describe('Products API', function() {
    let validProductId;
    const nonExistentId = '15c9ed04211074ca21a9764f';
    let chai, expect;
    let cookie;

    this.timeout(10000); 

    before(async function() {
        chai = await importChai();
        expect = chai.expect;

        try {
            const res = await request(app)
                .post('/api/sessions/login')
                .send({ email: config.TEST_USER_EMAIL, password: config.TEST_USER_PASSWORD });

            cookie = res.headers['set-cookie'][0].split(';')[0];
        } catch (error) {
            console.error('Error durante la autenticación:', error);
            throw error;
        }
    });

    describe('GET /api/products', () => {
        it('should get all products with pagination', (done) => {
            request(app)
                .get('/api/products')
                .set('Cookie', cookie)
                .query({ page: 1, limit: 10 })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('products').that.is.an('array');
                    expect(res.body).to.have.property('totalPages');
                    expect(res.body).to.have.property('page').that.equals(1);
                    done();
                });
        });
    });

    describe('POST /api/products', () => {
        it('should create a new product', (done) => {
            const newProduct = {
                title: 'Test Product',
                price: 100,
                description: 'Test Description',
                code: 'TEST123',
                stock: 10,
                category: 'Test Category'
            };
            request(app)
                .post('/api/products')
                .set('Cookie', cookie)
                .send(newProduct)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Producto agregado correctamente');
                    validProductId = res.body.id;
                    done();
                });
        });
    
        it('should return 400 for missing fields', (done) => {
            const newProduct = {
                title: 'Test Product'
            };
            request(app)
                .post('/api/products')
                .set('Cookie', cookie)
                .expect(400)
                .send(newProduct)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('code').that.equals('MISSING_FIELDS');
                    expect(res.body).to.have.property('message').that.includes('Campos requeridos faltantes');
                    done();
                });
        });
    });

    describe('GET /api/products/:pid', () => {
        it('should get a product by id', (done) => {
            request(app)
                .get(`/api/products/${validProductId}`)
                .set('Cookie', cookie)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('_id').that.equals(validProductId);
                    done();
                });
        });
    
        it('should return 404 for a non-existent product', (done) => {
            request(app)
                .get(`/api/products/${nonExistentId}`)
                .set('Cookie', cookie)
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('code').that.equals('NOT_FOUND');
                    expect(res.body).to.have.property('message').that.equals('Producto no encontrado');
                    done();
                });
        });
    });    

    describe('PUT /api/products/:id', () => {
        it('should update an existing product', (done) => {
            const updateData = { price: 200 };
            request(app)
                .put(`/api/products/${validProductId}`)
                .set('Cookie', cookie)
                .send(updateData)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Producto actualizado correctamente');
                    done();
                });
        });
    
        it('should return 404 for a non-existent product', (done) => {
            const updateData = { price: 200 };
            request(app)
                .put(`/api/products/${nonExistentId}`)
                .set('Cookie', cookie)
                .send(updateData)
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('code').that.equals('NOT_FOUND');
                    expect(res.body).to.have.property('message').that.equals('Producto no encontrado');
                    done();
                });
        });
    });    

    describe('DELETE /api/products/:pid', () => {
        it('should delete an existing product', (done) => {
            request(app)
                .delete(`/api/products/${validProductId}`)
                .set('Cookie', cookie)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Producto eliminado correctamente');
                    done();
                });
        });
    
        it('should return 404 for a non-existent product', (done) => {
            request(app)
                .delete(`/api/products/${nonExistentId}`)
                .set('Cookie', cookie)
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('code').that.equals('NOT_FOUND');
                    expect(res.body).to.have.property('message').that.equals('Producto no encontrado');
                    done();
                });
        });
    });
});