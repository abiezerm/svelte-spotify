import type { LayoutServerLoad } from './$types';

import { SPOTIFY_BASE_URL } from "$env/static/private";
import { redirect } from '@sveltejs/kit';


export const load = (async ({cookies, fetch, url }) => {
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');

    if(!accessToken) {
        return {
            user: null
        };
    }

    const profileResponse = await fetch(`${SPOTIFY_BASE_URL}/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    console.log('response ok?', profileResponse.ok);

    if(profileResponse.ok) {
        const profile: SpotifyApi.CurrentUsersProfileResponse = await profileResponse.json();

        console.log(profile);
        return {
            user: profile
        };
    } if (profileResponse.status === 401 && refreshToken) {
        //refresh token and try again
        const refreshRes = await fetch('api/auth/refresh');
        if(refreshRes.ok) {
            redirect(307, url.pathname);
        }
    } else {
        return {
            user: null
        };  
    }


}) satisfies LayoutServerLoad;