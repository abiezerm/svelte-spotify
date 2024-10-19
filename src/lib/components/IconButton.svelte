<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { type Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

    type IconButtonProps = HTMLButtonAttributes & {
        icon: ComponentType<Icon>;
        label: string;
        getButton: () => HTMLButtonElement;
        //onClick: () => void;
    };

    let button: HTMLButtonElement;
    let { icon, label,  ...props }: IconButtonProps = $props();

    export function getButton() {
        return button;
    };
</script>

<button
    bind:this={button}
    {...props}
    >
    <svelte:component this={icon} color="var(--text-color)" aria-hidden="true" focusable="false" />
    <span class="visually-hidden">{label}</span>
</button>

<style lang="scss">
    button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        width: 38px;
        height: 38px;
        :global(svg) {
            vertical-align: middle;
        }
        &disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        &.active {
            background-color: var(--menu-background-color);
            border-radius: 50%;
        }
    }
</style>