/**
 * Example Goals
 * 
 * Pre-defined goals for quick testing and demonstration.
 * Each example includes test cases for Phase 2+ validation.
 */

export const EXAMPLE_GOALS = [
  {
    id: 'add-numbers',
    title: 'Add Two Numbers',
    goal: "Write a function called 'add' that takes two numbers and returns their sum",
    tests: [
      { input: [2, 3], expected: 5 },
      { input: [-1, 1], expected: 0 },
      { input: [0, 0], expected: 0 },
      { input: [100, 200], expected: 300 },
    ],
    difficulty: 'easy',
    category: 'math'
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    goal: "Write a function called 'reverse' that takes a string and returns it reversed",
    tests: [
      { input: ['hello'], expected: 'olleh' },
      { input: ['world'], expected: 'dlrow' },
      { input: ['a'], expected: 'a' },
      { input: [''], expected: '' },
    ],
    difficulty: 'easy',
    category: 'strings'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    goal: "Write a function called 'fibonacci' that returns the nth Fibonacci number (0-indexed, where fib(0)=0, fib(1)=1)",
    tests: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [5], expected: 5 },
      { input: [10], expected: 55 },
    ],
    difficulty: 'medium',
    category: 'math'
  },
  {
    id: 'is-palindrome',
    title: 'Palindrome Check',
    goal: "Write a function called 'isPalindrome' that returns true if a string is a palindrome, false otherwise (ignore case)",
    tests: [
      { input: ['racecar'], expected: true },
      { input: ['RaceCar'], expected: true },
      { input: ['hello'], expected: false },
      { input: ['a'], expected: true },
      { input: [''], expected: true },
    ],
    difficulty: 'easy',
    category: 'strings'
  },
  {
    id: 'factorial',
    title: 'Factorial',
    goal: "Write a function called 'factorial' that returns the factorial of a non-negative integer (0! = 1)",
    tests: [
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [5], expected: 120 },
      { input: [10], expected: 3628800 },
    ],
    difficulty: 'easy',
    category: 'math'
  },
  {
    id: 'find-max',
    title: 'Find Maximum',
    goal: "Write a function called 'findMax' that takes an array of numbers and returns the largest one",
    tests: [
      { input: [[1, 2, 3, 4, 5]], expected: 5 },
      { input: [[-1, -2, -3]], expected: -1 },
      { input: [[42]], expected: 42 },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: 9 },
    ],
    difficulty: 'easy',
    category: 'arrays'
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    goal: "Write a function called 'countVowels' that returns the number of vowels (a, e, i, o, u) in a string (case-insensitive)",
    tests: [
      { input: ['hello'], expected: 2 },
      { input: ['HELLO'], expected: 2 },
      { input: ['rhythm'], expected: 0 },
      { input: ['aeiou'], expected: 5 },
    ],
    difficulty: 'easy',
    category: 'strings'
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    goal: "Write a function called 'fizzBuzz' that takes a number n and returns an array from 1 to n where: multiples of 3 are 'Fizz', multiples of 5 are 'Buzz', multiples of both are 'FizzBuzz', otherwise the number itself",
    tests: [
      { input: [5], expected: [1, 2, 'Fizz', 4, 'Buzz'] },
      { input: [15], expected: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'] },
    ],
    difficulty: 'medium',
    category: 'logic'
  },
  {
    id: 'array-sum',
    title: 'Array Sum',
    goal: "Write a function called 'arraySum' that takes an array of numbers and returns their sum",
    tests: [
      { input: [[1, 2, 3, 4, 5]], expected: 15 },
      { input: [[-1, 1]], expected: 0 },
      { input: [[]], expected: 0 },
      { input: [[100]], expected: 100 },
    ],
    difficulty: 'easy',
    category: 'arrays'
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates',
    goal: "Write a function called 'removeDuplicates' that takes an array and returns a new array with duplicates removed (maintain order)",
    tests: [
      { input: [[1, 2, 2, 3, 4, 4, 5]], expected: [1, 2, 3, 4, 5] },
      { input: [['a', 'b', 'a', 'c']], expected: ['a', 'b', 'c'] },
      { input: [[1, 1, 1]], expected: [1] },
      { input: [[]], expected: [] },
    ],
    difficulty: 'medium',
    category: 'arrays'
  },
];

/**
 * Get examples by difficulty
 * @param {'easy' | 'medium' | 'hard'} difficulty 
 * @returns {Array}
 */
export function getExamplesByDifficulty(difficulty) {
  return EXAMPLE_GOALS.filter(ex => ex.difficulty === difficulty);
}

/**
 * Get examples by category
 * @param {string} category 
 * @returns {Array}
 */
export function getExamplesByCategory(category) {
  return EXAMPLE_GOALS.filter(ex => ex.category === category);
}

/**
 * Get a random example
 * @param {string} [difficulty] - Optional difficulty filter
 * @returns {Object}
 */
export function getRandomExample(difficulty) {
  const pool = difficulty 
    ? getExamplesByDifficulty(difficulty)
    : EXAMPLE_GOALS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get unique categories
 * @returns {string[]}
 */
export function getCategories() {
  return [...new Set(EXAMPLE_GOALS.map(ex => ex.category))];
}

export default EXAMPLE_GOALS;
