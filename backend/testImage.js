import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = "AQ.Ab8RN6JeNmalS4peKtODhHjya6s9AOoIlUb-vLrr5bQIbv2w-A";
const genAI = new GoogleGenerativeAI(API_KEY);
const prompt = "A hyper-realistic studio photograph of a beautiful bouquet featuring a red rose.";

async function testModels() {
  console.log("--- Testing gemini-2.5-flash-image ---");
  try {
    const imgModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    const imgResult = await imgModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    console.log("OK 2.5-flash-image", !!imgResult.response);
  } catch (e) {
    console.error("FAIL 2.5-flash-image:", e.message);
  }

  console.log("--- Testing gemini-3.1-flash-image-preview ---");
  try {
    const imgModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
    const imgResult = await imgModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    console.log("OK 3.1-flash-image-preview", !!imgResult.response);
  } catch (e) {
    console.error("FAIL 3.1-flash-image-preview:", e.message);
  }

  console.log("--- Testing imagen-4.0-generate-001 ---");
  try {
    const imagenResp = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
      { instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: "1:1" } },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("OK Imagen 4", !!imagenResp.data);
  } catch (e) {
    console.error("FAIL Imagen 4:", e.response?.data?.error?.message || e.message);
  }
}

testModels();
