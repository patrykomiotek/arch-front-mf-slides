/**
 * Strażnik separatorów slajdów.
 *
 * reveal.js dzieli plik Markdown na slajdy **zanim** go sparsuje - surowym
 * wyrażeniem `^\r?\n---\r?\n$`. Linia zawierająca dokładnie `---` rozbija
 * slajd nawet wtedy, gdy stoi w środku bloku kodu, np. w przykładzie
 * front mattera. Efekt: dwa slajdy zamiast jednego i rozcięty listing,
 * bez żadnego ostrzeżenia przy budowaniu.
 *
 * Obejście jest niewidoczne dla czytelnika: `--- ` ze spacją na końcu.
 * Ten skrypt pilnuje, żeby nikt nie cofnął tego przy formatowaniu pliku.
 *
 * Sprawdza też drugi cichy błąd: brak pustej linii po separatorze slajdów,
 * który skleja dwa slajdy w jeden.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(import.meta.dirname, '..', 'public', 'slides');
const problems = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const lines = readFileSync(join(DIR, file), 'utf8').split('\n');
  let inFence = false;

  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence && line === '---') {
      problems.push(`${file}:${i + 1} - "---" w bloku kodu rozbije slajd (użyj "--- " ze spacją)`);
    }
    if (!inFence && line === '---') {
      if (lines[i - 1] !== '') {
        problems.push(`${file}:${i + 1} - brak pustej linii PRZED separatorem`);
      }
      if (lines[i + 1] !== '') {
        problems.push(`${file}:${i + 1} - brak pustej linii PO separatorze (slajdy się skleją)`);
      }
    }
  });

  if (inFence) {
    problems.push(`${file} - niedomknięty blok kodu`);
  }
}

if (problems.length > 0) {
  console.error('✗ Problemy ze slajdami:\n' + problems.map((p) => '  ' + p).join('\n'));
  process.exit(1);
}
console.log('✓ Slajdy: separatory i bloki kodu w porządku');
