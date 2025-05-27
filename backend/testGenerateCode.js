const { generateCode } = require('./openaiService');

async function testGenerateCode() {
  try {
    const prompt = "function helloWorld() { return 'Hello, world!'; }";
    const result = await generateCode(prompt);
    console.log("Generated code:", result);
  } catch (error) {
    console.error("Error during code generation test:", error);
  }
}

testGenerateCode();
