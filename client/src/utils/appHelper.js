export const getLocalStorage = (key) => {
  try {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch {
    return null;
  }
};

export const getAccessToken = () => {
  const user = getLocalStorage("user");
  return user?.token;
};
