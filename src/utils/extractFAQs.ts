/**
 * Extract FAQ items from rendered MDX content
 * 
 * Pattern: H3 dengan tanda tanya di akhir = pertanyaan FAQ
 * Jawaban = semua paragraf setelah H3 sampai H3 berikutnya atau H2 berikutnya
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Extract FAQs from HTML string (rendered MDX)
 * @param html - Rendered HTML content from MDX
 * @returns Array of FAQ items
 */
export function extractFAQsFromHTML(html: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all H3 elements that end with "?"
  const h3Elements = Array.from(doc.querySelectorAll('h3'));
  
  for (const h3 of h3Elements) {
    const question = h3.textContent?.trim() || '';
    
    // Only process if ends with "?"
    if (!question.endsWith('?')) continue;
    
    // Collect all sibling elements until next heading
    const answerParts: string[] = [];
    let nextElement = h3.nextElementSibling;
    
    while (nextElement) {
      const tagName = nextElement.tagName.toLowerCase();
      
      // Stop at next heading
      if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
        break;
      }
      
      // Collect paragraph, list, or code block text
      if (tagName === 'p' || tagName === 'ul' || tagName === 'ol' || tagName === 'pre') {
        const text = nextElement.textContent?.trim() || '';
        if (text) {
          answerParts.push(text);
        }
      }
      
      nextElement = nextElement.nextElementSibling;
    }
    
    const answer = answerParts.join(' ').trim();
    
    if (answer) {
      faqs.push({ question, answer });
    }
  }
  
  return faqs;
}

/**
 * Extract FAQs from Astro Content component
 * NOTE: This function is meant to be used server-side during build
 * 
 * @param content - Astro Content component (result of render())
 * @returns Array of FAQ items
 */
export async function extractFAQsFromContent(content: any): Promise<FAQItem[]> {
  // In Astro, we can't easily parse the Content component without rendering
  // So we'll use a different approach: parse the raw MDX
  // This is a placeholder - actual implementation depends on how we access rendered HTML
  
  // For now, return empty array - will be implemented in [slug].astro directly
  return [];
}

/**
 * Extract FAQs from raw MDX string
 * Uses regex to find FAQ patterns in markdown
 * 
 * @param mdx - Raw MDX content string
 * @returns Array of FAQ items
 */
export function extractFAQsFromMDX(mdx: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Split by H3 headings (### )
  const sections = mdx.split(/\n### /);
  
  for (const section of sections) {
    const lines = section.split('\n');
    const firstLine = lines[0]?.trim() || '';
    
    // Skip if starts with ## (H2, not H3)
    if (firstLine.startsWith('#')) continue;
    
    // Only process if first line ends with "?"
    if (!firstLine.endsWith('?')) continue;
    
    const question = firstLine;
    
    // Collect answer until next heading or end
    const answerLines: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Stop at next heading
      if (line.startsWith('##')) break;
      
      // Skip empty lines at the start
      if (answerLines.length === 0 && !line) continue;
      
      answerLines.push(line);
    }
    
    // Clean up answer
    let answer = answerLines
      .join(' ')
      .trim()
      // Remove markdown formatting
      .replace(/\*\*/g, '') // bold
      .replace(/\*/g, '')   // italic
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
      .replace(/\n+/g, ' ') // newlines
      .replace(/\s+/g, ' '); // multiple spaces
    
    if (answer) {
      faqs.push({ question, answer });
    }
  }
  
  return faqs;
}