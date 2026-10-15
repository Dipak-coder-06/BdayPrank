export interface Roast {
  id: string;
  text: string;
}

export interface Compliment {
  id: string;
  text: string;
}

export interface Charge {
  crime: string;
  severity: string;
  evidence: string;
}

export interface NPCDialogue {
  id: string;
  text: string;
}

export interface MemoryPhoto {
  src: string;
  caption: string;
  alt: string;
}

export interface BossStats {
  name: string;
  title: string;
  difficulty: string;
  specialAttack: string;
  weakness: string;
  hp: number;
}