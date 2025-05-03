from sklearn.linear_model import LinearRegression

def run_linear_regression(df, notnull_df, windows):
    from sklearn.metrics import r2_score
    results = []

    for _, row in notnull_df.iterrows():
        country, goal = row['country'], row['goal']
        data = df[df['country'] == country]
        min_year, max_year = data['year'].min(), data['year'].max()

        for window in windows:
            for start in range(min_year, max_year - window + 1):
                end = start + window - 1
                pred_year = end + 1
                if pred_year > max_year:
                    continue

                train_data = data[(data['year'] >= start) & (data['year'] <= end)]
                if len(train_data) == window:
                    X = train_data[['year']]
                    y = train_data[goal]
                    model = LinearRegression().fit(X, y)

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
