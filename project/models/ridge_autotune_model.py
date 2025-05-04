from sklearn.linear_model import Ridge
import numpy as np

def run_ridge_autotune_regression(df, notnull_df, windows, alphas=[0.01, 0.1, 1.0, 10.0, 100.0]):
    results = []

    for _, row in notnull_df.iterrows():
        country = row['country']
        goal = row['goal']
        data = df[df['country'] == country]
        min_year, max_year = 2000, 2018

        # Define prediction years (2019-2023)
        prediction_years = range(2019, 2024) 

        for window in windows:
            for start_year in range(min_year, max_year - window + 1):
                end_year = start_year + window - 1

                # Train the model using data from 'start_year' to 'end_year'
                window_data = data[(data['year'] >= start_year) & (data['year'] <= end_year)]
                if len(window_data) == window:
                    X = window_data[['year']]
                    y = window_data[goal]

                    best_model = None
                    best_score = -np.inf
                    best_alpha = None

                    # Tune model with different alphas
                    for alpha in alphas:
                        model = Ridge(alpha=alpha).fit(X, y)
                        score = model.score(X, y)
                        if score > best_score:
                            best_model = model
                            best_score = score
                            best_alpha = alpha

                    # For each year we want to predict, loop through the years 2018–2023
                    for pred_year in prediction_years:
                        actual = data[data['year'] == pred_year][goal]
                        actual_val = actual.values[0] if not actual.empty else None
                        pred_val = best_model.predict([[pred_year]])[0]

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
                            'prediction_value': pred_val,
                            'actual_value': actual_val,
                            'difference': pred_val - actual_val if actual_val is not None else None
                        })

    print("Best alpha values for each country-goal pair:")
    for result in results:
        print(f"Country: {result['country']}, Goal: {result['goal']}, Best Alpha: {result['alpha']}")
    return results
