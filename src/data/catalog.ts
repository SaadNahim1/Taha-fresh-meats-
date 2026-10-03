import { Category, Product } from '../types';

export const RAW_CATALOG_DATA: [string, [string, number, string][]][] = [
  [
    "Carne de vaca - cortes (preço por kg)",
    [
      ["Bolas de rodízio", 1100, "por kg"],
      ["Alcatra (bife)", 1000, "por kg"],
      ["Alcatra em tiras", 1000, "por kg"],
      ["Prego de alcatra", 1000, "por kg"],
      ["Bôti de alcatra em cubos", 1000, "por kg"],
      ["Bôti com osso (1ª qualidade)", 850, "por kg"],
      ["Picanha Karan (peça inteira)", 1600, "por kg"],
      ["Picanha Karan cortada", 1600, "por kg"],
      ["T-Bone com filete", 1100, "por kg"],
      ["Ribs (não temperado)", 900, "por kg"],
      ["Filete (peça inteira)", 1800, "por kg"],
      ["Filete cortado (medalhão)", 1800, "por kg"],
      ["Chops", 1300, "por kg"],
      ["Top side", 850, "por kg"],
      ["Ribeye steak", 1600, "por kg"],
      ["Maminha", 900, "por kg"],
      ["Ganso quadrado", 850, "por kg"],
      ["Ganso redondo", 1000, "por kg"],
      ["Lombo striploin steak", 1000, "por kg"],
      ["Tomahawk", 1150, "por kg"],
      ["Chuck (não temperado)", 850, "por kg"],
      ["Boneless T-Bone", 1100, "por kg"],
      ["Brisket", 950, "por kg"],
      ["Minute steak", 1100, "por kg"],
      ["Beef rushers (plain)", 1000, "por kg"]
    ]
  ],
  [
    "Carnes temperadas (preço por kg)",
    [
      ["Picanha temperada Karan Beef", 1800, "por kg"],
      ["Filete medalhões temperados", 2000, "por kg"],
      ["Espetos de filete temperados", 2000, "por kg"],
      ["Alcatra bife temperado", 1200, "por kg"],
      ["Espetos de alcatra temperados", 1200, "por kg"],
      ["Espetos de bife de frango temperados", 650, "por kg"],
      ["Bife de frango temperado", 600, "por kg"],
      ["Ribeye temperado", 1500, "por kg"],
      ["Boneless T-Bone temperado", 1200, "por kg"],
      ["Beef rushers temperado", 1100, "por kg"],
      ["Tomahawk temperado", 1250, "por kg"],
      ["Chops temperado", 1400, "por kg"],
      ["Chuck temperado", 900, "por kg"],
      ["Ribs temperado", 1000, "por kg"],
      ["T-Bone temperado", 1200, "por kg"],
      ["Brisket temperado", 1050, "por kg"],
      ["Frango temperado", 500, "por kg"],
      ["Minute steak temperado", 1150, "por kg"]
    ]
  ],
  [
    "Camarão e caranguejo",
    [
      ["Camarão pequeno (descascado)", 450, "por kg"],
      ["Camarão médio (descascado)", 850, "por kg"],
      ["Camarão K (com casca)", 3000, "2 kg"],
      ["Camarão Q (com casca)", 2500, "2 kg"],
      ["Camarão TM (com casca)", 3500, "2 kg"],
      ["Camarão S (com casca)", 1800, "2 kg"],
      ["Camarão tigre gigante", 3800, "2 kg"],
      ["Caranguejo", 1000, "1 kg"],
      ["Cascas de caranguejo", 200, "12 un"],
      ["Casquinhas recheadas com queijo", 1200, "12 un"],
      ["Casquinhas recheadas simples", 1000, "12 un"],
      ["Caranguejo mix (6 c/ queijo + 6 panado)", 1100, "12 un"]
    ]
  ],
  [
    "Fiambres",
    [
      ["Fiambres United (azeitona, chilli, paprica, cheese, chicken pressed, chicken spice, pressed beef, french paloni, atchar, chicken smoked)", 250, "un"],
      ["Fiambres Khan (mutton atchar/chilli, beef atchar/chilli, pressed beef, pressed chicken, chicken loaf, beef french, azeitona, chicken french)", 200, "un"]
    ]
  ],
  [
    "Vienas",
    [
      ["United: plain curta / plain comprida / cocktail / mutton / chicken", 350, "un"],
      ["United: cheese russian / lamb chorizo / beef chorizo", 450, "un"],
      ["Viena 1 kg cheese rainbow", 600, "1 kg"],
      ["Viena 1 kg chicken rainbow", 600, "1 kg"],
      ["Khan: kesser grill", 425, "un"],
      ["Khan: breakfast / cocktail / chicken", 400, "un"]
    ]
  ],
  [
    "Salchichas",
    [
      ["United: beef, bombay, salt & pepper, chicken, sweet chilli lamb, mutton, dania", 850, "por kg"],
      ["Khan (pequenas): sweet chilli, lamb, beef masala, S.P., extra hot", 950, "por kg"],
      ["Sausage jalapeño cheese", 950, "por kg"]
    ]
  ],
  [
    "Lollies, kebabs e worse",
    [
      ["Lollies de galinha / beef / mutton / não picante", 500, "un"],
      ["Kebab original mutton / beef / turkish", 450, "un"],
      ["Worse: beef masala / lamb / SP", 600, "un"]
    ]
  ],
  [
    "Carnes frias",
    [
      ["Bacon / beef breakfast / pastrami / smoked beef (250 g)", 350, "250 g"],
      ["Beef bacon", 550, "500 g"]
    ]
  ],
  [
    "Frango e carne moída",
    [
      ["Bife de frango sul-africano", 300, "por kg"],
      ["Bife de frango nacional", 350, "por kg"],
      ["Frangos (800 g - 900 g)", 300, "un"],
      ["Coxas de frango (drumstick)", 400, "por kg"],
      ["Pernas de frango", 400, "por kg"],
      ["Wings", 400, "por kg"],
      ["Carne moída sul-africana", 800, "por kg"],
      ["Frango moído", 450, "por kg"],
      ["Chicken pops / nuggets / strips / bites / snitchzel / burguer panado (12 un)", 450, "por kg"],
      ["Chicken pops hot / strip hot", 450, "por kg"],
      ["Chicken strip cheese", 500, "por kg"],
      ["Buffalo wings hot", 600, "1 kg"],
      ["Buffalo wings", 600, "1,5 kg"],
      ["Drumstick", 600, "1,5 kg"],
      ["Wings hot molhado Khans / pernas temperadas hot / wings mild temperado", 600, "por kg"]
    ]
  ],
  [
    "Hambúrgueres (pack de 6)",
    [
      ["Lamb / chicken / beef / salt & pepper / cheese", 500, "6 un"],
      ["Wagyu", 1250, "6 un"],
      ["Pepperoni", 950, "un"]
    ]
  ],
  [
    "Palonis",
    [
      ["Paloni Khans (hot one, garlic, beef original, pizzalony, mutton garlic, green masala)", 325, "por kg"],
      ["Paloni United compridos (garlic, mutton, beef, chicken)", 280, "por kg"],
      ["Paloni United curtos (chilli salami, hot spice salami, jalapeño)", 320, "por kg"],
      ["Paloni Rainbow (chicken, chilli chicken, chakakala)", 420, "1 kg"]
    ]
  ],
  [
    "Massas e pão",
    [
      ["Spring roll feito", 250, "un"],
      ["Massa folhada 1 kg (Fatimas)", 250, "1 kg"],
      ["Massa folhada retangular / oval", 800, "un"],
      ["Nan mini garlic", 250, "un"],
      ["Nan original", 300, "un"],
      ["Nan garlic", 300, "un"],
      ["Pur de samossa Switz", 200, "un"],
      ["Paratha Switz", 200, "un"]
    ]
  ],
  [
    "Queijos e frutos secos",
    [
      ["Queijo mozzarella 2,4 kg", 1650, "un"],
      ["Queijo gouda 900 g", 750, "un"],
      ["Gouda 2,5 kg", 1700, "un"],
      ["White gouda 900 g", 750, "un"],
      ["Cheddar amarelo", 750, "un"],
      ["Cheddar branco", 750, "un"],
      ["Amêndoa (badam)", 900, "por kg"],
      ["Pistácio", 1800, "por kg"],
      ["Nozes", 1300, "por kg"]
    ]
  ],
  [
    "Peixe e bacalhau",
    [
      ["Bacalhau lombo 800 g", 3200, "un"],
      ["Bacalhau desfiado 400 g", 500, "un"],
      ["Pastéis de bacalhau", 500, "un"],
      ["Filete de peixe papagaio", 1200, "por kg"],
      ["Filete de garoupa", 1300, "por kg"],
      ["Filete vermelho", 1300, "por kg"]
    ]
  ],
  [
    "Outros produtos",
    [
      ["Cabrito para caril", 600, "por kg"],
      ["Pernas de cabrito", 600, "por kg"],
      ["Paya de vaca", 300, "un"],
      ["Paya de lamb", 400, "un"],
      ["Batata congelada fina 2,5 kg", 500, "un"],
      ["Batata congelada média 2,5 kg", 500, "un"],
      ["Arroz Lalquila integral 5 kg", 1000, "un"],
      ["Farinha de grão (besan)", 200, "un"],
      ["Ghee Dadimas 1,5 kg", 1300, "un"],
      ["Piri-piri caseiro picante", 300, "un"],
      ["Paprika Malawi", 500, "un"],
      ["Piri-piri meio pilado", 650, "un"],
      ["Dokri - 1 receita (30 pedaços)", 1000, "un"],
      ["Dokri - 1/2 receita (15 pedaços)", 500, "un"],
      ["Sacos de lixo", 120, "un"]
    ]
  ]
];

