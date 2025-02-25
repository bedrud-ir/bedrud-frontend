<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { login } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/user.store";

    let email = "";
    let password = "";
    let remember = false;
    let error = "";
    let isLoading = false;

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isLoading = true;
        error = "";

        try {
            await login(email, password, remember);
            goto("/admin");
        } catch (e) {
            console.error(e);
            error = e.message || "Login failed. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    async function handleGoogleLogin() {
        window.location.href = `${import.meta.env.VITE_BACKEND_API}/auth/google`;
    }
</script>

<div class="flex h-screen w-full items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <Card.Root class="mx-auto max-w-sm shadow-lg transition-transform hover:scale-[1.01]">
        <form on:submit={handleSubmit}>
            <Card.Header class="space-y-1">
                <Card.Title class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Login</Card.Title>
                <Card.Description class="text-slate-600">
                    Enter your email below to login to your account
                </Card.Description>
            </Card.Header>
            <Card.Content>
                {#if error}
                    <div class="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
                        {error}
                    </div>
                {/if}
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email" class="font-medium text-slate-700">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            bind:value={email}
                            placeholder="m@example.com"
                            required
                            class="transition-colors focus:border-purple-400"
                            disabled={isLoading}
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password" class="font-medium text-slate-700">Password</Label>
                            <a
                                href="/auth/reset-password"
                                class="ml-auto inline-block text-sm text-purple-600 hover:text-purple-700 transition-colors underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            bind:value={password}
                            required 
                            class="transition-colors focus:border-purple-400"
                            disabled={isLoading}
                        />
                    </div>
                    <div class="flex items-center space-x-2">
                        <input
                            id="remember"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            bind:checked={remember}
                        />
                        <Label for="remember" class="text-sm text-slate-600">Remember me</Label>
                    </div>
                    <Button 
                        type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                    <Button 
                        type="button"
                        variant="outline" 
                        class="w-full border-slate-300 hover:bg-slate-100 transition-colors"
                        on:click={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        Login with Google
                    </Button>
                </div>
                <div class="mt-4 text-center text-sm text-slate-600">
                    Don't have an account?
                    <a href="/auth/register" class="text-purple-600 hover:text-purple-700 transition-colors underline"> Sign up </a>
                </div>
            </Card.Content>
        </form>
    </Card.Root>
</div>
