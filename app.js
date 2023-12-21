require("dotenv").config();
const axios = require("axios");
const AdmZip = require("adm-zip");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
const partes = [1, 2, 3, 4, 5];
const cookies = process.env.SESSION_COOKIE;

async function downloadFile(estado, parte, outputPath) {
  const url = `https://www.cepaberto.com/downloads.csv?name=${estado}&part=${parte}`;
  const response = await axios.post(
    url,
    {},
    {
      headers: {
        Cookie: cookies,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "arraybuffer",
    }
  );
  fs.writeFileSync(outputPath, response.data);
}

async function extractZip(zipPath, extractTo) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, true);
}

async function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const [cep] = line.split(",");
      results.push(cep);
    });

    rl.on("close", () => {
      resolve(results);
    });

    rl.on("error", (error) => {
      reject(error);
    });
  });
}

async function processEstado(estado, dataDir, outputDir) {
  const allData = [];
  for (const parte of partes) {
    const zipPath = path.join(
      dataDir,
      `${estado}.cepaberto_parte_${parte}.zip`
    );
    const csvPath = path.join(
      dataDir,
      `${estado}.cepaberto_parte_${parte}.csv`
    );

    await downloadFile(estado, parte, zipPath);
    await extractZip(zipPath, dataDir);
    const data = await processCSV(csvPath);
    allData.push(...data);
  }

  const jsonPath = path.join(outputDir, `${estado.toLowerCase()}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2));
}

async function main() {
  const outputDir = path.join(__dirname, "output");
  const dataDir = path.join(outputDir, "data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  for (const estado of estados) {
    await processEstado(estado, dataDir, outputDir);
  }

  const allBrazilData = estados.flatMap((estado) => {
    const jsonPath = path.join(outputDir, `${estado.toLowerCase()}.json`);
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  });
  const brazilJsonPath = path.join(outputDir, "brazil.json");
  fs.writeFileSync(brazilJsonPath, JSON.stringify(allBrazilData, null, 2));
}

main().catch(console.error);
