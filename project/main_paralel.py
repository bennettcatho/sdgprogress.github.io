from concurrent.futures import ThreadPoolExecutor
from config import GOALS, WINDOWS
from utils.preprocessing import load_data, get_notnull_pairs
from utils.evaluation import evaluate
from models.linear_model import run_linear_regression
from models.bayesian_model import run_bayesian_regression
from models.ridge_model import run_ridge_regression
from models.ridge_autotune_model import run_ridge_autotune_regression
from concurrent.futures import ThreadPoolExecutor
import time
import pandas as pd

import warnings
warnings.filterwarnings("ignore", category=UserWarning)
alphas = [0.01, 0.1, 1.0, 10.0, 100.0]

# Helper function to run a model and evaluation
def run_and_evaluate(model_func, df, notnulls, WINDOWS):
    results = model_func(df, notnulls, WINDOWS)
    return evaluate(results)

# Start timer
start = time.time()

# Load and prepare data
df = load_data()
notnulls = get_notnull_pairs(df)

# Define models and their parameters
models = [
    (run_linear_regression, df, notnulls, WINDOWS),
    (run_bayesian_regression, df, notnulls, WINDOWS),
    (run_ridge_regression, df, notnulls, WINDOWS),
    (run_ridge_autotune_regression, df, notnulls, WINDOWS),
]

# Parallelize the execution of the models
with ThreadPoolExecutor() as executor:
    futures = [executor.submit(run_and_evaluate, model_func, *params) for model_func, *params in models]

    results = [future.result() for future in futures]

# Combine and evaluate models
print("Combining evaluations... time: ", time.strftime("%H:%M:%S", time.gmtime(time.time() - start)))
all_evals = pd.concat(results, ignore_index=True)

# Further steps (Finding best models, etc.) remain unchanged
# Example of calculating and storing best models
best_models = []

grouped = all_evals.groupby(['country', 'goal'])
for (country, goal), group in grouped:
    best_rmse_row = group.loc[group['rmse'].idxmin()]
    best_mape_row = group.loc[group['mape'].idxmin()]
    best_r_squared_row = group.loc[group['r_squared'].idxmin()]

    best_models.append({
        'country': country,
        'goal': goal,
        'best_rmse_model': best_rmse_row['model'],
        'best_rmse': best_rmse_row['rmse'],
        'best_rmse_window': best_rmse_row['window'],
        'best_mape_model': best_mape_row['model'],
        'best_mape': best_mape_row['mape'],
        'best_mape_window': best_mape_row['window'],
        'best_r_squared': best_r_squared_row['r_squared'],
        'best_r_squared_window': best_r_squared_row['window'],
    })

best_models_df = pd.DataFrame(best_models)

# Final outputs
best_models_df.to_csv("results/best_models_summary.csv", index=False)
all_evals.to_csv("results/all_model_evaluations.csv", index=False)

print("Time taken to find best models: ", time.strftime("%H:%M:%S", time.gmtime(time.time() - start)))
print("Step took", time.time() - start, "seconds")
