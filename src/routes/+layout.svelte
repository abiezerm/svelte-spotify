<script lang="ts">
    import "modern-normalize/modern-normalize.css";
    import "../styles/main.scss";

    import { Navigation, Header } from "$components";
    //import "../app.css";

    let {data, children} = $props();
    let user = $state(data.user);

    let topbar:HTMLElement;
    let scrollY = $state(0);
    let headerOpacity = $state(0);

    $effect(() => {
        headerOpacity = scrollY / topbar.offsetHeight < 1 
        ? scrollY / topbar.offsetHeight 
        : 1;
    })

</script>

<svelte:window bind:scrollY />

<div id="main">
    {#if user}
        <div id="sidebar">
            <Navigation desktop={true} />
        </div>
    {/if}
    <div id="content">
        <div id="topbar" bind:this={topbar}>
            <div 
            class="topbar-bg" 
            style:background-color="var(--header-color)"
            style:opacity={`${headerOpacity}`}></div>
            <Header />
        </div>
        <main id="main-content" class:logged-in={user}>
            {@render children()}
        </main>
    </div>
</div>

<style lang="scss">

    #main {
        display: flex;
        #content {
            flex: 1;
            #topbar{
                position:fixed;
                height: var(--header-height);
                padding: 0 15px;
                display: flex;
                align-items: center;
                width: 100%;
                z-index: 1000;
                .topbar-bg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: -1;

                }
                @include breakpoint.up('md') {
                    padding: 0 30px;
                    width: calc(100% - var(--sidebar-width));
                }
            }
            main#main-content {
                padding: 30px 15px 60px;
                @include breakpoint.up('md') {
                    padding: 30px 30px 60px;
                }
                &.logged-in {
                    padding-top: calc(30px + var(--header-height));
                }

            }
        }
    }
</style>