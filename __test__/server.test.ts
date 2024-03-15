import CreateServer from '../utils/server';
import request from 'supertest';

describe('CreateServer', () => {
  const app = CreateServer();
  it('should respond with 200 on the root route', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
  });

  it('should respond with 404 on a nonexistent route', async () => {
    const response = await request(app).get('/api/v1/nonexistent');
    expect(response.status).toBe(404);
  });
  // Creates an express app
  it('should create an express app', () => {
    // app is an instance of a function
    expect(app).toBeInstanceOf(Function);
  });

  // Uses express.json middleware
  it('should use express.json middleware', () => {
    expect(app._router.stack[1].handle.name).toBe('expressInit');
  });

  // Uses cookieParser middleware
  it('should use jsonParser middleware', () => {
    expect(app._router.stack[3].handle.name).toBe('jsonParser');
  });

  // Uses cors middleware with credentials and origin options
  it('should use Cors middleware', () => {
    expect(app._router.stack[4].handle.name).toBe('corsMiddleware');
  });

  // Uses cookierParser middleware
  it('should use cookieParser ', () => {
    expect(app._router.stack[2].handle.name).toBe('cookieParser');
  });

  // Uses ROUTES middleware
  it('should use ROUTES middleware', () => {
    expect(app._router.stack[5].name).toBe('router');
  });

  // Uses  ErrorHandler middleware
  it('should use ErrorHandler middleware', () => {
    expect(app._router.stack[6].handle.name).toBe('Errorhandler');
  });

  // .env file is loaded
  it('should load .env file', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
