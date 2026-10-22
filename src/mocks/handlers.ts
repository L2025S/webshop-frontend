import {http, HttpResponse} from 'msw';
import {mockUsers, mockProducts} from './data';

export const handlers = [
    http.get("*/appusers/me", () => {
        return HttpResponse.json(mockUsers, {
            status: 200,
        });
        }),

        http.get("*/products", () => {
            return HttpResponse.json(mockProducts, {
                status: 200,
            });
        }),
    ];