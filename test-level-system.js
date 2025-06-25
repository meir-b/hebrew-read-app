// Test script to demonstrate the level system with random vs ordered nikud
// This is a simple Node.js script to test the level system logic

// Simulate the level configuration
const levels = [
    {
        id: 'level-1-qamats-patah',
        name: 'אותיות א-ב עם קמץ ופתח',
        description: 'שתי תנועות פתוחות עם קמץ ופתח בסדר מוגדר',
        letters: ['א', 'ב'],
        nikudTypes: ['Qamats', 'Patah'],
        orderedNikudTypes: [['Qamats'], ['Patah']], // First char must be Qamats, second must be Patah
        syllableTypes: 'double',
        isRandomOrder: false
    },
    {
        id: 'level-2-qamats-patah-random',
        name: 'קמץ ופתח - חופשי',
        description: 'שני ניקודים פתוחים עם קמץ ופתח בסדר אקראי',
        letters: ['א', 'ב', 'ג'],
        nikudTypes: ['Qamats', 'Patah'],
        syllableTypes: 'double',
        isRandomOrder: true
    },
    {
        id: 'level-3-ordered-pattern-2',
        name: 'דפוס מוגדר - צירה ואחר כן סגול או חיריק',
        description: 'תרגול דפוס: תמיד צירה ראשון, במקום השני סגול או חיריק',
        letters: ['א', 'ב', 'ג'],
        nikudTypes: ['Tsere', 'Segol', 'Hiriq'],
        orderedNikudTypes: [['Tsere'], ['Segol', 'Hiriq']], // Position 1: always Tsere, Position 2: Segol or Hiriq
        syllableTypes: 'double',
        isRandomOrder: false
    }
];

// Simulate syllable generation logic
function demonstrateLevelSystem() {
    console.log('🎯 Hebrew Reading Game - Level System Demonstration\n');
    
    levels.forEach(level => {
        console.log(`📖 Level: ${level.name}`);
        console.log(`   Description: ${level.description}`);
        console.log(`   Letters: ${level.letters.join(', ')}`);
        console.log(`   Nikud Types: ${level.nikudTypes.join(', ')}`);
        console.log(`   Random Order: ${level.isRandomOrder ? 'Yes' : 'No'}`);
        
        if (!level.isRandomOrder && level.orderedNikudTypes) {
            console.log('   📋 Ordered Pattern:');
            level.orderedNikudTypes.forEach((position, index) => {
                console.log(`      Position ${index + 1}: ${position.join(' or ')}`);
            });
        }
        
        console.log('   🎲 Example generations:');
        for (let i = 0; i < 3; i++) {
            const example = generateExampleSyllable(level);
            console.log(`      ${i + 1}. ${example}`);
        }
        console.log('');
    });
}

function generateExampleSyllable(level) {
    // Simplified example generation
    const letter1 = level.letters[Math.floor(Math.random() * level.letters.length)];
    const letter2 = level.letters[Math.floor(Math.random() * level.letters.length)];
    
    let nikud1, nikud2;
    
    if (level.isRandomOrder) {
        // Random selection from allowed nikud types
        nikud1 = level.nikudTypes[Math.floor(Math.random() * level.nikudTypes.length)];
        nikud2 = level.nikudTypes[Math.floor(Math.random() * level.nikudTypes.length)];
    } else {
        // Ordered selection based on position
        if (level.orderedNikudTypes && level.orderedNikudTypes.length >= 2) {
            const position1Options = level.orderedNikudTypes[0];
            const position2Options = level.orderedNikudTypes[1];
            
            nikud1 = position1Options[Math.floor(Math.random() * position1Options.length)];
            nikud2 = position2Options[Math.floor(Math.random() * position2Options.length)];
        } else {
            nikud1 = level.nikudTypes[0];
            nikud2 = level.nikudTypes[1] || level.nikudTypes[0];
        }
    }
    
    return `${letter1}(${nikud1}) + ${letter2}(${nikud2})`;
}

// Run the demonstration
demonstrateLevelSystem();

console.log('✨ Key Features:');
console.log('1. 🎲 Random Order Levels: Nikud is chosen randomly from the allowed types');
console.log('2. 📋 Ordered Levels: Each position has specific nikud requirements');
console.log('3. 🚫 Sheva Protection: Sheva cannot be the first nikud in multi-character syllables');
console.log('4. 🎯 Flexible Patterns: Each position can have multiple allowed nikud types');
console.log('5. 📚 Mixed Levels: Can combine both approaches in a single level');
