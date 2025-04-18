
// Utility functions for DumDummies application

// Get random item from an array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate a random username with format like "FearFerret9"
export function generateRandomUsername(): string {
  const adjectives = [
    'Fear', 'Captain', 'The', 'Digital', 'Cyber', 'Glitch', 
    'Dark', 'Neon', 'Void', 'Toxic', 'Acid', 'Sharp'
  ];
  
  const nouns = [
    'Ferret', 'Puke', 'Ventricle', 'Demon', 'Ghost', 'Monkey',
    'Knight', 'Hunter', 'Walker', 'Rider', 'Hacker', 'Punk'
  ];
  
  const number = Math.floor(Math.random() * 100);
  
  return `${getRandomItem(adjectives)}-${getRandomItem(nouns)}${number}`;
}

// Format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