// Helper to slugify category names
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const CATEGORY_ICONS: Record<number, string> = {
  0: 'Flame', // Carne de vaca cortes
  1: 'Sparkles', // Carnes temperadas
  2: 'Fish', // Camarão e caranguejo
  3: 'Sandwich', // Fiambres
  4: 'Utensils', // Vienas
  5: 'UtensilsCrossed', // Salchichas
  6: 'Beef', // Lollies, kebabs e worse
  7: 'PackageCheck', // Carnes frias
  8: 'Egg', // Frango e carne moída
  9: 'Disc', // Hambúrgueres
  10: 'Layers', // Palonis
  11: 'Wheat', // Massas e pão
  12: 'Cookie', // Queijos e frutos secos
  13: 'FishSymbol', // Peixe e bacalhau
  14: 'Grid' // Outros produtos
};

export const CATEGORIES: Category[] = RAW_CATALOG_DATA.map((entry, index) => {
  const fullTitle = entry[0];
  const shortTitle = fullTitle.split(' (')[0];
  return {
    id: String(index),
    name: fullTitle,
    shortName: shortTitle,
    iconName: CATEGORY_ICONS[index] || 'Tag'
  };
});

export const ALL_PRODUCTS: Product[] = RAW_CATALOG_DATA.flatMap((catData, catIndex) => {
  const categoryTitle = catData[0];
  const items = catData[1];
  return items.map((item, itemIndex) => {
    const [name, price, unit] = item;
    const isPerKg = unit === 'por kg';
    const isSpecialCuts = name.includes('Picanha') || name.includes('Filete') || name.includes('Wagyu') || name.includes('Tomahawk');

    return {
      id: `${catIndex}-${itemIndex}`,
      name,
      price,
      unit,
      category: categoryTitle,
      categoryId: String(catIndex),
      isPerKg,
      step: isPerKg ? 0.5 : 1,
      popular: isSpecialCuts || name.includes('Camarão') || name.includes('Alcatra'),
      badge: isSpecialCuts ? 'Destaque' : undefined
    };
  });
});

export function formatPriceMT(amount: number): string {
  const rounded = Math.round(amount);
  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " MT";
}
