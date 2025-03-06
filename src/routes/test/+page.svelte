<script lang="ts">
    import { derivedByCheck } from "./test";
    let counter1 = $state(0);
    let counter2 = $state(0);
    const sum = $derived.by(derivedByCheck(counter1, counter2));
</script>

<div class="flex flex-col">
    <span>
        Counter 1: {counter1}
    </span>
    <span>
        Counter 2: {counter2}
    </span>
    <span>
        Sum: {sum}
    </span>
</div>

<input
    type="button"
    value="Increment counter 1"
    onclick={() => (counter1 += 1)}
/>
<input
    type="button"
    value="Increment counter 2"
    onclick={() => (counter2 += 1)}
/>
