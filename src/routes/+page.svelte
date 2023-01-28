<script lang="ts">
    import { onMount } from "svelte";
    import { Command, CommandName } from "../enums/Mode";
    import type { D1Response } from "../interfaces/D1Response";
    import { FetchD1Utils } from "../utils/FetchD1Utils";
    import fileDownload from "js-file-download";
    import urljoin from "url-join";

    let txtSql: HTMLTextAreaElement;
    let txtParams: HTMLTextAreaElement;
    let txtFetch: HTMLTextAreaElement;
    let txtResult: HTMLTextAreaElement;

    let rdiCommand: Command = Command.QUERY;
    interface Example {
        name: string;
        command: Command;
        sql: string;
        paramsStr?: string;
    }

    const examples: Example[] = [
        {
            name: "show all tables",
            command: Command.QUERY,
            sql: "select name from sqlite_master where type='table';",
        },
        {
            name: "select users",
            command: Command.QUERY,
            sql: "select * from users;",
        },
        {
            name: "create users",
            command: Command.EXECUTE,
            sql: `CREATE TABLE "users" (
	"id"	INTEGER,
	"name"	TEXT,
	"age"	INTEGER DEFAULT 20,
	PRIMARY KEY("id" AUTOINCREMENT)
);`,
        },
        {
            name: "insert user",
            command: Command.QUERY,
            sql: `insert into users(name, age) values(?,?);`,
            paramsStr: '["taro", 20]',
        },
        {
            name: "drop users",
            command: Command.EXECUTE,
            sql: `DROP TABLE "users";`,
        },
    ];

    onMount(() => {
        onChangeSql();
    });

    async function request() {
        const sql = txtSql.value;
        const paramsStr =
            rdiCommand == Command.QUERY && txtParams.value
                ? txtParams.value
                : "[]";
        let result = "";
        try {
            const res = await FetchD1Utils.postSql(
                "/" + CommandName[rdiCommand],
                sql,
                paramsStr
            );
            if (res.ok) {
                let d1Res = (await res.json()) as D1Response;
                if (d1Res.result) {
                    // For Local dev
                    d1Res = d1Res.result[0];
                }
                if (d1Res.success == true) {
                    // D1 Succeess
                    result = JSON.stringify(d1Res.results);
                } else if (d1Res.success == false) {
                    // D1 Error
                    result = d1Res.error;
                }
            } else {
                // Server Error
                const message = await res.text();
                result = message;
            }
        } catch (error) {
            result = " " + error;
        }
        txtResult.value = result;
    }

    async function dump() {
        try {
            txtResult.value = "";
            const res = await FetchD1Utils.postJson(
                "/" + CommandName[Command.DUMP]
            );
            if (res.ok) {
                // Download
                const binary = await res.arrayBuffer();
                fileDownload(binary, "dump.db");
            } else {
                // Server Error
                const message = await res.text();
                txtResult.value = message;
            }
        } catch (error) {
            txtResult.value = " " + error;
        }
    }

    async function setExample(
        command: Command,
        sql: string,
        paramsStr?: string
    ) {
        rdiCommand = command;
        txtSql.value = sql;
        txtParams.value = paramsStr ?? "";
        onChangeSql();
    }

    function onChangeSql() {
        txtFetch.value = `fetch("${urljoin(
            document.URL,
            CommandName[rdiCommand]
        )}", ${JSON.stringify(
            FetchD1Utils.buildSqlRequest(
                txtSql.value,
                rdiCommand == Command.QUERY ? txtParams.value : undefined
            ),
            null,
            4
        )})`;
    }
</script>

<h1>
    Cloudflare D1 Proxy Playground
    <a
        href="https://github.com/dyn-do/kit-d1-proxy"
        target="_blank"
        rel="noreferrer"
        ><img
            src="/github-mark.png"
            width="24px"
            height="24px"
            alt="github"
        /></a
    >
</h1>

<div>
    <span class="title">SQLite Command</span>
    <label
        ><input
            type="radio"
            bind:group={rdiCommand}
            on:input={onChangeSql}
            value={Command.QUERY}
        />{CommandName[Command.QUERY]}
    </label>
    <label
        ><input
            type="radio"
            bind:group={rdiCommand}
            on:input={onChangeSql}
            value={Command.EXECUTE}
        />{CommandName[Command.EXECUTE]}
    </label>
</div>
<div class="area">
    <div>
        <span class="title">SQL:</span><br />
        <textarea
            rows="10"
            cols="96"
            bind:this={txtSql}
            on:input={onChangeSql}
            placeholder="select * from users"
        />
    </div>
    <div>
        <span class="title">Bind Params:</span><br />
        <textarea
            rows="10"
            cols="32"
            bind:this={txtParams}
            on:input={onChangeSql}
            placeholder={'[1, "taro"]'}
            disabled={rdiCommand == Command.EXECUTE}
        />
    </div>
</div>
<div class="area">
    <div>
        <span class="title">fetch: </span><button
            on:click={() => navigator.clipboard.writeText(txtFetch.value)}
            >copy</button
        ><br />
        <textarea rows="10" cols="96" bind:this={txtFetch} readonly />
    </div>
    <div>
        <span class="title">Example:</span><br />
        {#each examples as { name, command, sql, paramsStr }}
            <button on:click={() => setExample(command, sql, paramsStr)}
                >{name}</button
            ><br />
        {/each}
    </div>
</div>
<button on:click={() => request()}> run </button>
<button on:click={dump}> dump </button>

<div class="area">
    <div>
        <span class="title">Result: </span><br />
        <textarea rows="10" cols="96" bind:this={txtResult} readonly />
    </div>
</div>

<style lang="scss">
    textarea[readonly] {
        background-color: #ffc;
    }
    .title {
        font-weight: bold;
    }
    .area {
        display: flex;
    }
</style>
