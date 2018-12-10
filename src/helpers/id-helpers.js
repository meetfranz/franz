export const createRandomIdString = (length = 40) => {
  const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz_-'];

  return [...Array(length)].map(() => chars[Math.random() * chars.length | 0]).join``;
};
