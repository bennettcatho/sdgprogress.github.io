import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error

def evaluate(regression_results):
    summary = []
    df = pd.DataFrame(regression_results).dropna(subset=['actual_value'])

    for (country, goal, window), group in df.groupby(['country', 'goal', 'window']):
        y_true, y_pred = group['actual_value'], group['prediction_value']
        summary.append({
            'country': country,
            'goal': goal,
            'window': window,
            'rmse': mean_squared_error(y_true, y_pred),
            'mape': mean_absolute_percentage_error(y_true, y_pred),
            'r_squared': group['r_squared'].mean()
        })

    return pd.DataFrame(summary)
