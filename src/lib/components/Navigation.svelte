<script lang="ts">
	import { fade } from "svelte/transition";
    import { tick, type ComponentType } from "svelte";
    import { Home, Search, ListMusic, Menu, X, type Icon } from 'lucide-svelte';

    import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";
	import { IconButton, } from "$components";

    type NavigationProps = {
        desktop: boolean;
    };

    type MenuItem = {
        path: string;
        label: string;
        icon: ComponentType<Icon>;
    };

    let { desktop }: NavigationProps = $props();

    let openMenuButton: typeof IconButton = $state();
    let closeMenuButton: typeof IconButton = $state();
    let lastFocusedElement: HTMLAnchorElement = $state();
    let isMobileMenuOpen = $state(false);
    let isOpen = $derived(desktop || isMobileMenuOpen);

    let menuItems: MenuItem[] = [
        { path: "/", label: "Home", icon: Home },
        { path: "/search", label: "Search", icon: Search },
        { path: "/playlists", label: "Playlists", icon: ListMusic },
    ]

    const openMenu = async () => {
        isMobileMenuOpen = true;
        await tick();
        closeMenuButton.getButton().focus();
    }

    const closeMenu = async () => {
        isMobileMenuOpen = false;
        await tick();
        openMenuButton.getButton().focus();
    }

    const moveFocusToBottom = (e: KeyboardEvent) => {
        if(desktop) return;
        if(e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            lastFocusedElement.focus();
        }
    }

    const moveFocusToTop = (e: KeyboardEvent) => {
        if(desktop) return;
        if(e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            closeMenuButton.focus();
        }
    }

    const handleEscape = (e: KeyboardEvent) => {
        if(e.key === 'Escape') {
            closeMenu();
        }
    }

    beforeNavigate(() => {
        isMobileMenuOpen = false;
    });
</script>

<svelte:head>
    {#if !desktop && isMobileMenuOpen}
        <style>
            body {
                overflow: hidden;
            }
        </style>
        
    {/if}
</svelte:head>

<div class="nav-content" 
    class:desktop
    class:mobile={!desktop}>
    {#if !desktop && isMobileMenuOpen}
        <div class="overlay" role="navigation" onclick={closeMenu} transition:fade={{duration: 200}} onkeyup={handleEscape}></div>
    {/if}
    <nav aria-label="Main">
        {#if !desktop}
            <IconButton 
                class="menu-button"
                icon={Menu} 
                label="Open menu"
                bind:this={openMenuButton} 
                aria-expanded={isOpen}       
                onclick={openMenu} />
           
        {/if}
        <div class="nav-content-inner" 
            role="navigation"
            class:is-hidden={!isOpen} 
            style:visibility={isOpen ? 'visible' : 'hidden'}
            onkeyup={handleEscape}>
            {#if !desktop}
                <IconButton 
                    class="close-menu-button"
                    icon={X} 
                    label="Close menu"
                    bind:this={closeMenuButton} 
                    onclick={closeMenu} 
                    onkeydown={moveFocusToBottom} />
             
            {/if}
            <img src={logo} alt="Spotify" class="logo"  />
            <ul>
                {#each menuItems as { path, label, icon }, i}
                    {@const iconProps={
                        focusable: 'false',
                        'aria-hidden': true,
                        color: 'var(--text-color)',
                        size: 26,
                        strokeWidth: 2
                    }}
                    {#if menuItems.length === i+1 }
                        <li class:active={path === $page.url.pathname} >
                            <a href={path} 
                                bind:this={lastFocusedElement}
                                onkeydown={moveFocusToTop}>
                                <svelte:component 
                                    this={icon} 
                                    {...iconProps}
                                />
                                <span>{label}</span>
                            </a>
                        </li>
                    {:else}
                        <li class:active={path === $page.url.pathname}>
                            <a href={path}>
                                <svelte:component 
                                    this={icon} 
                                    {...iconProps}
                                />
                                <span>{label}</span>
                            </a>
                        </li>
                    {/if}                   
                {/each}
            </ul>
        </div>
    </nav>
</div>

<style lang="scss">
    .nav-content {
        .overlay {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: var(--sidebar-color);
            opacity: 0.75;
            z-index: 100;
            @include breakpoint.up('md') {
                display: none;
            }
        }
        .logo {
            max-width: 100%;
            width: 130px;
        }

        .nav-content-inner {
            padding: 20px;
            min-width: var(--sidebar-width);
            background-color: var(--sidebar-color);
            height: 100vh;
            overflow: auto;
            display: none;
            ul {
                padding: 0;
                margin: 20px 0 0;
                list-style: none;
                li {
                    &.active {
                        a {
                            opacity: 1;
                            
                        }
                    }
                    a {
                        display: flex;
                        align-items: center;
                        text-decoration: none;
                        color: var(--text-color);
                        font-size: functions.toRem(14);
                        font-weight: 500;
                        padding: 5px;
                        margin: 10px 0;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                        &:hover, &:focus {
                            opacity: 1;
                        }
                        :global(svg) {
                            margin-right: 12px;
                        }
                    }
                }
            }

        }

        &.desktop {
            position: sticky;
            top: 0;

            .nav-content-inner {
                @include breakpoint.up('md') {
                    display: block;
                }
            }
        }
        &.mobile .nav-content-inner {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            transition: transform 200ms, opacity 200ms;
            &.is-hidden {
                transition: transform 200ms, opacity 200ms, visibility 200ms;
                transform: translateX(-100%);
                opacity: 0;
            }
            @include breakpoint.down('md') {
                display: block;
            }
        }
        :global(.menu-button) {
            @include breakpoint.up('md') {
                display: none;
            }
        }
        :global(.close-menu-button) {
            position: absolute;
            right: 20px;
            top: 20px;

            @include breakpoint.down('md') {
                display: block;
            }
        }
    }
</style>