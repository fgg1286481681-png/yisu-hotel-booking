/**
 * 请求重试工具 - 带指数退避策略
 */

import Taro from '@tarojs/taro';

/**
 * 可重试的网络错误码
 */
const RETRYABLE_ERRORS = [
  'NETWORK_ERROR',
  'NETWORK_TIMEOUT',
  'request:fail',
  'request:fail -1',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'socket timeout',
  'timeout'
];

/**
 * 检查错误是否可重试
 * @param {any} error - 错误对象
 * @returns {boolean}
 */
const isRetryableError = (error: any): boolean => {
  if (!error) return false;

  const errorStr = JSON.stringify(error).toLowerCase();
  return RETRYABLE_ERRORS.some(code => errorStr.includes(code.toLowerCase()));
};

/**
 * 带重试的请求封装
 * @param {Function} requestFn - 请求函数
 * @param {Object} options - 重试配置
 * @returns {Promise<any>}
 */
export const requestWithRetry = async <T>(
  requestFn: () => Promise<T>,
  options: {
    maxRetries?: number;       // 最大重试次数，默认 3
    retryDelay?: number;       // 初始延迟（毫秒），默认 1000
    backoffMultiplier?: number; // 退避乘数，默认 2
    onRetry?: (attempt: number, error: any) => void; // 重试回调
    retryCondition?: (error: any) => boolean; // 自定义重试条件
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry,
    retryCondition
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // 判断是否应该重试
      const shouldRetry = retryCondition
        ? retryCondition(error)
        : isRetryableError(error);

      // 如果已达到最大重试次数，或错误不可重试
      if (attempt >= maxRetries || !shouldRetry) {
        console.error(`[Retry] 请求失败，已重试 ${attempt} 次:`, error);
        throw error;
      }

      // 计算延迟（指数退避）
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);

      console.log(`[Retry] 请求失败，${attempt + 1} 秒后重试...`, error);

      // 触发重试回调
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // 等待后再重试
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Taro.request 的重试封装
 * @param {Object} options - Taro.request 配置
 * @param {Object} retryOptions - 重试配置
 * @returns {Promise<any>}
 */
export const taroRequestWithRetry = (
  options: any,
  retryOptions: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  } = {}
) => {
  const { maxRetries = 3, retryDelay = 1000, backoffMultiplier = 2 } = retryOptions;

  return requestWithRetry(
    () => Taro.request(options),
    {
      maxRetries,
      retryDelay,
      backoffMultiplier,
      // 网络错误或超时时重试
      retryCondition: (error) => {
        return isRetryableError(error) || error?.errMsg?.includes('request:fail');
      }
    }
  );
};

/**
 * 带缓存和重试的请求封装
 * @param {Object} config - 配置
 * @returns {Promise<any>}
 */
export const fetchWithRetryAndCache = async <T>({
  url,
  params = {},
  fetchFn,
  useCache = true,
  cacheTTL = 3 * 60 * 1000,
  maxRetries = 3,
  retryDelay = 1000
}: {
  url: string;
  params?: Record<string, any>;
  fetchFn: () => Promise<T>;
  useCache?: boolean;
  cacheTTL?: number;
  maxRetries?: number;
  retryDelay?: number;
}): Promise<T> => {
  // 生成缓存 key
  const cacheKey = `cache_${url}_${JSON.stringify(params)}`;

  // 尝试从缓存获取
  if (useCache) {
    try {
      const cached = Taro.getStorageSync(cacheKey);
      if (cached) {
        const { data, expiry } = cached;
        if (Date.now() < expiry) {
          console.log('[Cache HIT]', url);
          return data;
        }
        Taro.removeStorageSync(cacheKey);
      }
    } catch (e) {
      // 忽略缓存错误
    }
  }

  // 带重试的请求
  const data = await requestWithRetry(fetchFn, {
    maxRetries,
    retryDelay,
    onRetry: (attempt) => {
      console.log(`[Retry] 第 ${attempt} 次重试...`);
    }
  });

  // 存入缓存
  if (useCache && data) {
    try {
      const expiry = Date.now() + cacheTTL;
      Taro.setStorageSync(cacheKey, { data, expiry });
    } catch (e) {
      // 忽略缓存错误
    }
  }

  return data;
};

export { isRetryableError, RETRYABLE_ERRORS };
