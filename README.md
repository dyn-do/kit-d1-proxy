# kit-d1-proxy
[日本語](./README.ja.md)  

This project will build a web API that allows you to read and write to Cloudflare D1's DB from a browser.  
DEMO: [Cloudflare D1 Proxy Playground](https://kit-d1-proxy.pages.dev/)

D1 is a cloud RDB service provided by Cloudflare that uses SQLite.  
As of January 25, 2023, it is currently in open alpha and is **completely free**.  
With this project, you can build your own D1 API with just screen operations.  
Let's make the most of Cloudflare D1 😆

> **Warning**  
> Because it is open alpha, there is a possibility that it may become unavailable due to sudden changes in specifications.  
> Please use it only within the scope of risk that you can tolerate.

## Setup

* Detailed screen operations are omitted.  


1. Register on Cloudflare
2. Create a database on Cloudflare D1
3. Fork this project
4. Connect the forked Git repository to Cloudflare Pages and create a project  
    * The following settings are required. 

    **Environment variables > Production**  
    **Environment variables > Preview**  
    |Variable Name|Value|
    |--|--|
    |`NODE_VERSION` | 16|

    **Functions > D1 Database Binding**
    |Variable Name|Value|
    |--|--|
    |`D1DB`|Database created in step 2|

5. Deploy the production environment again

## Usage
* Opening the deployed URL will display the Playground screen.  

* Enter the SQL you want to execute in the `SQL` field and the Javascript code will be displayed in the `fetch` field.  
  If you execute it in a browser, the SQL will be executed.  
  You can also execute it from the screen with the `run` button.  
* You can download the current state of the DB as a SQLite file with the `dump` button.
* Use of `SQLite Command`
  * `query`: Basic operations such as `insert`, `update`, `delete`, `select`
  * `execute`: Definition change operations such as `Create Table`

## Notes
* [batch](https://developers.cloudflare.com/d1/platform/client-api/#batch-statements) is not supported (I missed its existence 💦)

## Development Framework
* Sveltekit 
