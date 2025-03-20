import torch
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np

class SDGDataset(Dataset):
    def __init__(self, data, seq_length=10, impute_missing=False):
        """
        Args:
        - data: Pandas DataFrame with columns [id, country, year, yearly_score, goal1, goal2, ..., goal17].
        - seq_length: Number of years used as input history.
        - impute_missing: Boolean to impute missing values with forward fill. If False, rows with missing values are dropped.
        """
        self.data = data
        self.seq_length = seq_length
        self.impute_missing = impute_missing
        self.country_dict = {c: i for i, c in enumerate(data["country"].unique())}
        self.sdg_columns = [f'goal{i}' for i in range(1, 18)]  # goal1, goal2, ..., goal17
        
        # Drop rows with missing values if impute_missing is False
        if not self.impute_missing:
            self.data = self.data.dropna(subset=self.sdg_columns)
        
        self.samples = []
        self.prepare_data()

    def prepare_data(self):
        # Group by country and year to create sequences for each SDG goal
        grouped = self.data.groupby(["country"])
        
        for country, group in grouped:
            group = group.sort_values(by="year")  # Sort by year
            
            for sdg in self.sdg_columns:
                values = group[sdg].values
                for i in range(len(values) - self.seq_length):
                    hist = values[i : i + self.seq_length]
                    target = values[i + self.seq_length]
                    self.samples.append(
                        (
                            self.country_dict[country],
                            self.sdg_columns.index(sdg),
                            hist,
                            target,
                        )
                    )

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        country, sdg, history, target = self.samples[idx]
        return (
            torch.tensor(country, dtype=torch.long),
            torch.tensor(sdg, dtype=torch.long),
            torch.tensor(history, dtype=torch.float32),
            torch.tensor(target, dtype=torch.float32),
        )


# Create dataset & DataLoader
def create_dataloader(data, batch_size=32, seq_length=10, impute_missing=False):
    dataset = SDGDataset(data, seq_length=seq_length, impute_missing=impute_missing)
    return DataLoader(dataset, batch_size=batch_size, shuffle=True)

def estimate_sdg_completion(model, country, sdg, history):
    year = 2023
    while True:
        pred = model(country, sdg, history)
        if pred.item() >= 1.0:  # 100% normalized
            return year
        history = torch.cat((history[:, 1:, :], pred.unsqueeze(1)), dim=1)
        year += 1
        if year > 2100:  # Stop if unrealistic
            return "Not achievable by 2100"
