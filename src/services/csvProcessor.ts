import csv from "csv-parser";
import fs from "fs";
import { snakeCase } from "lodash";
import { InitialDataImport } from "../types";

const csvProcessor = async (file: string) => {
  const parseCSVFile = async (file: string): Promise<InitialDataImport[]> => {
    return new Promise((resolve) => {
      const results: any = [];
      try {
        fs.createReadStream(file)
          .pipe(
            csv({
              mapHeaders: ({ header }) => snakeCase(header.trim()),
              mapValues: ({ value }) => (value ? value.trim() : null),
            })
          )
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results));
      } catch (error) {
        console.error("error: ", error);
      }
    });
  };

  const rows: InitialDataImport[] = await parseCSVFile(file);

  return rows;
};

export default csvProcessor;
