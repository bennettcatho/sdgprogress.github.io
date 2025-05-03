import pandas as pd
from config import DATA_PATH, GOALS

def load_data():
    df = pd.read_csv(DATA_PATH)
    df.columns = ['country_code'] + df.columns[1:].tolist()
    df.rename(columns={"Country": "country"}, inplace=True)
    df.insert(0, 'id', range(1, len(df) + 1))
    return df

def get_notnull_pairs(df):
    goals_with_missing = [g for g in GOALS if df[g].isnull().sum() > 0]
    all_pairs = [(c, g) for c in df['country'].unique() for g in GOALS]
    all_values_df = pd.DataFrame(all_pairs, columns=['country', 'goal'])

    missing_data = [(c, g) for g in goals_with_missing 
                    for c in df[df[g].isnull()]['country'].unique()]
    missing_df = pd.DataFrame(missing_data, columns=['country', 'goal']).drop_duplicates()
    notnull_df = all_values_df[~all_values_df.set_index(['country', 'goal'])
                                .index.isin(missing_df.set_index(['country', 'goal']).index)]
    return notnull_df
