import * as fs from "node:fs";
import { execSync } from "node:child_process";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateNotes() {
  try {
    const currentTag = execSync("git describe --tags --abbrev=0").toString().trim();

    let previousTag;
    try {
      previousTag = execSync(`git describe --tags --abbrev=0 ${currentTag}^`).toString().trim();
    } catch (e) {
      console.log("No previous tag found. Assuming first release.");
      previousTag = null;
    }

    const logCommand = previousTag
      ? `git log ${previousTag}..${currentTag} --pretty=format:"- %s (%h)"`
      : `git log --pretty=format:"- %s (%h)"`;

    const commitLogs = execSync(logCommand).toString();

    if (!commitLogs) {
      console.log("No new commits found.");
      fs.writeFileSync("RELEASE_NOTES.md", "No major changes in this release.");
      return;
    }

    const prompt = `
      You are a release manager for a software project. 
      Generate clean, professional GitHub release notes (in Markdown) based on the following commit messages.
      
      Rules:
      - Group changes by type (Features, Bug Fixes, Chores).
      - Ignore trivial commits like "bump version" or "update readme" unless significant.
      - Keep it concise.
      - Use bullet points.
      
      Commits:
      ${commitLogs}
    `;

    console.log("Generating release notes with Gemini...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const releaseNotes = response.text;

    fs.writeFileSync("RELEASE_NOTES.md", releaseNotes);
    console.log("RELEASE_NOTES.md generated successfully.");

  } catch (error) {
    console.error("Error generating release notes:", error);
    process.exit(1);
  }
}

generateNotes();