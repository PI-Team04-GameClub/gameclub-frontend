/**
 * ADAPTER PATTERN - STRUCTURAL
 * Omogućuje suradnju nekompatibilnih sučelja
 * 
 * Kada koristiti:
 * • Integracija različitih formata podataka
 * • Konverzija između XML, JSON, CSV
 * • Kompatibilnost različitih API-ja
 */

import logger from "./logger";

/**
 * Sučelje za podatke o igri
 */
export interface GameData {
  id: number;
  title: string;
  status: "active" | "inactive";
  createdAt: string;
}


/**
 * FORMAT ADAPTER - Konvertuje podatke između različitih formata
 * JSON ↔ CSV ↔ XML
 */
export class DataFormatAdapter {
  /**
   * Pretvara JSON u CSV format
   * JSON → CSV
   */
  static jsonToCsv(games: GameData[]): string {
    logger.info("Konverzija: JSON → CSV");

    const headers = "id,title,status,createdAt";
    let csv = headers + "\n";

    for (const game of games) {
      csv += `${game.id},"${game.title}",${game.status},${game.createdAt}\n`;
    }

    logger.info(`${games.length} igara konvertovano u CSV format`);
    return csv;
  }

  /**
   * Pretvara CSV u JSON format
   * CSV → JSON
   */
  static csvToJson(csvData: string): GameData[] {
    logger.info("Konverzija: CSV → JSON");

    const lines = csvData.trim().split("\n");
    const games: GameData[] = [];

    // Preskoči header red
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;

      const parts = lines[i].split(",");
      const game: GameData = {
        id: parseInt(parts[0]),
        title: parts[1].replace(/"/g, ""), // Uklanja navodnike
        status: parts[2] as "active" | "inactive",
        createdAt: parts[3],
      };

      games.push(game);
    }

    logger.info(`${games.length} igara konvertovano iz CSV formata`);
    return games;
  }

  /**
   * Pretvara JSON u XML format
   * JSON → XML
   */
  static jsonToXml(games: GameData[]): string {
    logger.info("Konverzija: JSON → XML");

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += "<games>\n";

    for (const game of games) {
      xml += "  <game>\n";
      xml += `    <id>${game.id}</id>\n`;
      xml += `    <title>${game.title}</title>\n`;
      xml += `    <status>${game.status}</status>\n`;
      xml += `    <createdAt>${game.createdAt}</createdAt>\n`;
      xml += "  </game>\n";
    }

    xml += "</games>";

    logger.info(`${games.length} igara konvertovano u XML format`);
    return xml;
  }

  /**
   * Pretvara XML u JSON format
   * XML → JSON
   */
  static xmlToJson(xmlData: string): GameData[] {
    logger.info("Konverzija: XML → JSON");

    const games: GameData[] = [];

    // Pronađi sve <game> tagove
    const gameRegex = /<game>([\s\S]*?)<\/game>/g;
    let match;

    while ((match = gameRegex.exec(xmlData)) !== null) {
      const gameXml = match[1];

      // Extraktuj podatke iz XML-a
      const idMatch = gameXml.match(/<id>(\d+)<\/id>/);
      const titleMatch = gameXml.match(/<title>(.*?)<\/title>/);
      const statusMatch = gameXml.match(/<status>(active|inactive)<\/status>/);
      const createdAtMatch = gameXml.match(/<createdAt>(.*?)<\/createdAt>/);

      if (idMatch && titleMatch && statusMatch && createdAtMatch) {
        games.push({
          id: parseInt(idMatch[1]),
          title: titleMatch[1],
          status: statusMatch[1] as "active" | "inactive",
          createdAt: createdAtMatch[1],
        });
      }
    }

    logger.info(`${games.length} igara konvertovano iz XML formata`);
    return games;
  }

  /**
   * Pretvara CSV u XML format
   * CSV → XML
   */
  static csvToXml(csvData: string): string {
    logger.info("Konverzija: CSV → XML");

    const games = this.csvToJson(csvData);
    return this.jsonToXml(games);
  }

  /**
   * Pretvara XML u CSV format
   * XML → CSV
   */
  static xmlToCsv(xmlData: string): string {
    logger.info("Konverzija: XML → CSV");

    const games = this.xmlToJson(xmlData);
    return this.jsonToCsv(games);
  }
}
