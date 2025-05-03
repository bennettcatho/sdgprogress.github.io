from config import GOALS
from utils.preprocessing import load_data, get_notnull_pairs
from models.linear_model import run_linear_regression
from utils.evaluation import evaluate

import warnings; warnings.filterwarnings("ignore", category=UserWarning)

windows = [5, 10, 15, 20]

df = load_data()
notnull_df = get_notnull_pairs(df)
results = run_linear_regression(df, notnull_df, windows)
summary = evaluate(results)

print(summary.head())
