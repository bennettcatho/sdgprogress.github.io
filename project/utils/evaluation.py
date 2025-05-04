from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import pandas as pd

def evaluate(regression_results):
    df = pd.DataFrame(regression_results).dropna(subset=['actual_value'])

    if df.empty:
        return pd.DataFrame(columns=['country', 'goal', 'window', 'rmse', 'mape', 'r_squared'])

    summary = []

    for (country, goal, window), group in df.groupby(['country', 'goal', 'window']):
        
        group = group[group['actual_value'] != 0] # Remove zero actuals to avoid MAPE issues
        if group.empty:
            continue

        y_true = group['actual_value']
        y_pred = group['prediction_value']

        rmse = (mean_squared_error(y_true, y_pred))**(1/2)
        mape = mean_absolute_percentage_error(y_true, y_pred)
        r_squared = group['r_squared'].mean()

        summary.append({
            'country': country,
            'goal': goal,
            'window': window,
            'rmse': rmse,
            'mape': mape,
            'r_squared': r_squared
        })

    return pd.DataFrame(summary)