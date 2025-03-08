<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Separator } from "$lib/components/ui/separator";
    import { login } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/user.store";
    import { Mail, Lock, AlertCircle, Hand, CheckCircle } from "lucide-svelte";
    import { onMount } from "svelte";
    import { fly, fade, scale } from "svelte/transition";
    import { spring } from "svelte/motion";
    
    let email = "";
    let password = "";
    let remember = false;
    let error = "";
    let isLoading = false;
    let wiggleAnimation = true;
    let animationComplete = false;
    let showSuccessAnimation = false;

    let logoCoords = spring({ x: 50, y: 50, scale: 1.8 }, {
        stiffness: 0.1,
        damping: 0.6
    });

    onMount(() => {
        // Start with wiggling hand in center
        setTimeout(() => {
            // Stop wiggling and move to bottom left
            wiggleAnimation = false;
            
            // Position it more tightly to bottom left (x: 2, y: 98)
            logoCoords.set({ x: 2, y: 98, scale: 0.6 });
            
            // Show login form after logo moves
            setTimeout(() => {
                animationComplete = true;
            }, 800);
        }, 500); // Let the wiggle run for longer (2.5 seconds)
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isLoading = true;
        error = "";

        try {
            await login(email, password, remember);
            
            // Show success animation
            showSuccessAnimation = true;
            
            // Wait for the animation to complete before redirecting
            setTimeout(() => {
                const redirectPath = localStorage.getItem("redirect");
                if (redirectPath) {
                    goto(redirectPath);
                } else {
                    goto("/admin");
                }
            }, 1200); // Show success for 1.2 seconds before redirecting
        } catch (e) {
            console.error(e);
            error = e.message || "Login failed. Please try again.";
            isLoading = false;
        }
    }

    async function handleGoogleLogin() {
        window.location.href = `${import.meta.env.VITE_BACKEND_API}/auth/google`;
    }
</script>

<svelte:head>
  <title>Login | Bedrud</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Logo that moves from center to bottom left -->
    <div 
        class="logo-element absolute z-10"
        class:wiggle={wiggleAnimation}
        style="left: {$logoCoords.x}%; top: {$logoCoords.y}%; transform: translate(-50%, -50%) scale({$logoCoords.scale});"
    >
        <div class="flex items-center space-x-2">
            <div class="bg-sidebar flex items-center justify-center h-20 w-20 pl-7">
                <Hand class="h-8 w-8 text-sidebar-foreground" />
            </div>
            {#if $logoCoords.x < 30}
                <span 
                    class="text-xl font-bold"
                    in:fade={{ delay: 600, duration: 300 }}
                >Bedrud</span>
            {/if}
        </div>
    </div>

    <!-- Success Animation overlay -->
    {#if showSuccessAnimation}
        <div 
            class="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
            in:fade={{ duration: 300 }}
            out:fade={{ duration: 300 }}
        >
            <div 
                class="success-animation"
                in:scale={{ duration: 400, start: 0.5, opacity: 0 }}
            >
                <CheckCircle class="h-16 w-16 text-green-500" strokeWidth={3} />
                <p class="text-lg font-medium mt-4">Login successful!</p>
                <p class="text-muted-foreground text-sm">;) happy to see you again</p>
            </div>
        </div>
    {/if}

    <!-- Login form - appears after animation -->
    {#if animationComplete}
        <div 
            class="w-full max-w-sm px-4"
            in:fly={{ y: 20, duration: 400, delay: 100 }}
        >
            <Card.Root class="border shadow-sm">
                <form on:submit={handleSubmit} class="space-y-4">
                    <Card.Header class="pb-0">
                        <Card.Title class="text-center">Sign in</Card.Title>
                    </Card.Header>
                    
                    <Card.Content class="space-y-4 pt-4">
                        {#if error}
                            <div class="p-2 rounded-md bg-destructive/10 text-destructive flex items-start space-x-2 text-sm">
                                <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        {/if}
                        
                        <div class="space-y-1.5">
                            <Label for="email" class="text-xs">Email</Label>
                            <div class="relative">
                                <Mail class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    bind:value={email}
                                    placeholder="name@example.com"
                                    required
                                    class="pl-8"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <div class="space-y-1.5">
                            <Label for="password" class="text-xs">Password</Label>
                            <div class="relative">
                                <Lock class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    bind:value={password}
                                    required
                                    class="pl-8"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    class="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    bind:checked={remember}
                                />
                                <Label for="remember" class="text-xs text-muted-foreground">Remember me</Label>
                            </div>
                            <a href="/auth/reset-password" class="text-xs text-primary hover:underline">Forgot password?</a>
                        </div>

                        <div class="pt-2">
                            <Button
                                type="submit"
                                class="w-full"
                                disabled={isLoading || showSuccessAnimation}
                            >
                                {#if isLoading && !showSuccessAnimation}
                                    Signing in...
                                {:else if showSuccessAnimation}
                                    Success!
                                {:else}
                                    Sign in
                                {/if}
                            </Button>
                        </div>
                        
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <Separator class="w-full" />
                            </div>
                            <div class="relative flex justify-center">
                                <span class="bg-background px-2 text-xs text-muted-foreground">or</span>
                            </div>
                        </div>
                        
                        <Button
                            type="button"
                            variant="outline"
                            class="w-full"
                            onclick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </Card.Content>
                </form>
            </Card.Root>

            <div class="text-center text-xs text-muted-foreground mt-4">
                Don't have an account?
                <a href="/auth/register" class="text-primary hover:underline">Create one</a>
            </div>
        </div>
    {/if}
    
    <!-- Footer links -->
    {#if animationComplete}
        <div class="absolute bottom-4 right-4 flex space-x-4 text-xs text-muted-foreground">
            <a href="/about" class="hover:text-primary hover:underline">About</a>
            <a href="/terms" class="hover:text-primary hover:underline">Terms</a>
            <a href="/privacy" class="hover:text-primary hover:underline">Privacy</a>
            <a href="/contact" class="hover:text-primary hover:underline">Contact</a>
        </div>
    {/if}
</div>

<style>
    .logo-element {
        transition-property: transform, opacity;
        transition-duration: 0.8s;
        transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    /* Enhanced wiggle animation with more pronounced movement */
    .wiggle {
        animation: wiggle 0.5s ease-in-out infinite;
    }
    
    @keyframes wiggle {
        0% { transform: translate(-50%, -50%) scale(1.8) rotate(0deg); }
        20% { transform: translate(-50%, -50%) scale(1.8) rotate(-10deg); }
        35% { transform: translate(-50%, -52%) scale(1.8) rotate(0deg); }
        50% { transform: translate(-50%, -48%) scale(1.8) rotate(10deg); }
        65% { transform: translate(-50%, -52%) scale(1.8) rotate(0deg); }
        80% { transform: translate(-50%, -50%) scale(1.8) rotate(-10deg); }
        100% { transform: translate(-50%, -50%) scale(1.8) rotate(0deg); }
    }
    
    /* This matches the sidebar styling from your components */
    .bg-sidebar {
        background-color: var(--sidebar, hsl(0 0% 100%));
        border: 1px solid var(--sidebar-border, hsl(240 5.9% 90%));
    }
    
    .text-sidebar-foreground {
        color: var(--sidebar-foreground, hsl(240 10% 3.9%));
    }

    .success-animation {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: success-pulse 1.2s ease-in-out;
    }
    
    @keyframes success-pulse {
        0% { transform: scale(1); }
        10% { transform: scale(1.05); }
        20% { transform: scale(1); }
        100% { transform: scale(1); }
    }
</style>
