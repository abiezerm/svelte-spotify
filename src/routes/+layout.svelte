<script lang="ts">
    import "modern-normalize/modern-normalize.css";
    import "../styles/main.scss";
	import { goto, invalidate, invalidateAll } from "$app/navigation";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
    //import "../app.css";

    let {data, children} = $props();
    let user = $state(data.user);
</script>

{#if user}
    <p>Hello {user.display_name}</p>
    <LogoutButton bind:user />
{/if}

{@render children()}