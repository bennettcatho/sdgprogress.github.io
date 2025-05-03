from sklearn.linear_model import Ridge
import numpy as np

def run_ridge_autotune_regression(df, notnull_df, windows, alphas=[0.01, 0.1, 1.0, 10.0, 100.0]):
    results = []

    for _, row in notnull_df.iterrows():
        country = row['country']
        goal = row['goal']
        data = df[df['country'] == country]
        min_year, max_year = data['year'].min(), data['year'].max()

        for window in windows:
            for start_year in range(min_year, max_year - window + 1):
                end_year = start_year + window - 1
                pred_year = end_year + 1

                if pred_year > max_year:
                    continue

                window_data = data[(data['year'] >= start_year) & (data['year'] <= end_year)]
                if len(window_data) == window:
                    X = window_data[['year']]
                    y = window_data[goal]

                    best_model = None
                    best_score = -np.inf
                    best_alpha = None

                    for alpha in alphas:
                        model = Ridge(alpha=alpha).fit(X, y)
                        score = model.score(X, y)
                        if score > best_score:
                            best_model = model
                            best_score = score
                            best_alpha = alpha

                    prediction = best_model.predict([[pred_year]])[0]
                    actual = data[data['year'] == pred_year][goal]
                    actual_val = actual.values[0] if not actual.empty else None

                    results.append({
                        'country': country,
                        'goal': goal,
                        'window': window,
                        'start_year': start_year,
                        'end_year': end_year,
                        'alpha': best_alpha,
                        'slope': best_model.coef_[0],
                        'intercept': best_model.intercept_,
                        'r_squared': best_score,
                        'prediction_year': pred_year,
                        'prediction_value': prediction,
                        'actual_value': actual_val,
                        'difference': prediction - actual_val if actual_val is not None else None
                    })

    return results
