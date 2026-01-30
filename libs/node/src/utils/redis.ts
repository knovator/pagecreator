import lz from 'lzutf8';
import ioredis from 'ioredis';
import { defaults } from './defaults';

let redis: ioredis | null | undefined = null;

const initRedis = () => {
  if (defaults.redis && typeof defaults.redis === 'string') {
    redis = new ioredis(defaults.redis);
  } else if (defaults.redis && typeof defaults.redis === 'object') {
    redis = new ioredis(
      defaults.redis.PORT as number,
      defaults.redis.HOST as string,
      {
        password: defaults.redis.PASSWORD,
        username: defaults.redis.USER,
        db: defaults.redis.DB,
      }
    );
  } else redis = undefined;
};

export const getRedisValue = async (key: string) => {
  if (redis === null) {
    initRedis();
  }
  if (!redis) {
    return null;
  }
  const value = await redis.get(key);
  if (!value) {
    return null;
  }
  const str = lz.decompress(lz.decodeBase64(value));
  return JSON.parse(str);
};

export const setRedisValue = async (key: string, value: JSON) => {
  if (redis === null) {
    initRedis();
  }
  if (!redis) {
    return null;
  }
  const compressed = lz.encodeBase64(lz.compress(JSON.stringify(value)));
  return await redis.set(key, compressed);
};

export const deleteRedisValue = async (key: string) => {
  if (redis === null) {
    initRedis();
  }
  if (!redis) {
    return null;
  }
  return await redis.del(key);
};