const fs = require('fs');
const path = require('path');

// Convert numbered pinyin to tone marks
function convertPinyinTones(pinyin) {
  const toneMarks = {
    'a': ['ā', 'á', 'ǎ', 'à', 'a'],
    'e': ['ē', 'é', 'ě', 'è', 'e'],
    'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
    'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
    'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
    'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
  };

  const syllables = pinyin.split(' ');
  return syllables.map(syllable => {
    const toneMatch = syllable.match(/(\d)$/);
    if (!toneMatch) return syllable.toLowerCase();

    const tone = parseInt(toneMatch[1]) - 1;
    if (tone < 0 || tone > 4) return syllable.toLowerCase();

    let base = syllable.slice(0, -1).toLowerCase();

    // Replace 'v' with 'ü'
    base = base.replace(/v/g, 'ü');

    // Find the vowel to add tone mark
    // Priority: a, e, ou -> o, otherwise last vowel
    if (base.includes('a')) {
      base = base.replace('a', toneMarks['a'][tone] || 'a');
    } else if (base.includes('e')) {
      base = base.replace('e', toneMarks['e'][tone] || 'e');
    } else if (base.includes('ou')) {
      base = base.replace('o', toneMarks['o'][tone] || 'o');
    } else {
      // Last vowel
      for (let i = base.length - 1; i >= 0; i--) {
        const char = base[i];
        if (toneMarks[char]) {
          base = base.slice(0, i) + (toneMarks[char][tone] || char) + base.slice(i + 1);
          break;
        }
      }
    }

    return base;
  }).join(' ');
}

// Parse CC-CEDICT format
function parseCedict(content) {
  const lines = content.split('\n');
  const dictionary = {};
  let parsed = 0;
  let skipped = 0;

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) {
      continue;
    }

    // Format: 繁體 简体 [pin1 yin1] /definition1/definition2/
    // Note: traditional and simplified are separated by space
    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/\s*$/);
    if (match) {
      const [, traditional, simplified, pinyin, definitions] = match;

      // Skip entries that are just numbers or letters
      if (/^[\d\s]+$/.test(simplified) || /^[A-Za-z\s]+$/.test(simplified)) {
        skipped++;
        continue;
      }

      // Convert pinyin from numbered tones to tone marks
      const pinyinWithTones = convertPinyinTones(pinyin);

      // Split definitions and clean them up
      const defList = definitions
        .split('/')
        .filter(d => d.trim())
        .map(d => d.trim());

      // Store by simplified Chinese (primary key)
      // Only keep first entry for each word (most common definition)
      if (!dictionary[simplified]) {
        dictionary[simplified] = {
          t: traditional,      // traditional
          p: pinyinWithTones,  // pinyin
          e: defList.slice(0, 3) // english (max 3 definitions)
        };
        parsed++;
      }
    }
  }

  console.log(`Parsed: ${parsed}, Skipped: ${skipped}`);
  return dictionary;
}

// Main
const cedictPath = path.join(__dirname, '..', 'data', 'cedict.txt');
const outputPath = path.join(__dirname, '..', 'data', 'cedict.json');

console.log('Reading CC-CEDICT file...');
const content = fs.readFileSync(cedictPath, 'utf-8');

console.log('Parsing dictionary...');
const dictionary = parseCedict(content);

const entries = Object.keys(dictionary).length;
console.log(`Total entries: ${entries}`);

console.log('Writing JSON file...');
fs.writeFileSync(outputPath, JSON.stringify(dictionary));

// Get file size
const stats = fs.statSync(outputPath);
console.log(`Output size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log('Done!');
