<script lang="ts">
    import { onMount } from "svelte";
    import { ErrorUtils } from "../utils/ErrorUtils";
    import { FetchD1 } from "../utils/FetchD1";

    let txtQuery: HTMLTextAreaElement;
    let txtQueryParam: HTMLTextAreaElement;
    let btnQuery: HTMLButtonElement;
    let divResultQuery: HTMLDivElement;
    let txtExecute: HTMLTextAreaElement;
    let divResultExecute: HTMLDivElement;

    onMount(() => {});

    async function request(
        path: string,
        txtSql: HTMLTextAreaElement,
        output: HTMLDivElement,
        txtParams?: HTMLTextAreaElement
    ) {
        const fetchD1 = new FetchD1(window);
        let text = "";
        try {
            const res = await fetchD1.postSql(
                path,
                txtSql.value,
                txtParams?.value || "[]"
            );
            text = await res.text();
        } catch (error) {
            text = ErrorUtils.stackTrace(error);
        }
        output.innerText = text;
    }

    async function showAllTable() {
        txtQuery.value = "select name from sqlite_master where type='table'";
        btnQuery.click();
    }
</script>

<h1>Cloudflare D1 Proxy Playground</h1>
<h2>/query</h2>

<textarea bind:this={txtQuery} placeholder="ex:select * from user" />
<textarea bind:this={txtQueryParam} placeholder="ex:[1, 'taro']" />
<div bind:this={divResultQuery} />
<button
    bind:this={btnQuery}
    on:click={() => request("/query", txtQuery, divResultQuery, txtQueryParam)}
>
    query
</button>
<button on:click={showAllTable}> ex:show all table </button>
<h2>/execute</h2>
<textarea bind:this={txtExecute} />
<div bind:this={divResultExecute} />
<button on:click={() => request("/execute", txtExecute, divResultExecute)}>
    execute
</button>
