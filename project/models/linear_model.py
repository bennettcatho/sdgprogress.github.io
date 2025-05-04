from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

def run_linear_regression(df, notnull_df, windows):
    results = []

    # Loop through each country-goal pair in the notnull dataframe
    for _, row in notnull_df.iterrows():
        country, goal = row['country'], row['goal']
        data = df[df['country'] == country]
        min_year, max_year = 2000, 2018

        # We want to predict the years 2018 to 2023 regardless of the window size
        prediction_years = range(2019, 2024)  # Years 2018-2023

        # Loop through all windows
        for window in windows:
            for start in range(min_year, max_year - window + 1):
                end = start + window - 1

                # Train the model using data from 'start' to 'end'
                train_data = data[(data['year'] >= start) & (data['year'] <= end)]
                if len(train_data) == window:
                    X = train_data[['year']]
                    y = train_data[goal]
                    model = LinearRegression().fit(X, y)

                    # For each year we want to predict, loop through the years 2018–2023
                    for pred_year in prediction_years:
                        actual = data[data['year'] == pred_year][goal]
                        actual_val = actual.values[0] if not actual.empty else None
                        pred_val = model.predict([[pred_year]])[0]

                        results.append({
                            'country': country,
                            'goal': goal,
                            'window': window,
                            'start_year': start,
                            'end_year': end,
                            'slope': model.coef_[0],
                            'intercept': model.intercept_,
                            'r_squared': model.score(X, y),
                            'prediction_year': pred_year,
                            'prediction_value': pred_val,
                            'actual_value': actual_val,
                            'difference': pred_val - actual_val if actual_val is not None else None
                        })

    return results
