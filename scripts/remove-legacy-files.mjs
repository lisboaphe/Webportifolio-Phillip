import { readFile, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
// Delete old paths only if their contents match the version that was reorganized.
// User-modified files are retained for review. New source files are never removed.
const legacy = {
  "components/About.tsx": "66713d1049c25341388824cb9bd28cd9ea5d1488434c60b64376450ffddd9d29",
  "components/Projects.tsx": "7b658d81aaaf23e6f710de422d7a49ae8b2a944b9b230a11bd4749ebf28cdcaf",
  "components/Stack.tsx": "bcfda67fc26dda5a5240b6fa2f2a2eaaa1a9653f0cb97427a22c18c5a3a4c3b8",
  "components/Resume.tsx": "c81b2d5dfc5e852dd20060fadc727f62d3cd016a278b088e1cec3ff7af4b3d7d",
  "components/NextSteps.tsx": "6c29c1315351d7db95761b60eaa11fc613bf6ad5653f54a62264f7a31f3f7897",
  "components/PixelIcon.tsx": "8fa726e23872bb80e94d24494bf61f002e403d7355df3bdbab00853d4de4ba5a",
  "components/SectionHeading.tsx": "37201f9588fb3983fc3437fdb05cbd27b99785fadae192b798a95eb7380da381",
  "components/Workstation.tsx": "ad6c293fd43c7139d29bf7b721a330427082940314d7a1aae0d5537dafd5c593",
  "components/Portfolio.tsx": "0443275e2142f7e606b9b00c1bc0c1351cf6325de7e85a10c0982ce0b0f08449",
  "data/site.ts": "d64f4777e6e17bbf9c955720cbffe67ece8a9c6d683613548fa4f95adb723445",
  "data/iconBounds.ts": "c6f5b6bba0aab52837d1e38f084160b5e677c3a4c9b220fc0b6aef76ae456fd6",
  "components/Hero.tsx": "d1012fd849bd63ad833a2541513b5cce7945c826170c47ace7810128ddfeac0e",
  "components/Navbar.tsx": "63d554e4ab9be1574e1aa9b8a9f810a3bf6415604020c52e516fc97c0ccb98f4",
  "components/Contact.tsx": "734143294609d285350e1b8e76192aac10f1f5d18372f10525aa3f869f577bf0",
  "components/PixelBadge.tsx": "4186ec3c9428c39bfbdb7db2a991f1cf33247f933657fa0fe218a3a36a6dd9c1",
  "data/workstationFrames.ts": "ecfd40ed7d116765f70c03ed4ab0e428897ef247256b61c8f9c31a3733140ef7",
  "README.md": "e95603c7990c51100733c6088cf018c272fca2972adcff38dc119e9e47298702",
  "docs/projektstruktur.md": "eafd95e97620c728d4aed56c7f5aec780df67ad731a1635acbfeea2a09f7a642",
  "docs/entwicklungsverlauf.md": "b16a48090a56846d9068e27d1dd1d61601e1c36b74318c6dd709435055d61cf4"
};
for (const [relative, expectedHash] of Object.entries(legacy)) {
  const file = path.join(root, relative);
  try {
    const bytes = await readFile(file);
    if (createHash("sha256").update(bytes).digest("hex") !== expectedHash) {
      console.log(`Kept modified file: ${relative}`);
      continue;
    }
    await unlink(file);
    console.log(`Removed old path: ${relative}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
