import { untrack } from "svelte";

export function derivedByCheck(counter1, counter2) {
    return () => {
        void counter1;
        return untrack(() => counter1 + counter2);
    }
}