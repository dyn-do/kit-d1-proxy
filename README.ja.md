# kit-d1-proxy
[EN](./README.md)  

Cloudflare D1 の DB をブラウザからでも読み書きできる Web API を構築します。  
DEMO: [Cloudflare D1 Proxy Playground](https://kit-d1-proxy.pages.dev/)

D1 は Cloudflare が提供する SQLite を用いたクラウド RDB サービスです。  
2023/01/25 現在、オープンアルファということでなんと**完全無料!!**  
本プロジェクトを使えば画面操作だけであなただけの D1 用 API を構築できます。  
この機会に Cloudflare D1 を使い倒しましょう😆  
> **Warning**  
> オープンアルファのため、急な仕様変更により使えなくなる可能性があります。  
> そのリスクを許容できる範囲でのみご利用ください。

## セットアップ

※ 詳細な画面操作は省略します。

1. Cloudflare に登録
2. Cloudflare D1 でデータベースを作成
3. 本プロジェクトをフォーク
4. Coudflare Pages でフォークしたGitリポジトリを接続してプロジェクト作成  
    ※ 下記の設定が必要です。  

    **環境変数 > プロダクション**  
    **環境変数 > プレビュー**  
    |変数名|値|
    |--|--|
    |`NODE_VERSION` | 16|

    **Functions > D1 データベース バインディング**
    |変数名|値|
    |--|--|
    |`D1DB`| 2. で作成したDB|

5. プロダクション環境を再度デプロイ

## 使い方
デプロイした URL を開くと Playground 画面が表示されます。  
* `SQL` 欄に実行したい SQL を入力すると `fetch` 欄に Javascript のコードが表示されます。  
  ブラウザなどで実行すると SQL が実行されます。  
  `run` ボタンで画面上から実行もできます。
* `dump` ボタンで現在の DB の状態を SQLite ファイルでダウンロードできます。
* `SQLite Command` の使い分け
    * `query` : `insert`, `update`, `delete`, `select` の基本操作
    * `execute` : `Create Table` などの定義変更操作

## 注意事項
* [バッチ](https://developers.cloudflare.com/d1/platform/client-api/#batch-statements)未対応です。(存在を見落としていました💦)

## カスタマイズ
認証無しで操作できたり、Drop Table ができてしまったりするのは危険ですね😅  
本プロジェクトは Sveltekit で書かれており、API の Request/Response は `routes/[...path]/+server.ts` がほぼ全てです。  
コード量もとても少ないので、カスタマイズにぜひチャレンジしてみてください！  