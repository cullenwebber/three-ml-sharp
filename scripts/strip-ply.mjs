#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { gzipSync } from "zlib";

const KEEP = ["x", "y", "z", "f_dc_0", "f_dc_1", "f_dc_2"];

const file = process.argv[2];
if (!file) {
	console.error("Usage: node strip-ply.mjs <input.ply>");
	process.exit(1);
}

const buf = readFileSync(file);

// Find header end
const headerEnd = buf.indexOf("end_header\n");
if (headerEnd === -1) throw new Error("No end_header found");
const dataStart = headerEnd + "end_header\n".length;

const headerText = buf.subarray(0, headerEnd).toString("utf8");
const lines = headerText.split("\n");

let vertexCount = 0;
const props = [];
let offset = 0;
let inVertex = false;
const sizes = { float: 4, double: 8, int: 4, uint: 4, short: 2, ushort: 2, char: 1, uchar: 1 };

for (const line of lines) {
	const parts = line.trim().split(/\s+/);
	if (parts[0] === "element") {
		inVertex = parts[1] === "vertex";
		if (inVertex) vertexCount = parseInt(parts[2]);
	}
	if (parts[0] === "property" && inVertex) {
		const type = parts[1];
		const name = parts[2];
		const size = sizes[type] ?? 4;
		props.push({ name, type, offset, size });
		offset += size;
	}
}

const srcStride = offset;
const kept = props.filter((p) => KEEP.includes(p.name));
const dstStride = kept.reduce((s, p) => s + p.size, 0);

// Build new header
const newHeader = [
	"ply",
	"format binary_little_endian 1.0",
	`element vertex ${vertexCount}`,
	...kept.map((p) => `property ${p.type} ${p.name}`),
	"end_header\n",
].join("\n");

const headerBuf = Buffer.from(newHeader, "utf8");
const dataBuf = Buffer.alloc(vertexCount * dstStride);

for (let i = 0; i < vertexCount; i++) {
	let dstOff = 0;
	for (const p of kept) {
		buf.copy(dataBuf, i * dstStride + dstOff, dataStart + i * srcStride + p.offset, dataStart + i * srcStride + p.offset + p.size);
		dstOff += p.size;
	}
}

const out = Buffer.concat([headerBuf, dataBuf]);
const outPath = file.replace(/\.ply$/, ".min.ply");
writeFileSync(outPath, out);

const gz = gzipSync(out, { level: 9 });
writeFileSync(outPath + ".gz", gz);

const origMB = (buf.length / 1e6).toFixed(1);
const stripMB = (out.length / 1e6).toFixed(1);
const gzMB = (gz.length / 1e6).toFixed(1);

console.log(`${file}: ${origMB}MB → stripped ${stripMB}MB → gzipped ${gzMB}MB`);
