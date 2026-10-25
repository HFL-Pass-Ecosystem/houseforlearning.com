/* Food exchange data for the diary's diet planner.
   One "exchange" is a standard portion; every item in a group gives about the same
   energy, so any item can replace any other in the same group.
   Our own wording, built from common exchange-list practice. Values are approximate.
   Flags: beef pork lamb poultry fish shell egg dairy gluten nut soy root */
(function (g) {
  var GROUPS = {
    starch: { label: 'Grains and starches', kcal: 72, note: 'about 15 g carbohydrate, 3 g protein' },
    protein: { label: 'Protein foods', kcal: 55, note: 'about 7 g protein, 0 to 3 g fat' },
    dairy: { label: 'Milk and alternatives', kcal: 85, note: 'about 12 g carbohydrate, 8 g protein' },
    fruit: { label: 'Fruit', kcal: 60, note: 'about 15 g carbohydrate' },
    veg: { label: 'Vegetables', kcal: 25, note: 'about 5 g carbohydrate, 2 g protein' },
    fat: { label: 'Healthy fats', kcal: 45, note: 'about 5 g fat' }
  };
  function f(id, group, name, qty, flags) { return { id: id, group: group, name: name, qty: qty, flags: flags ? flags.split(' ') : [] }; }
  var FOODS = [
    f('s1','starch','Toast or sliced bread (30 g)','1 slice','gluten'),
    f('s2','starch','Flatbread, medium (30 g)','1/4 loaf','gluten'),
    f('s3','starch','Baguette (30 g)','1/2 baguette','gluten'),
    f('s4','starch','Plain crackers','2','gluten'),
    f('s5','starch','Bagel (30 g)','1/4 bagel','gluten'),
    f('s6','starch','Rice, white or brown, cooked','4 tbsp (65 g)'),
    f('s7','starch','Quinoa, cooked','1/3 cup (65 g)'),
    f('s8','starch','Oats, dry','1/2 cup (20 g)','gluten'),
    f('s9','starch','Bulgur or couscous, cooked','1/3 cup','gluten'),
    f('s10','starch','Pasta or macaroni, cooked','1/3 cup (50 g)','gluten'),
    f('s11','starch','Breakfast cereal, unsweetened','1/2 cup (25 g)','gluten'),
    f('s12','starch','Popcorn, plain','3 cups'),
    f('s13','starch','Potato','1/2 medium (85 g)','root'),
    f('s14','starch','Sweetcorn','1/2 cup'),
    f('s15','starch','Lentils, cooked','1/2 cup (75 g)'),
    f('s16','starch','Chickpeas, cooked','1/2 cup (50 g)'),
    f('s17','starch','Beans, cooked','1/2 cup (80 g)'),
    f('s18','starch','Green peas, cooked','1/3 cup (100 g)'),
    f('p1','protein','Chicken or turkey breast, skinless, cooked','30 g','poultry'),
    f('p2','protein','Lean beef or veal, cooked','30 g','beef'),
    f('p3','protein','Lean lamb, cooked','30 g','lamb'),
    f('p4','protein','White fish, cooked','30 g','fish'),
    f('p5','protein','Tuna or sardines, canned in water','1/4 cup','fish'),
    f('p6','protein','Prawns or shrimp, cooked','30 g','shell'),
    f('p7','protein','Egg whites','2','egg'),
    f('p8','protein','Whole egg (twice a week at most)','1','egg'),
    f('p9','protein','Low-fat cheese','2 slices (30 g)','dairy'),
    f('p10','protein','Low-fat labneh or strained yoghurt','2 tbsp','dairy'),
    f('p11','protein','Tofu, firm','60 g','soy'),
    f('p12','protein','Soybeans, cooked','30 g','soy'),
    f('p13','protein','Tempeh','30 g','soy'),
    f('p14','protein','Cottage cheese or paneer, low fat','30 g','dairy'),
    f('d1','dairy','Skimmed milk','1 cup','dairy'),
    f('d2','dairy','Plain low-fat yoghurt','1 cup','dairy'),
    f('d3','dairy','Lactose-free milk','1 cup','dairy'),
    f('d4','dairy','Unsweetened fortified soy drink','1 cup','soy'),
    f('d5','dairy','Unsweetened fortified oat drink','1 cup','gluten'),
    f('d6','dairy','Unsweetened fortified almond drink','1 cup','nut'),
    f('f1','fruit','Apple','1 (90 g)'), f('f2','fruit','Apricots','4 (130 g)'),
    f('f3','fruit','Banana','1 small (60 g)'), f('f4','fruit','Cherries','12 (90 g)'),
    f('f5','fruit','Dates','2 (25 g)'), f('f6','fruit','Figs','2 (50 g)'),
    f('f7','fruit','Grapefruit','1 (160 g)'), f('f8','fruit','Grapes','8 (80 g)'),
    f('f9','fruit','Guava','1 (100 g)'), f('f10','fruit','Kiwi','1 (100 g)'),
    f('f11','fruit','Mango','1/3 (80 g)'), f('f12','fruit','Orange','1 (130 g)'),
    f('f13','fruit','Papaya','1/4 (120 g)'), f('f14','fruit','Peach','1 (130 g)'),
    f('f15','fruit','Pear','1 (100 g)'), f('f16','fruit','Pineapple','3/4 cup (120 g)'),
    f('f17','fruit','Plums','2 (140 g)'), f('f18','fruit','Pomegranate','1/2 (80 g)'),
    f('f19','fruit','Strawberries','16 small (220 g)'), f('f20','fruit','Tangerines','2 (140 g)'),
    f('f21','fruit','Melon','1 cup (170 g)'), f('f22','fruit','Watermelon','1 slice (190 g)'),
    f('f23','fruit','Raisins','2 tbsp (20 g)'), f('f24','fruit','Dried apricots','4 small (25 g)'),
    f('f25','fruit','Prunes','2 small (20 g)'),
    f('v1','veg','Salad leaves, cucumber and tomato','1 cup raw'),
    f('v2','veg','Spinach or other greens, cooked','1/2 cup'),
    f('v3','veg','Broccoli or cauliflower','1/2 cup cooked'),
    f('v4','veg','Courgette or marrow','1/2 cup cooked'),
    f('v5','veg','Aubergine','1/2 cup cooked'),
    f('v6','veg','Peppers','1 cup raw'),
    f('v7','veg','Mushrooms','1/2 cup cooked'),
    f('v8','veg','Green beans or okra','1/2 cup cooked'),
    f('v9','veg','Cabbage','1/2 cup cooked'),
    f('v10','veg','Carrots or beetroot','1/2 cup (75 g)','root'),
    f('v11','veg','Onion','1/2 cup cooked','root'),
    f('v12','veg','Radish or turnip','1 cup raw','root'),
    f('t1','fat','Olive oil','1 tsp (5 g)'), f('t2','fat','Canola oil','1 tsp (5 g)'),
    f('t3','fat','Sunflower oil','1 tsp (5 g)'), f('t4','fat','Avocado','1/8 medium (30 g)'),
    f('t5','fat','Green olives','9 (45 g)'), f('t6','fat','Black olives','7 (57 g)'),
    f('t7','fat','Almonds','6','nut'), f('t8','fat','Walnuts','5 halves','nut'),
    f('t9','fat','Cashews','4','nut'), f('t10','fat','Pistachios','20','nut'),
    f('t11','fat','Peanuts','10','nut'), f('t12','fat','Pumpkin seeds','4 tsp (5 g)'),
    f('t13','fat','Sunflower seeds','1 tbsp (7 g)'), f('t14','fat','Sesame seeds','1 tbsp'),
    f('t15','fat','Tahini','2 tsp (10 g)'), f('t16','fat','Butter','1 tsp (5 g)','dairy')
  ];
  /* Dietary patterns: flags a person following the pattern leaves out. */
  var PATTERNS = {
    all: { label: 'No restriction', out: [] },
    vegetarian: { label: 'Vegetarian (dairy and eggs)', out: ['beef','pork','lamb','poultry','fish','shell'] },
    vegan: { label: 'Vegan', out: ['beef','pork','lamb','poultry','fish','shell','egg','dairy'] },
    jain: { label: 'Jain style (no root vegetables)', out: ['beef','pork','lamb','poultry','fish','shell','egg','root'] },
    pescatarian: { label: 'Fish but no meat', out: ['beef','pork','lamb','poultry'] },
    halal: { label: 'Halal (no pork; choose certified meat)', out: ['pork'] },
    kosher: { label: 'Kosher (no pork or shellfish; meat and milk kept apart)', out: ['pork','shell'], separate: true },
    nobeef: { label: 'No beef', out: ['beef'] },
    nopork: { label: 'No pork', out: ['pork'] }
  };
  var AVOIDS = { gluten: 'Gluten', dairy: 'Dairy', egg: 'Egg', nut: 'Nuts', soy: 'Soy', fish: 'Fish', shell: 'Shellfish' };
  var TIPS = [
    'Drink water through the day. Carry a bottle and add soups or herbal infusions if plain water bores you.',
    'Keep coffee and tea to about two cups a day and swap some for caffeine-free herbal infusions.',
    'Flavour food freely with herbs, spices, lemon, garlic and vinegar. Go easy on salty sauces if you have high blood pressure.',
    'A smaller plate, slower bites and putting the fork down between mouthfuls all help portions settle.',
    'To cut sugar, dilute juice with water, choose unsweetened drinks and reach for fruit instead of sweets.',
    'Grill, bake or steam rather than fry. A non-stick pan needs less oil.',
    'Keep the skins on washed vegetables, cook them lightly, and add beans and whole grains to soups and stews for fibre.',
    'For a big craving: have a fruit, try cinnamon or vanilla for sweetness, or go for a walk first. Plan the treat instead of banning it.',
    'Bloated? Ginger or cinnamon tea can help. For slow digestion, more fibre, water and movement usually help. See a doctor if it persists.'
  ];
  g.DIARY_DATA = { GROUPS: GROUPS, FOODS: FOODS, PATTERNS: PATTERNS, AVOIDS: AVOIDS, TIPS: TIPS };
})(window);
