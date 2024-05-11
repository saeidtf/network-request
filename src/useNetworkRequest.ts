import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface UseNetworkRequestResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

type CacheData = {
  date: Date;
  data: object;
};

const cache = new Map<string, CacheData>();

const useNetworkRequest = <T>(
  url: string,
  cacheKey: string
): UseNetworkRequestResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const fetchData = async () => {
    try {
      const cacheData = cache.get(cacheKey);
      const cacheExpired =
        cacheData && cacheData?.date < new Date(new Date().getTime() - 5000);
      if (cacheExpired) {
        setData(cache.get(cacheKey) as T);
        setLoading(false);
        return;
      } else if (cacheData) {
        cache.delete(cacheKey);
      }

      const response: AxiosResponse<T> = await axios.get<T>(url, {
        cancelToken: source.token,
        timeout: 5000,
      });
      setData(response.data);
      setLoading(false);
      setError(null);

      cache.set(cacheKey, {
        date: new Date(),
        data: response.data as object,
      });
    } catch (error) {
      setError("مشکلی در بارگیری داده‌ها رخ داده است.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, cacheKey]);

  const refetch = () => {
    cache.delete(cacheKey);
    setError(null);
    setLoading(true);
    fetchData();
  };

  return { data, error, loading, refetch };
};

export default useNetworkRequest;
