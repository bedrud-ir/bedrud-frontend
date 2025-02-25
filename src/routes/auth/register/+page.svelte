<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex h-screen w-full items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <Card.Root class="mx-auto max-w-sm shadow-lg transition-transform hover:scale-[1.01]">
        <Card.Header class="space-y-1">
            <Card.Title class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Register</Card.Title>
            <Card.Description class="text-slate-600">
                Create an account to get started
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="name" class="font-medium text-slate-700">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        class="transition-colors focus:border-purple-400"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="email" class="font-medium text-slate-700">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        class="transition-colors focus:border-purple-400"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="password" class="font-medium text-slate-700">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        class="transition-colors focus:border-purple-400"
                    />
                </div>
                <Button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
                    Create account
                </Button>
            </div>            

            <div class="mt-4 text-center text-sm text-slate-600">
                Already have an account?
                <a href="/auth/login" class="text-purple-600 hover:text-purple-700 transition-colors underline">Login</a>
            </div>
        </Card.Content>
    </Card.Root>
</div>
