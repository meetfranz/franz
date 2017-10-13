import RouteParser from 'route-parser';

// eslint-disable-next-line
export const matchRoute = (pattern, path) => new RouteParser(pattern).match(path);
