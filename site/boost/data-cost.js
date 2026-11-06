/* Cost decisions: cost behaviour, activity analysis, cost estimation. Our own words, from the cost pathway units (cost-pathways). Same dose shape as data.js. */
(function(){var D=window.BOOST_DATA;if(!D)return;
D.subjects.cost="Cost decisions";
var T={"costbeh": "Cost behaviour", "costact": "Activity analysis", "costest": "Cost estimation"};Object.keys(T).forEach(function(k){D.topics[k]=["cost",T[k]];});
var C=[
 [
  "costbeh",
  "Fixed, variable and mixed cost.",
  "Total fixed cost stays put when volume moves. Variable cost per unit stays put. So fixed cost per unit falls as volume rises.",
  [
   "Split cost: fixed or variable",
   "Spread fixed over units",
   "Watch unit cost as volume moves"
  ],
  "Pick one cost in your own work. Say whether it is fixed, variable or mixed, and what would make it jump (a step).",
  "Output falls. Which part of unit cost rises?",
  [
   "Fixed cost per unit",
   "Variable cost per unit",
   "Neither"
  ],
  "The fixed part per unit. Variable cost per unit does not change."
 ],
 [
  "costbeh",
  "One yearly overhead rate, not a seasonal one.",
  "Quarterly volume swings make unit cost swing. A predetermined overhead rate from a yearly budget (Y = a + bX) removes the swing.",
  [
   "Budget Y = a + bX",
   "Divide by yearly units",
   "Apply one rate all year"
  ],
  "Write your own cost formula Y = a + bX for one cost pool, and name the driver X.",
  "Fixed 720,000, variable 0.60 a unit, 200,000 units. What is the rate?",
  [
   "4.20",
   "3.60",
   "0.60"
  ],
  "840,000 / 200,000 = 4.20 cu per unit."
 ],
 [
  "costbeh",
  "Variable and absorption costing: why profit moves without sales.",
  "Absorption income minus variable income = fixed overhead per unit x (units made minus units sold). Build stock and profit looks better. It is not better.",
  [
   "Compare units made and sold",
   "Fixed cost moves into stock",
   "Judge profit on contribution"
  ],
  "Find one place where a manager is paid on absorption profit. Write the inventory check that would stop over-production.",
  "Made more than sold. Which income is higher?",
  [
   "Absorption",
   "Variable",
   "Equal"
  ],
  "Absorption income, by fixed overhead per unit x the stock increase."
 ],
 [
  "costact",
  "Activity pools and rates.",
  "Stage 1 puts resource cost into activity pools. Stage 2 multiplies each activity rate by use. Unit, batch and product costs go to products. Organisation-sustaining and idle cost stay out.",
  [
   "Pool cost by activity",
   "Divide by driver total",
   "Multiply rate by use"
  ],
  "List four activities in a team you know. Give each one a driver you can count.",
  "Which cost is NOT put on products in activity costing?",
  [
   "Organisation-sustaining cost",
   "Setup cost",
   "Machine-hour cost"
  ],
  "Organisation-sustaining cost and idle capacity."
 ],
 [
  "costact",
  "Cost-to-serve: same sale, different profit.",
  "Two customers can buy the same value at the same markup and leave very different profit once delivery, order handling and line picking are counted.",
  [
   "Count orders, deliveries, lines",
   "Price each at its rate",
   "Subtract from gross margin"
  ],
  "Choose one customer. Count deliveries, orders and lines for a month. Price the service at the rates.",
  "Customer 2 loses money at the same markup. What are three fixes?",
  [
   "Move to electronic orders, set minimums, charge delivery",
   "Raise nothing",
   "Drop the customer at once"
  ],
  "Move to electronic orders, set a minimum order size, charge for delivery."
 ],
 [
  "costact",
  "Relevant cost: decide on what changes.",
  "Ask two questions of every line. Is it in the future? Does it differ between the choices? If not, ignore it. Add the opportunity cost of the best forgone use.",
  [
   "Is it in the future?",
   "Does it differ between choices?",
   "Add the opportunity cost"
  ],
  "Take one make-or-buy choice. Cross out sunk and unavoidable cost. Add the opportunity cost. Decide.",
  "Allocated head-office cost: relevant to dropping a product?",
  [
   "No",
   "Yes",
   "Only if large"
  ],
  "No. It does not change with the decision unless it is avoidable."
 ],
 [
  "costest",
  "High-low method.",
  "Use the highest and lowest activity months. Variable rate = change in cost / change in activity. Fixed = low cost minus (low activity x rate). Quick, but only two points.",
  [
   "Find high and low months",
   "Rate = cost change / activity change",
   "Fixed = low cost minus low activity x rate"
  ],
  "Take 12 months of any cost and activity. Find the high and low months. Work out the rate.",
  "Fixed cost comes out negative. First thing to do?",
  [
   "Check the formula",
   "Accept it",
   "Drop the data"
  ],
  "Check the formula: it must be low cost minus (low activity x rate)."
 ],
 [
  "costest",
  "Least-squares regression and how far to trust it.",
  "Regression uses every month. It gives a slope, an intercept, R squared (share of cost explained) and a standard error to set budget tolerance. Stay inside the range of data you have.",
  [
   "Use every month",
   "Read R squared and error",
   "Stay inside the data range"
  ],
  "Run your 12 months in the Estimator. Compare high-low with regression. Say which one you would put in a budget.",
  "Why prefer regression to high-low?",
  [
   "It uses all data and shows fit and error",
   "It is faster",
   "It needs fewer months"
  ],
  "It uses all points, shows fit (R squared) and error, and is less hurt by two odd months."
 ],
 [
  "costest",
  "Capstone: pick the right tool and defend a quote.",
  "Eight mixed cases, no labels. Choose break-even, activity costing, relevant cost, constraint ranking or costing-method reconciliation. Then put the answer into a job quote.",
  [
   "Name the case type",
   "Pick the tool",
   "Defend the quote"
  ],
  "Quote one real job with departmental rates. Show the plantwide quote beside it. Explain the gap in two lines.",
  "The books are the same under both rates. Why does the choice still matter?",
  [
   "It decides bid prices and win rate",
   "It does not matter",
   "It changes tax only"
  ],
  "It changes which bids you win and which lose money."
 ]
];
C.forEach(function(c){D.cards.push(c);});
}());
