<script lang="ts">
    import { invalidate, invalidateAll } from "$app/navigation";

    let {user = $bindable()} = $props();

</script>
<form 
method="POST" 
action="/api/auth/logout"
onsubmit={async (event) => {
    event.preventDefault();
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "accept": "application/json"
        }
    });

    if (response.ok) {
        user = null;
        invalidateAll();
    }

}}>
<button type="submit" data-sveltekit-reload>Logout</button>
</form>