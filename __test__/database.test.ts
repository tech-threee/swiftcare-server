import { MONGO_URI } from '../database';

describe('MONGO_URI', () => {
  // Returns MONGO_URI_PRO when NODE_ENV is 'production'
  it('should return MONGO_URI_PRO when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGO_URI_PRO = 'mongodb://localhost:27017/prod';
    process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/test';
    process.env.MONGO_URI_DEV = 'mongodb://localhost:27017/dev';

    const result = MONGO_URI();

    expect(result).toBe(process.env.MONGO_URI_PRO);
  });

  // Returns MONGO_URI_TEST when NODE_ENV is 'test'
  it('should return MONGO_URI_TEST when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGO_URI_PRO = 'mongodb://localhost:27017/prod';
    process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/test';
    process.env.MONGO_URI_DEV = 'mongodb://localhost:27017/dev';

    const result = MONGO_URI();

    expect(result).toBe(process.env.MONGO_URI_TEST);
  });

  // Returns MONGO_URI_DEV when NODE_ENV is not 'production' or 'test'
  it('should return MONGO_URI_DEV when NODE_ENV is not production or test', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGO_URI_PRO = 'mongodb://localhost:27017/prod';
    process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/test';
    process.env.MONGO_URI_DEV = 'mongodb://localhost:27017/dev';

    const result = MONGO_URI();

    expect(result).toBe(process.env.MONGO_URI_DEV);
  });

  // Returns undefined when NODE_ENV is not defined
  it('should return undefined when NODE_ENV is not defined', () => {
    process.env.NODE_ENV = undefined;
    process.env.MONGO_URI_PRO = 'mongodb://localhost:27017/prod';
    process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/test';
    process.env.MONGO_URI_DEV = 'mongodb://localhost:27017/dev';

    const result = MONGO_URI();

    expect(result).toBeUndefined();
  });
});
