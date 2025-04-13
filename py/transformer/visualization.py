import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("whitegrid")  # Nice styling

def plot_actual_vs_predicted(model, country_name, sdg_name, history_years=10):
    """
    Plots actual vs predicted SDG attainment for a given country & SDG.
    """
    model.eval()

    # Get historical data
    country_id = dataset.country_dict[country_name]
    sdg_id = dataset.sdg_dict[sdg_name]
    history = df[(df["country"] == country_name) & (df["sdg"] == sdg_name)]
    
    years = history["year"].values[-history_years:]
    attainment = history["attainment"].values[-history_years:]

    # Predict the same historical years
    predicted = []
    for i in range(len(years)):
        pred = model(
            torch.tensor([country_id], dtype=torch.long).to(device),
            torch.tensor([sdg_id], dtype=torch.long).to(device),
            torch.tensor([attainment[: i + 1]], dtype=torch.float32).to(device),
        ).item()
        predicted.append(pred)

    # Plot results
    plt.figure(figsize=(10, 5))
    plt.plot(years, attainment, label="Actual", marker="o", color="blue")
    plt.plot(years, predicted, label="Predicted", marker="x", linestyle="dashed", color="red")

    plt.xlabel("Year")
    plt.ylabel("SDG Attainment (%)")
    plt.title(f"Actual vs. Predicted SDG Attainment ({country_name}, {sdg_name})")
    plt.legend()
    plt.show()

# Example usage
plot_actual_vs_predicted(loaded_model, "USA", "SDG 1")

def plot_future_predictions(model, country_name, sdg_name, future_years=10):
    """
    Plots SDG progress projections into the future.
    """
    model.eval()

    # Get last 10 years of data
    country_id = dataset.country_dict[country_name]
    sdg_id = dataset.sdg_dict[sdg_name]
    history = df[(df["country"] == country_name) & (df["sdg"] == sdg_name)]["attainment"].values[-10:]

    years = list(range(2023, 2023 + future_years))
    future_preds = predict_future(model, country_name, sdg_name, history, years=future_years)

    # Plot results
    plt.figure(figsize=(10, 5))
    plt.plot(years, future_preds, label="Predicted", marker="o", linestyle="dashed", color="green")

    plt.xlabel("Year")
    plt.ylabel("SDG Attainment (%)")
    plt.title(f"Future SDG Predictions ({country_name}, {sdg_name})")
    plt.axhline(y=1.0, color="red", linestyle="--", label="100% Attainment")  # 100% mark
    plt.legend()
    plt.show()

# Example usage
plot_future_predictions(loaded_model, "USA", "SDG 1")

def plot_sdg_completion_years(model, country_name):
    """
    Plots estimated completion year for all SDGs in a given country.
    """
    model.eval()
    completion_years = []

    for sdg_name in dataset.sdg_dict.keys():
        history = df[(df["country"] == country_name) & (df["sdg"] == sdg_name)]["attainment"].values[-10:]
        year = estimate_sdg_completion(model, country_name, sdg_name, history)
        completion_years.append((sdg_name, year))

    # Sort by year
    completion_years.sort(key=lambda x: x[1] if isinstance(x[1], int) else 2100)

    # Extract SDG names & years
    sdgs, years = zip(*completion_years)

    # Plot results
    plt.figure(figsize=(10, 5))
    sns.barplot(x=sdgs, y=years, palette="viridis")
    plt.xlabel("SDG")
    plt.ylabel("Completion Year")
    plt.title(f"Estimated Year Each SDG Reaches 100% ({country_name})")
    plt.xticks(rotation=45)
    plt.ylim(2023, max(years) + 5)  # Dynamic y-axis limit
    plt.show()

# Example usage
plot_sdg_completion_years(loaded_model, "USA")

