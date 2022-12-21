export const setWithExpiry = (key: string, value: string, ttl: number) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const fetchWithSteroids = (key: string): any => {
  const cache = getWithExpiry(key);

  return (url: string) => {
    if (cache) {
      return Promise.resolve(cache);
    }

    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const ONE_HOUR = 60 * 60 * 1000;
        setWithExpiry(key, res, ONE_HOUR);
        return res;
      });
  };
};
