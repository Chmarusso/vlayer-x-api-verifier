/// <reference types="bun" />

import { createVlayerClient } from "@vlayer/sdk";
import proverSpec from "../out/TwitterProver.sol/TwitterProver";
import verifierSpec from "../out/TwitterVerifier.sol/TwitterVerifier";
import {
  getConfig,
  createContext,
  deployVlayerContracts,
  writeEnvVariables,
} from "@vlayer/sdk/config";

const URL_TO_PROVE = "https://api.twitter.com/2/users/by/username/ArtiChmaro\?user.fields\=public_metrics";
const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN;

const config = getConfig();
const { chain, ethClient, account, proverUrl, confirmations, notaryUrl } =
  createContext(config);

if (!X_API_BEARER_TOKEN) {
  throw new Error("X_API_BEARER_TOKEN is not set in your environment variables");
}
if (!account) {
  throw new Error(
    "No account found make sure EXAMPLES_TEST_PRIVATE_KEY is set in your environment variables",
  );
}

const vlayer = createVlayerClient({
  url: proverUrl,
  token: config.token,
});

async function generateWebProof() {
  console.log("⏳ Generating web proof...", notaryUrl);
  const result =
    await Bun.$`vlayer web-proof-fetch --notary ${notaryUrl} --url ${URL_TO_PROVE} -H "Authorization: Bearer ${X_API_BEARER_TOKEN}"`;
  return result.stdout.toString();
}

console.log("⏳ Deploying contracts...");

const { prover, verifier } = await deployVlayerContracts({
  proverSpec,
  verifierSpec,
  proverArgs: [],
  verifierArgs: [],
});

await writeEnvVariables(".env", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
});

console.log("✅ Contracts deployed", { prover, verifier });

const webProof = await generateWebProof();

console.log("⏳ Proving...");
const hash = await vlayer.prove({
  address: prover,
  functionName: "main",
  proverAbi: proverSpec.abi,
  args: [
    {
      webProofJson: webProof.toString(),
    },
  ],
  chainId: chain.id,
});
const result = await vlayer.waitForProvingResult({ hash });
const [proof, username, followersCount] = result;
console.log("✅ Proof generated");

console.log("⏳ Verifying...");
const txHash = await ethClient.writeContract({
  address: verifier,
  abi: verifierSpec.abi,
  functionName: "verify",
  args: [proof, username, followersCount],
  chain,
  account,
});

await ethClient.waitForTransactionReceipt({
  hash: txHash,
  confirmations,
  retryCount: 60,
  retryDelay: 1000,
});

console.log("✅ Verified!");
