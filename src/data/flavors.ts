export type ParticleMotif =
  | 'frosty-lemon'
  | 'frosty-mango'
  | 'lychee-ice'
  | 'double-apple'
  | 'eskandarani-apple'
  | 'mint-leaf'
  | 'red-kiss';

export interface FlavorItem {
  id: string;
  image: string;
  altLabel: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  primaryColor: string;
  secondaryColor: string;
  ambientGlow: string;
  skyTint: string;
  waterReflection: string;
  motif: ParticleMotif;
  hasIce: boolean;
  iceIntensity: number;
  iceTint: string;
  skylinePanX: number;
  skylinePanY: number;
  skylineScale: number;
}

// Strictly alternating sequence: Regular -> Ice -> Regular -> Ice -> Regular -> Ice -> Regular
export const FLAVORS: FlavorItem[] = [
  {
    id: 'super-double-apple',
    image: '/assets/aistudio/Ya_Layl_Double_Apple_Molasses_Tub_3c370de3.png',
    altLabel: 'Super Double Apple - سوبر تفاحتين',
    nameEn: 'SUPER DOUBLE APPLE',
    nameAr: 'سوبر تفاحتين',
    descriptionEn: 'The timeless signature blend of crisp green and sweet crimson apples.',
    descriptionAr: 'الخلطة الأصيلة والغنية التي تجمع بين حلاوة التفاح الأحمر ونضارة التفاح الأخضر.',
    primaryColor: '#ef4444',
    secondaryColor: '#4ade80',
    ambientGlow: '#991b1b',
    skyTint: '#2a060a',
    waterReflection: '#f87171',
    motif: 'double-apple',
    hasIce: false,
    iceIntensity: 0,
    iceTint: '#e0f2fe',
    skylinePanX: 0,
    skylinePanY: 0,
    skylineScale: 1.06,
  },
  {
    id: 'frosty-lemon',
    image: '/assets/aistudio/YA_LAYL_Frosty_Lemon_Molasses_Tub_b8344b53.png',
    altLabel: 'Frosty Lemon - فروستي ليمون',
    nameEn: 'FROSTY LEMON',
    nameAr: 'فروستي ليمون',
    descriptionEn: 'Zesty sun-ripened yellow lemon slices locked in sub-zero glacial ice crystals.',
    descriptionAr: 'انتعاش شرائح الليمون الأصفر الطازج ممزوجة ببلورات الثلج الصافية لبرودة مضاعفة.',
    primaryColor: '#facc15',
    secondaryColor: '#38bdf8',
    ambientGlow: '#0284c7',
    skyTint: '#061a2e',
    waterReflection: '#fde047',
    motif: 'frosty-lemon',
    hasIce: true,
    iceIntensity: 1.0,
    iceTint: '#e0f2fe',
    skylinePanX: -18,
    skylinePanY: -10,
    skylineScale: 1.09,
  },
  {
    id: 'eskandarani-apple',
    image: '/assets/aistudio/Ya_Layl_Eskandarani_Apple_Molasses_Tub_6d0b8c58.png',
    altLabel: 'Eskandarani Apple - تفاح اسكندراني',
    nameEn: 'ESKANDARANI',
    nameAr: 'تفاح اسكندراني',
    descriptionEn: 'Freshly harvested green Eskandarani apples bursting with crisp orchard aroma.',
    descriptionAr: 'نكهة التفاح الإسكندراني الأخضر الطازج بعبيره القوي ومذاقه المنعش الأصيل.',
    primaryColor: '#84cc16',
    secondaryColor: '#bef264',
    ambientGlow: '#3f6212',
    skyTint: '#0c2406',
    waterReflection: '#a3e635',
    motif: 'eskandarani-apple',
    hasIce: false,
    iceIntensity: 0,
    iceTint: '#e0f2fe',
    skylinePanX: -34,
    skylinePanY: -20,
    skylineScale: 1.11,
  },
  {
    id: 'frosty-mango-passion',
    image: '/assets/aistudio/Frosty_Mango_Passion_Molasses_Tub_cb422315.png',
    altLabel: 'Frosty Mango Passion - مانجا باشن مثلج',
    nameEn: 'FROSTY MANGO PASSION',
    nameAr: 'مانجا باشن مثلج',
    descriptionEn: 'Lush tropical mango and exotic passionfruit chilled with an arctic frost blast.',
    descriptionAr: 'مزيج استوائي فاخر من المانجا الحلوة وفاكهة الباشن فروت مع عاصفة ثلجية منعشة.',
    primaryColor: '#f59e0b',
    secondaryColor: '#f43f5e',
    ambientGlow: '#0284c7',
    skyTint: '#240d1e',
    waterReflection: '#fbbf24',
    motif: 'frosty-mango',
    hasIce: true,
    iceIntensity: 0.98,
    iceTint: '#e0f2fe',
    skylinePanX: 14,
    skylinePanY: -26,
    skylineScale: 1.08,
  },
  {
    id: 'green-mint',
    image: '/assets/aistudio/Ya_Layl_Green_Mint_Molasses_Tub_343e7928.png',
    altLabel: 'Green Mint - نعناع اخضر',
    nameEn: 'GREEN MINT',
    nameAr: 'نعناع أخضر',
    descriptionEn: 'Pure emerald garden spearmint leaves delivering a clean, invigorating breeze.',
    descriptionAr: 'أوراق النعناع الأخضر الطبيعي الطازج لنفس نقي ومنعش يدوم مع كل سحبة.',
    primaryColor: '#10b981',
    secondaryColor: '#6ee7b7',
    ambientGlow: '#065f46',
    skyTint: '#032217',
    waterReflection: '#34d399',
    motif: 'mint-leaf',
    hasIce: false,
    iceIntensity: 0,
    iceTint: '#e0f2fe',
    skylinePanX: 30,
    skylinePanY: -16,
    skylineScale: 1.12,
  },
  {
    id: 'lychee-ice',
    image: '/assets/aistudio/Ya_Layl_Lychee_Ice_Tub_Packaging_17cc3e30.png',
    altLabel: 'Lychee Ice - ليتشي مثلج',
    nameEn: 'LYCHEE ICE',
    nameAr: 'ليتشي مثلج',
    descriptionEn: 'Sweet aromatic Asian lychee fruit encased in crystal-clear crushed ice.',
    descriptionAr: 'حلاوة فاكهة الليتشي الآسيوية العطرية مغمورة داخل مكعبات الثلج الكريستالية الباردة.',
    primaryColor: '#fb7185',
    secondaryColor: '#7dd3fc',
    ambientGlow: '#be185d',
    skyTint: '#1f0926',
    waterReflection: '#fda4af',
    motif: 'lychee-ice',
    hasIce: true,
    iceIntensity: 0.96,
    iceTint: '#e0f2fe',
    skylinePanX: 8,
    skylinePanY: -34,
    skylineScale: 1.14,
  },
  {
    id: 'red-kiss',
    image: '/assets/aistudio/Ya_Layl_Red_Kiss_Package_96484a93.png',
    altLabel: 'Red Kiss - ريد كيس',
    nameEn: 'RED KISS',
    nameAr: 'ريد كيس',
    descriptionEn: 'An irresistible velvet fusion of wild crimson berries and sweet scarlet nectar.',
    descriptionAr: 'توليفة مخملية ساحرة من الفواكه الحمراء الحلوة بنكهة جريئة لا تُقاوم.',
    primaryColor: '#e11d48',
    secondaryColor: '#fb7185',
    ambientGlow: '#881337',
    skyTint: '#2a0410',
    waterReflection: '#f43f5e',
    motif: 'red-kiss',
    hasIce: false,
    iceIntensity: 0,
    iceTint: '#ffe4e6',
    skylinePanX: -12,
    skylinePanY: -18,
    skylineScale: 1.07,
  },
];
