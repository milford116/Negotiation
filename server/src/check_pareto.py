import itertools

# 1) Re-define your issues+options exactly as in your callbacks:
issues = [
    {
        'name': 'salary',
        'options': [
            {'label': '70k–80k',   'valueA':10, 'valueB':2},
            {'label': '80k–90k',   'valueA':8,  'valueB':4},
            {'label': '90k–100k',  'valueA':6,  'valueB':6},
            {'label': '100k–110k', 'valueA':4,  'valueB':8},
            {'label': '110k–120k', 'valueA':2,  'valueB':10},
        ]
    },
    {
        'name': 'bonuses',
        'options': [
            {'label': '0–5k',     'valueA':5,  'valueB':3},
            {'label': '5k–10k',   'valueA':4,  'valueB':6},
            {'label': '10k–15k',  'valueA':3,  'valueB':9},
            {'label': '15k–20k',  'valueA':2,  'valueB':12},
            {'label': '20k–25k',  'valueA':1,  'valueB':15},
        ]
    },
    {
        'name': 'stockOptions',
        'options': [
            {'label': '50k–60k',  'valueA':10, 'valueB':2},
            {'label': '60k–70k',  'valueA':8,  'valueB':4},
            {'label': '70k–80k',  'valueA':6,  'valueB':6},
            {'label': '80k–90k',  'valueA':4,  'valueB':8},
            {'label': '90k–100k', 'valueA':2,  'valueB':10},
        ]
    },
    {
        'name': 'vacationDays',
        'options': [
            {'label': '10–11d',   'valueA':15, 'valueB':1},
            {'label': '12–13d',   'valueA':12, 'valueB':2},
            {'label': '14–15d',   'valueA':9,  'valueB':3},
            {'label': '16–17d',   'valueA':6,  'valueB':4},
            {'label': '18–19d',   'valueA':3,  'valueB':5},
        ]
    }
]

# 2) Build all 625 combos
combos = list(itertools.product(*[iss['options'] for iss in issues]))

def find_and_print_win_wins(threshold=25):
    found = []
    for combo in combos:
        sumA = sum(opt['valueA'] for opt in combo)
        sumB = sum(opt['valueB'] for opt in combo)
        if sumA >= threshold and sumB >= threshold:
            # build a mapping of issue→chosen label
            mapping = {issues[i]['name']: combo[i]['label'] for i in range(len(issues))}
            found.append((mapping, sumA, sumB))

    if not found:
        print("→ No win–win deals above threshold.")
    else:
        print(f"Deals with both scores ≥ {threshold}:\n")
        for mapping, uH, uE in found:
            # pretty‐print each deal
            issues_str = ", ".join(f"{k}={v}" for k,v in mapping.items())
            print(f"  HR={uH:2d}, Emp={uE:2d}  |  {issues_str}")

# 3) Run it
find_and_print_win_wins(25)
