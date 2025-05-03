import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error

def evaluate(regression_results):
    # Convert results into DataFrame and drop rows with NaN in 'actual_value'
    df = pd.DataFrame(regression_results).dropna(subset=['actual_value'])

    # If no valid data is present, return an empty DataFrame
    if df.empty:
        return pd.DataFrame(columns=['country', 'goal', 'window', 'rmse', 'mape', 'r_squared'])

    summary = []

    # Group by country, goal, and window to compute the metrics
    for (country, goal, window), group in df.groupby(['country', 'goal', 'window']):
        y_true = group['actual_value']
        y_pred = group['prediction_value']

        # Calculate RMSE and MAPE
        rmse = mean_squared_error(y_true, y_pred)  # sqrt of MSE
        mape = mean_absolute_percentage_error(y_true, y_pred)
        
        # Mean R^2 for the group
        r_squared = group['r_squared'].mean()

        # Append the metrics
        summary.append({
            'country': country,
            'goal': goal,
            'window': window,
            'rmse': rmse,
            'mape': mape,
            'r_squared': r_squared
        })

    return pd.DataFrame(summary)
