import { createHash } from "node:crypto";

console.info(createHash("md5").update(process.argv.join(" ")).digest("hex"));
