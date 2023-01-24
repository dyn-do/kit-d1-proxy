<script lang="ts">
    import { onMount } from "svelte";
    import { Command, CommandName } from "../enums/Mode";
    import type { D1Response } from "../interfaces/D1Response";
    import { FetchD1 } from "../utils/FetchD1";
    import fileDownload from "js-file-download";

    let txtSql: HTMLTextAreaElement;
    let txtParams: HTMLTextAreaElement;
    let btnQuery: HTMLButtonElement;
    let spanRequest: HTMLSpanElement;
    let spanResult: HTMLSpanElement;

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

    async function request() {
        const fetchD1 = initFetch();
        const sql = txtSql.value;
        const paramsStr =
            rdiCommand == Command.QUERY && txtParams.value
                ? txtParams.value
                : "[]";
        let result = "";
        try {
            const res = await fetchD1.postSql(
                "/" + CommandName[rdiCommand],
                sql,
                paramsStr
            );
            if (res.ok) {
                const d1Res = (await res.json()) as D1Response;
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
        spanResult.innerText = result;
    }

    async function dump() {
        const fetchD1 = initFetch();
        try {
            const res = await fetchD1.postJson("/" + CommandName[Command.DUMP]);
            if (res.ok) {
                // Download
                const binary = await res.arrayBuffer();
                fileDownload(binary, "dump.db");
            } else {
                // Server Error
                const message = await res.text();
                spanResult.innerText = message;
            }
        } catch (error) {
            spanResult.innerText = " " + error;
        }
    }

    function initFetch() {
        spanRequest.textContent = "";
        const fetchD1 = new FetchD1();
        fetchD1.output = (e) => {
            spanRequest.textContent = e;
        };
        return fetchD1;
    }

    async function setExample(
        command: Command,
        sql: string,
        paramsStr?: string
    ) {
        rdiCommand = command;
        txtSql.value = sql;
        txtParams.value = paramsStr ?? "";
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
            value={Command.QUERY}
        />{CommandName[Command.QUERY]}
    </label>
    <label
        ><input
            type="radio"
            bind:group={rdiCommand}
            value={Command.EXECUTE}
        />{CommandName[Command.EXECUTE]}
    </label>
</div>
<div class="sql">
    <div>
        <span class="title">SQL:</span><br />
        <textarea
            rows="10"
            cols="96"
            bind:this={txtSql}
            placeholder="select * from users"
        />
    </div>
    <div>
        <span class="title">Bind Params:</span><br />
        <textarea
            rows="10"
            cols="32"
            bind:this={txtParams}
            placeholder="[1, 'taro']"
            disabled={rdiCommand == Command.EXECUTE}
        />
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
<button bind:this={btnQuery} on:click={() => request()}> run </button>
<button on:click={dump}> dump </button>

<div>
    <span class="title">Request: </span><span bind:this={spanRequest} />
</div>
<div>
    <span class="title">Result: </span><span bind:this={spanResult} />
</div>

<style lang="scss">
    .title {
        font-weight: bold;
    }
    .sql {
        display: flex;
    }
</style>
