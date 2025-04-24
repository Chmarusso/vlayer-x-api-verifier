# Server-side Web Proof Generation for Twitter API Data

This example demonstrates how to use [vlayer Web Proof](https://book.vlayer.xyz/features/web.html) to notarize an HTTP request to:

```
https://api.twitter.com/2/users/by/username/{twitterHandle}?user.fields=public_metrics
```

It generates a **Zero-Knowledge Proof (ZK proof)** based on the API response, which can then be verified by an **on-chain EVM smart contract**.

---

## How to Run

### 1. Build Contracts
```sh
cd {projectPath}
forge build
```

### 2. Install JS Dependencies
```sh
cd vlayer
bun install
```

### 3. Set Twitter API Bearer Token
Create a `.env.local` file inside the `vlayer` directory and set your bearer token:

```
X_API_BEARER_TOKEN=your_token_here
```

### 4. Start Local Devnet
```sh
bun run devnet:up
```

### 5. Run Proving Process
```sh
bun run prove:dev
```

---

📘 You can find a full walkthrough in the vlayer documentation:  
👉 [Getting Started – First Steps](https://book.vlayer.xyz/getting-started/first-steps.html)
