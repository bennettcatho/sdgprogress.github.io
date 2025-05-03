from config import GOALS
from utils.preprocessing import load_data, get_notnull_pairs
from utils.evaluation import evaluate
from models.linear_model import run_linear_regression
from models.bayesian_model import run_bayesian_regression
from models.ridge_model import run_ridge_regression
from models.ridge_autotune_model import run_ridge_autotune_regression

import pandas as pd

# Settings
windows = [5, 10, 15, 20]
alphas = [0.01, 0.1, 1.0, 10.0, 100.0]

# Load and prepare data
df = load_data()
notnulls = get_notnull_pairs(df)

# Run all models
print("Running Linear Regression...")
linear_results = run_linear_regression(df, notnulls, windows)
linear_eval = evaluate(linear_results)
linear_eval['model'] = 'Linear'

print("Running Bayesian Regression...")
bayesian_results = run_bayesian_regression(df, notnulls, windows)
bayesian_eval = evaluate(bayesian_results)
bayesian_eval['model'] = 'Bayesian'

print("Running Ridge Regression...")
ridge_results = run_ridge_regression(df, notnulls, windows, alpha=1.0)
ridge_eval = evaluate(ridge_results)
ridge_eval['model'] = 'Ridge'

print("Running Ridge Regression with Autotuning...")
ridge_auto_results = run_ridge_autotune_regression(df, notnulls, windows, alphas)
ridge_auto_eval = evaluate(ridge_auto_results)
ridge_auto_eval['model'] = 'Ridge_Auto'

# Combine all evaluations
all_evals = pd.concat([linear_eval, bayesian_eval, ridge_eval, ridge_auto_eval], ignore_index=True)

# Print summary: Best model by RMSE and MAPE for each (country, goal)
print("\n🏁 Best Model per Country+Goal based on RMSE and MAPE:")
best_models = []

grouped = all_evals.groupby(['country', 'goal'])
for (country, goal), group in grouped:
    best_rmse_row = group.loc[group['rmse'].idxmin()]
    best_mape_row = group.loc[group['mape'].idxmin()]

    best_models.append({
        'country': country,
        'goal': goal,
        'best_rmse_model': best_rmse_row['model'],
        'best_rmse': best_rmse_row['rmse'],
        'best_rmse_window': best_rmse_row['window'],
        'best_mape_model': best_mape_row['model'],
        'best_mape': best_mape_row['mape'],
        'best_mape_window': best_mape_row['window']
    })

best_models_df = pd.DataFrame(best_models)
print(best_models_df.head())

# Optional: Rankings
print("\n🏆 Overall RMSE Ranking by Count:")
print(best_models_df['best_rmse_model'].value_counts())

print("\n🏆 Overall MAPE Ranking by Count:")
print(best_models_df['best_mape_model'].value_counts())

# Save results
best_models_df.to_csv("results/best_models_summary.csv", index=False)
all_evals.to_csv("results/all_model_evaluations.csv", index=False)
print("\n✅ All evaluations saved to CSV files.")
# Call plotting function after everything is done
from generate_plots import generate_and_save_plots
generate_and_save_plots()
print("✅ Plots generated and saved in 'results/'")
# End of script