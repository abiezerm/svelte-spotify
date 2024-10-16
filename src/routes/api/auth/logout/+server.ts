import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({cookies, request }) => {
    cookies.delete('access_token', {path: '/'});
    cookies.delete('refresh_token', {path: '/'});

    if(request.headers.get('accept') === 'application/json') {
        return json({
            success: true,
            message: 'Logged out'
        });
    }

    redirect(303, '/login');
};