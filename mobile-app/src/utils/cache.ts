/**
 * 请求缓存工具 - 带 TTL 策略
 * 用于减少重复请求，提升用户体验
 */

import Taro from '@tarojs/taro';

const CACHE_PREFIX = 'cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 默认缓存 5 分钟

/**
 * 生成缓存 key
 * @param {string} key - 基础 key
 * @param {Object} params - 请求参数
 * @returns {string}
 */
const generateCacheKey = (key, params) => {
  if (!params || Object.keys(params).length === 0) {
    return `${CACHE_PREFIX}${key}`;
  }
  const paramsStr = JSON.stringify(params);
  return `${CACHE_PREFIX}${key}_${paramsStr}`;
};

/**
 * 获取缓存数据
 * @param {string} key - 缓存 key
 * @returns {Object|null} - { data, expiry } 或 null
 */
const getCache = (key) => {
  try {
    const cacheData = Taro.getStorageSync(key);
    if (!cacheData) return null;

    const { data, expiry } = cacheData;
    if (expiry && Date.now() > expiry) {
      // 缓存已过期，删除
      Taro.removeStorageSync(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error('读取缓存失败:', error);
    return null;
  }
};

/**
 * 设置缓存数据
 * @param {string} key - 缓存 key
 * @param {any} data - 要缓存的数据
 * @param {number} ttl - 缓存时间（毫秒），默认 5 分钟
 */
const setCache = (key, data, ttl = DEFAULT_TTL) => {
  try {
    const expiry = Date.now() + ttl;
    Taro.setStorageSync(key, { data, expiry });
  } catch (error) {
    console.error('设置缓存失败:', error);
  }
};

/**
 * 清除指定缓存
 * @param {string} key - 缓存 key
 */
const removeCache = (key) => {
  try {
    Taro.removeStorageSync(key);
  } catch (error) {
    console.error('删除缓存失败:', error);
  }
};

/**
 * 清除所有缓存
 */
const clearAllCache = () => {
  try {
    const keys = Taro.getStorageInfoSync().keys;
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        Taro.removeStorageSync(key);
      }
    });
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};

/**
 * 带缓存的请求封装
 * @param {Object} options - 请求选项
 * @param {string} options.url - 请求 URL
 * @param {Object} options.params - 请求参数
 * @param {number} options.ttl - 缓存时间（毫秒）
 * @param {boolean} options.useCache - 是否使用缓存，默认 true
 * @param {Function} options.fetchFn - 实际请求函数
 * @returns {Promise<any>}
 */
export const fetchWithCache = async ({ url, params = {}, ttl = DEFAULT_TTL, useCache = true, fetchFn }) => {
  const cacheKey = generateCacheKey(url, params);

  // 尝试从缓存获取
  if (useCache) {
    const cachedData = getCache(cacheKey);
    if (cachedData !== null) {
      console.log('[Cache HIT]', url, params);
      return cachedData;
    }
    console.log('[Cache MISS]', url, params);
  }

  // 执行实际请求
  const data = await fetchFn();

  // 存入缓存
  if (useCache && data !== null && data !== undefined) {
    setCache(cacheKey, data, ttl);
  }

  return data;
};

/**
 * 预加载关键数据（首页用）
 * @param {Function} fetchFn - 请求函数
 */
export const preloadKeyData = async (fetchFn) => {
  try {
    await fetchFn();
  } catch (error) {
    console.error('预加载数据失败:', error);
  }
};

export {
  generateCacheKey,
  getCache,
  setCache,
  removeCache,
  clearAllCache,
  CACHE_PREFIX,
  DEFAULT_TTL
};
