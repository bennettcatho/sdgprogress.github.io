def predict_future(model, country_name, sdg_name, history, years=7):
    model.eval()
    future_preds = []

    country = torch.tensor(dataset.country_dict[country_name], dtype=torch.long).unsqueeze(0).to(device)
    sdg = torch.tensor(dataset.sdg_dict[sdg_name], dtype=torch.long).unsqueeze(0).to(device)
    history = torch.tensor(history, dtype=torch.float32).unsqueeze(0).to(device)

    for _ in range(years):
        pred = model(country, sdg, history).item()
        future_preds.append(pred)
        history = torch.cat((history[:, 1:], torch.tensor([[pred]]).to(device)), dim=1)

    return future_preds

# Example Usage
history = df[(df["country"] == "USA") & (df["sdg"] == "SDG 1")]["attainment"].values[-10:]  # Last 10 years
future_preds = predict_future(model, "USA", "SDG 1", history, years=7)
print("Predicted SDG attainment for next years:", future_preds)
