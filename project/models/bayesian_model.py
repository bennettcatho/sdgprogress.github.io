from sklearn.linear_model import BayesianRidge

def run_bayesian_regression(df, notnull_df, windows):
    results = []

    for _, row in notnull_df.iterrows():
        country = row['country']
        goal = row['goal']
        data = df[df['country'] == country]
        min_year, max_year = data['year'].min(), data['year'].max()

        # Define prediction years (2018-2023)
        prediction_years = range(2018, 2024)  # Years 2018-2023

        for window in windows:
            for start_year in range(min_year, max_year - window + 1):
                end_year = start_year + window - 1

                # Train the model using data from 'start_year' to 'end_year'
                window_data = data[(data['year'] >= start_year) & (data['year'] <= end_year)]
                if len(window_data) == window:
                    X = window_data[['year']]
                    y = window_data[goal]

                    model = BayesianRidge().fit(X, y)

                    # For each year we want to predict, loop through the years 2018–2023
                    for pred_year in prediction_years:
                        actual = data[data['year'] == pred_year][goal]
                        actual_val = actual.values[0] if not actual.empty else None
                        pred_val = model.predict([[pred_year]])[0]

                        results.append({
                            'country': country,
                            'goal': goal,
                            'window': window,
                            'start_year': start_year,
                            'end_year': end_year,
                            'slope': model.coef_[0],
                            'intercept': model.intercept_,
                            'r_squared': model.score(X, y),
                            'alpha_': model.alpha_,
                            'lambda_': model.lambda_,
                            'prediction_year': pred_year,
                            'prediction_value': pred_val,
                            'actual_value': actual_val,
                            'difference': pred_val - actual_val if actual_val is not None else None
                        })

    return results
