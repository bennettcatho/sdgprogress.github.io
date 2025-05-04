import pandas as pd

# Load the CSV
all_evals = pd.read_csv("results/all_model_evaluations.csv")

# Store best models for each country-goal-window combo
best_models = []

# Iterate over unique forecast windows
for window in all_evals['window'].unique():
    print(f"Window: {window}")
    
    # Filter evaluations for the current window
    window_group = all_evals[all_evals['window'] == window]
    grouped = window_group.groupby(['country', 'goal'])

    for (country, goal), group in grouped:
        best_rmse_row = group.loc[group['rmse'].idxmin()]
        best_mape_row = group.loc[group['mape'].idxmin()]
        best_r_squared_row = group.loc[group['r_squared'].idxmax()]

        best_models.append({
            'window': window,
            'country': country,
            'goal': goal,
            'best_rmse_model': best_rmse_row['model'],
            'best_rmse': best_rmse_row['rmse'],
            'best_mape_model': best_mape_row['model'],
            'best_mape': best_mape_row['mape'],
            'best_r_squared_model': best_r_squared_row['model'],
            'best_r_squared': best_r_squared_row['r_squared'],
        })

# Create DataFrame of best models
best_models_df = pd.DataFrame(best_models)

# Print per-window model rankings
for window in best_models_df['window'].unique():
    print(f"\nWindow {window}🏆 Overall RMSE Ranking by Count:")
    print(best_models_df[best_models_df['window'] == window]['best_rmse_model'].value_counts())

    print(f"\nWindow {window}🏆 Overall MAPE Ranking by Count:")
    print(best_models_df[best_models_df['window'] == window]['best_mape_model'].value_counts())

    print(f"\nWindow {window}🏆 Overall R² Ranking by Count:")
    print(best_models_df[best_models_df['window'] == window]['best_r_squared_model'].value_counts())

# ➕ Find the "overall best window" using average metrics
window_summary = best_models_df.groupby('window').agg({
    'best_rmse': 'mean',
    'best_mape': 'mean',
    'best_r_squared': 'mean'
}).reset_index()

# Normalize metrics for fair comparison (min-max scaling)
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
normalized = pd.DataFrame(scaler.fit_transform(window_summary[['best_rmse', 'best_mape', 'best_r_squared']]),
                          columns=['rmse_norm', 'mape_norm', 'r2_norm'])
window_summary = pd.concat([window_summary, normalized], axis=1)

# Composite score: lower RMSE & MAPE = better, higher R² = better
# So invert R² normalization (since MinMaxScaler makes low = bad)
window_summary['composite_score'] = (
    (1 - window_summary['rmse_norm']) +
    (1 - window_summary['mape_norm']) +
    window_summary['r2_norm']
)
# print all window_summary
print("\n🏆 Overall Window Summary:"
      "\n", window_summary[['window', 'best_rmse', 'best_mape', 'best_r_squared', 'composite_score']])

# Pick the window with the highest composite score
best_window = window_summary.loc[window_summary['composite_score'].idxmax()]

print("\n🏅 Overall Best Window Based on Composite Score:")
print(best_window[['window', 'composite_score']])
