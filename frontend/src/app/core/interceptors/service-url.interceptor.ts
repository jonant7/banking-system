import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const serviceUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let url = req.url;

  if (!url.startsWith('http') && url.startsWith('/api')) {
    const { services, routes } = environment.api;

    const matchedRoute = Object.keys(routes).find((route) => url.startsWith(route));

    if (matchedRoute) {
      const serviceName = routes[matchedRoute as keyof typeof routes];
      const service = services[serviceName as keyof typeof services];

      if (service.baseUrl) {
        const pathWithoutApi = url.replace('/api', '');
        url = `${service.baseUrl}/api/${service.version}${pathWithoutApi}`;
      }
    }

    return next(req.clone({ url }));
  }

  return next(req);

};
