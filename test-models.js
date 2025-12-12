// Script pour tester les modèles Gemini disponibles
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDPD1n7k824uF4-DBBHt-Gtne-d9YiWSWQ';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
  'models/gemini-pro',
  'models/gemini-pro-vision',
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent('test');
    console.log(`✅ ${modelName} - DISPONIBLE`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName} - ${error.message.substring(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Test des modèles Gemini...\n');
  
  for (const modelName of modelsToTest) {
    await testModel(modelName);
  }
  
  console.log('\n✅ Test terminé !');
}

main();
